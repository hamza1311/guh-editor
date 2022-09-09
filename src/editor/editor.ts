import { html, PropertyDeclaration, LitElement, unsafeCSS } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { keymap, highlightSpecialChars, drawSelection, dropCursor, EditorView, ViewUpdate } from '@codemirror/view';
import { EditorState, Extension } from '@codemirror/state';
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching } from '@codemirror/language';
import { deleteLine, history, historyKeymap, standardKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { GFM } from '@lezer/markdown';
import '../toolbar';
import '../preview';
import type { Tab } from '../toolbar';
import editorStyles from './editor.scss?inline'

export interface UploadedImage {
    url: string,
    alt: string
}

export const DEFAULT_EXTENSIONS = [
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    highlightSelectionMatches(),
    markdown({
        codeLanguages: languages,
        extensions: GFM,
    }),
    keymap.of([
        ...closeBracketsKeymap,
        ...standardKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...completionKeymap,
    ]),
];

const defaultTheme = EditorView.theme({
    '&': {
    },
    '&.cm-focused': {
        outline: 'none !important',
        border: '1px solid blue !important',
    },
    '.cm-focused': {
        margin: '0.5em',
        border: '10px solid red',
    },
    '.cm-scroller': {
        fontFamily: 'inherit',
        fontSize: 'inherit',
        overflow: 'auto',
        minHeight: '100px',
        maxHeight: '500px',
    },
    '.cm-content': {
        overflow: 'auto',
        minHeight: '100px',
        padding: '4px 4px',
        flex: '1',
    },
});

@customElement('guh-editor')
export class Editor extends LitElement {
    /*
    * Get the inner raw codemirror editor vide
    *
    * Prefer to use the public APIs, only fallback back to using the raw editor view
    * only if necessary
    */
    editorView?: EditorView;
    private editorElement?: HTMLDivElement;

    @property()
    value = '';

    @property({ type: Boolean })
    autoFocus = false;

    @property()
    readonly = false;

    @property({ attribute: false, type: Function })
    uploadMedia?: (files: File[]) => UploadedImage[];

    @property({ attribute: false })
    extensions: Extension[] = DEFAULT_EXTENSIONS;

    @property({ attribute: false })
    theme: Extension = defaultTheme;

    /* Preview or edit tab */
    @state()
    private _tab: Tab = 'edit';

    connectedCallback() {
        super.connectedCallback();
        // this needs to be the element, not this object
        const drop = this.drop.bind(self)
        const paste = this.paste.bind(self)

        this.editorElement = document.createElement('div');
        this.editorElement.id = 'cm-container';

        this.editorView = new EditorView({
            doc: this.value,
            extensions: [
                ...this.extensions,
                EditorView.updateListener.of((update) => this.onEditorUpdate(update)),
                EditorState.readOnly.of(this.readonly),
                EditorView.domEventHandlers({ drop, paste }),
                this.theme,
                keymap.of([
                    {
                        key: 'Shift-Delete',
                        run: deleteLine,
                    },
                    {
                        key: 'Ctrl-b',
                        run: (view) => this.formatText(view, '**'),
                    },
                    {
                        key: 'Ctrl-i',
                        run: (view) => this.formatText(view, '_'),
                    },
                    {
                        key: 'Ctrl-e',
                        run: (view) => this.formatText(view, '`'),
                    },
                    {
                        key: 'Ctrl-k',
                        run: (view) => this.formatText(view, '[', '](url)'),
                    },
                ]),
            ],
            parent: this.editorElement,
            root: this.shadowRoot ?? undefined,
        });


        if (this.readonly) {
            requestAnimationFrame(() => {
                if (this.editorView?.contentDOM) {
                    this.editorView.contentDOM.contentEditable = 'false';
                }
            });
        }

        if (this.autoFocus) {
            requestAnimationFrame(() => this.editorView?.focus());
        }
    }

    requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration) {
        super.requestUpdate(name, oldValue, options);
        if (name === 'value') {
            this.replaceValue(this.value);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.editorView?.destroy();
    }

    private onTabSelect(e: CustomEvent<{ tab: Tab }>) {
        this._tab = e.detail.tab;
        if (this._tab === 'edit') {
            requestAnimationFrame(() => this.editorView?.focus());
        }
    }

    private formatText(view: EditorView, left: string, right: string = left): boolean {
        const range = view.state.selection.ranges[0];
        const text = view.state.doc.sliceString(range.from, range.to);
        const insert = `${left}${text}${right}`;

        const transaction = view.state.update({
            changes: {
                ...range,
                insert,
            },
            selection: {
                anchor: text.length === 0 ? range.from + left.length : range.from + insert.length,
            },
        });
        view.dispatch(transaction);
        return true;
    }

    render() {
        const toolbar = html`
            <guh-toolbar @tabSelect='${this.onTabSelect}'></guh-toolbar>`;
        const preview = html`<guh-preview .markdown='${this.editorView?.state.doc.toString()}'></guh-preview>`;
        const edit = html`
            <div class='editor-wrapper'>
                ${this.editorElement}
            </div>
            <div class='upload-text'>
                Upload files by pasting or dragging and dropping them.
            </div>
        `
        const tab = this._tab === 'edit' ? edit : preview

        return html`
            ${toolbar}
            ${tab}
        `;
    }

    private drop(event: DragEvent) {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleMediaUpload(files);
        }
    }

    private paste(event: ClipboardEvent) {
        const files = event.clipboardData?.files;
        if (files && files.length > 0) {
            this.handleMediaUpload(files);
        }
    }

    private handleMediaUpload(fileList: FileList) {
        if (this.uploadMedia === undefined || this.editorView === undefined) {
            return;
        }
        const files = [...fileList].filter(it => it.type.startsWith('image/') || it.type.startsWith('video/'));
        if (files.length !== fileList.length) {
            alert('only image or video files can be uploaded');
        } else {
            console.log(this.uploadMedia);
            const uploaded = this.uploadMedia(files);
            const toInsert = uploaded.map(it => `![${it.alt}](${it.url})`).join('\n');

            const editorState = this.editorView.state;
            const transaction = editorState.update({
                changes: {
                    from: editorState.doc.length,
                    insert: `\n${toInsert}`,
                },
            });
            this.editorView.dispatch(transaction);
        }
    }

    private replaceValue(value: string) {
        if (!this.editorView) { return }
        const editorState = this.editorView.state;
        const transaction = editorState.update({
            changes: {
                from: 0,
                to: editorState.doc.length,
                insert: value,
            },
        });
        this.editorView.dispatch(transaction);

    }

    private onEditorUpdate(update: ViewUpdate) {
        if (update.docChanged) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            const value = update.state.doc.toString();
            const event = new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value,
                },
            });
            this.dispatchEvent(event);
        }
    }

    static styles = unsafeCSS(editorStyles)
}

declare global {
    interface HTMLElementTagNameMap {
        'guh-editor': Editor;
    }
}
