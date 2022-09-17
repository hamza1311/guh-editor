import {html, LitElement, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {marked} from 'marked';
import previewStyles from './preview.scss';
import type hljsTy from 'highlight.js/lib/core'
import {until} from 'lit/directives/until.js';

let hljs: typeof hljsTy;
export type MarkdownParser = (markdown: string) => Promise<Element[]>;

const doHighlight = async (code: string, lang: string): Promise<string> => {
    if (!hljs) {
        const hljsImport = await import('highlight.js')
        hljs = hljsImport.default
    }

    const language = hljs.getLanguage(lang) === undefined ? 'plaintext' : lang;
    return hljs.highlight(code, {language}).value
}

marked.setOptions({
    gfm: true,
    highlight: function (code, lang, callback) {
        doHighlight(code, lang)
            .then(hl => callback?.(undefined, hl))
            .catch(err => callback?.(err));
    },
    langPrefix: 'hljs language-',
})

const defaultParser = async (markdown: string) => {
    const rendered = await new Promise<string>((resolve, reject) => {
        marked(markdown, (err, html) => {
            if (err) {
                reject(err.toString())
            } else {
                resolve(html)
            }
        });
    })
    const div = document.createElement('div');
    div.innerHTML = rendered
    return [...div.children]
};

@customElement('guh-preview')
export class Preview extends LitElement {
    @property({ type: Function })
    parser: MarkdownParser = defaultParser;

    @property({ noAccessor: true })
    markdown = '';

    render() {
        const parsed = this.parser(this.markdown);
        return html` <div class="preview-wrapper">${until(parsed, html`<span>Loading...</span>`)}</div> `;
    }

    static styles = unsafeCSS(previewStyles);
}

declare global {
    interface HTMLElementTagNameMap {
        'guh-preview': Preview;
    }
}
