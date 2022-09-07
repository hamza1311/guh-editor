import { LitElement, css, html, PropertyDeclaration } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
    keymap,
    highlightSpecialChars,
    drawSelection,
    dropCursor,
    rectangularSelection,
    EditorView, ViewUpdate,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import {
    defaultHighlightStyle,
    syntaxHighlighting,
    indentOnInput,
    bracketMatching,
    foldGutter,
    foldKeymap,
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import {
    autocompletion,
    completionKeymap,
    closeBrackets,
    closeBracketsKeymap,
} from '@codemirror/autocomplete';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { GFM } from '@lezer/markdown';

export interface UploadedImage {
    url: string,
    alt: string
}

export const DEFAULT_EXTENSIONS = [
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    highlightSelectionMatches(),
    markdown({
        codeLanguages: languages,
        extensions: GFM,
    }),
    keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
    ]),
]

@customElement('guh-editor')
export class GuhEditor extends LitElement {
    private editorView?: EditorView;
    private editorElement?: HTMLDivElement;

    @property()
    value: string = '';

    @property( { type: Boolean })
    autoFocus: boolean = false

    @property()
    readonly: boolean = false

    @property({
        attribute: false,
        type: Function
    })
    uploadMedia?: (files: File[]) => UploadedImage[];

    connectedCallback() {
        super.connectedCallback();
        const self = this;

        this.editorElement = document.createElement('div');
        this.editorView = new EditorView({
            doc: this.value,
            extensions: [
                ...DEFAULT_EXTENSIONS,
                EditorView.updateListener.of((update) => this.onEditorUpdate(update)),
                EditorState.readOnly.of(this.readonly),
                EditorView.domEventHandlers({
                    // this needs to be the element, not this object
                    drop: this.drop.bind(self),
                    paste: this.paste.bind(self),
                })
            ],
            parent: this.editorElement,
            root: this.shadowRoot ?? undefined,
        });


        if (this.readonly) {
            requestAnimationFrame(() => {
                if (this.editorView?.contentDOM) {
                    this.editorView.contentDOM.contentEditable = 'false';
                }
            })
        }
        /*
        // docs
        placeholder: @codemirror/view -> placeholder extension
        */
        if (this.autoFocus) {
            requestAnimationFrame(() => this.editorView?.focus())
        }
    }

    requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration) {
        super.requestUpdate(name, oldValue, options);
        if (name === 'value') {
            this.replaceValue(this.value)
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.editorView?.destroy();
    }

    render() {
        return html` ${this.editorElement} `;
    }

    private drop(event: DragEvent)  {
        const files = event.dataTransfer?.files
        if (files && files.length > 0) {
            this.handleMediaUpload(files)
        }
    }

    private paste(event: ClipboardEvent) {
        const files = event.clipboardData?.files
        if (files && files.length > 0) {
            this.handleMediaUpload(files)
        }
    }

    private handleMediaUpload(fileList: FileList) {
        if (this.uploadMedia === undefined || this.editorView === undefined) { return }
        const files = [...fileList].filter(it => it.type.startsWith('image/') || it.type.startsWith('video/'))
        if (files.length !== fileList.length) {
            alert('only image or video files can be uploaded')
        } else {
            console.log(this.uploadMedia)
            const uploaded = this.uploadMedia(files);
            const toInsert = uploaded.map(it => `![${it.alt}](${it.url})`).join('\n')

            const state = this.editorView.state;
            const transaction = state?.update({
                changes: {
                    from: state.doc.length,
                    insert: `\n${toInsert}`
                }
            })
            this.editorView?.dispatch(transaction);
        }
    }

    private replaceValue(value: string) {
        const state = this.editorView?.state;
        const transaction = state?.update({
            changes: {
                from: 0,
                to: state?.doc.length,
                insert: value
            }
        })
        if (transaction) {
            this.editorView?.dispatch(transaction);
        }
    }

    private onEditorUpdate(update: ViewUpdate) {
        // console.groupCollapsed('onEditorUpdate')
        if (update.docChanged) {
            const event = new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value: update.state.doc.toString()
                }
            })
            this.dispatchEvent(event)
        }
        // console.log(update)
        // console.log('viewportChanged', update.viewportChanged)
        // console.log('heightChanged', update.heightChanged)
        // console.log('geometryChanged', update.geometryChanged)
        // console.log('focusChanged', update.focusChanged)
        // console.log('docChanged', update.docChanged)
        // console.log('selectionSet', update.selectionSet)
        // console.groupEnd()
    }

    clear() {
        this.replaceValue('')
    }

    static styles = css``;
}
