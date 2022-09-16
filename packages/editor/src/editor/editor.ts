import { html, PropertyDeclaration, LitElement, unsafeCSS } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import {
    keymap,
    highlightSpecialChars,
    drawSelection,
    dropCursor,
    EditorView,
    ViewUpdate,
} from '@codemirror/view';
import { EditorState, Extension, Compartment } from '@codemirror/state';
import {
    defaultHighlightStyle,
    syntaxHighlighting,
    indentOnInput,
    bracketMatching,
} from '@codemirror/language';
import { deleteLine, history, historyKeymap, standardKeymap } from '@codemirror/commands';
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
import '../toolbar';
import '../footer';
import '../preview';
import type { Tab } from '../toolbar';
import editorStyles from './editor.scss?inline';

export interface UploadedImage {
    url: string;
    alt: string;
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

export interface EditorProps {
    value?: string;
    autoFocus?: boolean;
    readonly?: boolean;
    uploadMedia?: (files: File[]) => Promise<UploadedImage[]>;
    extensions?: Extension[];
    theme?: Extension;
}

export type ChangeEvent = CustomEvent<{ value: string }>;

const readonly = new Compartment();

@customElement('guh-editor')
export class Editor extends LitElement implements EditorProps {
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
    get autoFocus() {
        return this._autoFocus;
    }

    set autoFocus(val: boolean) {
        const oldVal = this._autoFocus;
        this._autoFocus = val;
        this.requestUpdate('autoFocus', oldVal);
    }

    _autoFocus = false;

    @property({ type: Boolean })
    readonly = false;

    @property({ attribute: false, type: Function })
    uploadMedia?: (files: File[]) => Promise<UploadedImage[]>;

    @property({ attribute: false })
    extensions: Extension[] = DEFAULT_EXTENSIONS;

    @property({ attribute: false })
    theme?: Extension;

    private resizeObserver: ResizeObserver = new ResizeObserver((e) => {
        if (!this.editorView) {
            return;
        }
        this.editorView.scrollDOM.style.height = `${e[0].target.scrollHeight}px`;
    });

    readonly format = {
        bold(view: EditorView) {
            return this.run(view, '**');
        },
        italics(view: EditorView) {
            return this.run(view, '_');
        },
        code(view: EditorView) {
            return this.run(view, '`');
        },
        link(view: EditorView) {
            return this.run(view, '[', '](url)');
        },
        run(view: EditorView, left: string, right: string = left): boolean {
            const range = view.state.selection.ranges[0];
            const text = view.state.doc.sliceString(range.from, range.to);
            const insert = `${left}${text}${right}`;

            const transaction = view.state.update({
                changes: {
                    ...range,
                    insert,
                },
                selection: {
                    anchor:
                        text.length === 0 ? range.from + left.length : range.from + insert.length,
                },
            });
            view.dispatch(transaction);
            return true;
        },
    };

    /* Preview or edit tab */
    @state()
    private _tab: Tab = 'edit';

    connectedCallback() {
        super.connectedCallback();
        // need to bind `this` to functions
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        this.editorElement = document.createElement('div');
        this.editorElement.id = 'cm-container';

        const extensions = [
            ...this.extensions,
            EditorView.updateListener.of((update) => this.onEditorUpdate(update)),
            readonly.of(EditorState.readOnly.of(this.readonly)),
            EditorView.domEventHandlers({
                drop: this.drop.bind(self),
                paste: this.paste.bind(self),
            }),
            EditorView.lineWrapping,
            keymap.of([
                {
                    key: 'Shift-Delete',
                    run: deleteLine,
                },
                {
                    key: 'Ctrl-b',
                    run: (view) => this.format.bold(view),
                },
                {
                    key: 'Ctrl-i',
                    run: (view) => this.format.italics(view),
                },
                {
                    key: 'Ctrl-e',
                    run: (view) => this.format.code(view),
                },
                {
                    key: 'Ctrl-k',
                    run: (view) => this.format.link(view),
                },
            ]),
        ];
        if (this.theme) {
            extensions.push(this.theme);
        }

        this.editorView = new EditorView({
            doc: this.value,
            extensions,
            parent: this.editorElement,
            root: this.shadowRoot ?? undefined,
        });
        this.setReadOnly();
        this.setAutoFocus();

        this.resizeObserver.observe(this.editorView.dom);
        requestAnimationFrame(() =>
            this.editorView?.scrollDOM.addEventListener('click', () => {
                this.editorView?.focus();
            }),
        );
    }

    requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration) {
        super.requestUpdate(name, oldValue, options);
        if (name === 'value') {
            this.replaceValue(this.value);
        } else if (name === 'readonly') {
            this.setReadOnly();
        } else if (name === 'autoFocus') {
            this.setAutoFocus();
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (!this.editorView) {
            return;
        }
        this.resizeObserver.unobserve(this.editorView.dom);
        this.editorView.destroy();
    }

    private setAutoFocus() {
        if (this.autoFocus) {
            requestAnimationFrame(() => {
                if (!this.readonly) {
                    this.editorView?.focus();
                }
            });
        }
    }
    private setReadOnly(value: boolean = this.readonly) {
        this.editorView?.dispatch({
            effects: readonly.reconfigure(EditorState.readOnly.of(value)),
        });
        requestAnimationFrame(() => {
            if (this.editorView?.contentDOM) {
                this.editorView.contentDOM.contentEditable = value ? 'false' : 'true';
                if (!value) {
                    this.editorView.focus();
                } else {
                    this.editorView.contentDOM.blur();
                }
            }
        });
    }

    private onTabSelect(e: CustomEvent<{ tab: Tab }>) {
        this._tab = e.detail.tab;
        if (this._tab === 'edit') {
            requestAnimationFrame(() => this.editorView?.focus());
        }
    }

    private onToolbarFormatButtonClick(e: CustomEvent<{ button: string }>) {
        const view = this.editorView;
        if (view === undefined) {
            return;
        }
        switch (e.detail.button) {
            case 'bold': {
                this.format.bold(view);
                break;
            }
            case 'italics': {
                this.format.italics(view);
                break;
            }
            case 'code': {
                this.format.code(view);
                break;
            }
            case 'link': {
                this.format.link(view);
                break;
            }
        }
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
        const files = [...fileList].filter(
            (it) => it.type.startsWith('image/') || it.type.startsWith('video/'),
        );
        if (files.length !== fileList.length) {
            alert('only image or video files can be uploaded');
        } else {
            const from = this.editorView.state.selection.main.head;
            console.log(from);
            const uploadingText = '![](Uploading...)';
            const transaction = this.editorView.state.update({
                changes: {
                    from,
                    insert: uploadingText,
                },
            });
            this.editorView.dispatch(transaction);

            const afterUploadCb = (toInsert: string) => {
                const inserted = `\n${toInsert}`;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const tx = this.editorView!.state.update({
                    changes: {
                        from,
                        to: from + uploadingText.length,
                        insert: inserted,
                    },
                    selection: {
                        anchor: from + inserted.length,
                    },
                });
                this.editorView?.dispatch(tx);
            };
            this.setReadOnly(true);

            this.uploadMedia(files)
                .then((uploaded) => {
                    const toInsert = uploaded.map((it) => `![${it.alt}](${it.url})`).join('\n');
                    afterUploadCb(toInsert);
                    this.setReadOnly(false);
                })
                .catch((e: unknown) => {
                    afterUploadCb(`Upload failed: ${e as string}`);
                    this.setReadOnly(false);
                });
        }
    }

    private replaceValue(value: string) {
        if (!this.editorView) {
            return;
        }
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
            const event: ChangeEvent = new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value,
                },
            });
            this.dispatchEvent(event);
        }
    }

    render() {
        const preview = html`
            <guh-preview .markdown="${this.editorView?.state.doc.toString() ?? ''}"></guh-preview>
        `;
        const edit = html`
            <div class="editor-wrapper">${this.editorElement}</div>
            <guh-footer .canUpload=${this.uploadMedia !== undefined}></guh-footer>
        `;
        const tab = this._tab === 'edit' ? edit : preview;

        return html`
            <guh-toolbar
                role="navigation"
                @tabSelect="${this.onTabSelect}"
                @formatButtonClick=${this.onToolbarFormatButtonClick}
            ></guh-toolbar>
            ${tab}
        `;
    }

    static styles = unsafeCSS(editorStyles);
}

declare global {
    interface HTMLElementTagNameMap {
        'guh-editor': Editor;
    }
}

/* Codemirror types that are used in the public API */
export type { EditorView, Extension };
