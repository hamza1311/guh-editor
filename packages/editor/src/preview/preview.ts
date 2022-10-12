import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { marked } from 'marked';
import previewStyles from './preview.scss?inline';
import { until } from 'lit/directives/until.js';
import type { HighlightJS } from './hljs';

export type MarkdownParser = (markdown: string) => Promise<Element[]>;

let hljs: HighlightJS;

const doHighlight = async (code: string, lang: string): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!hljs) {
        hljs = (await import('./hljs')).hljs;
    }
    const language = hljs.getLanguage(lang) === undefined ? 'plaintext' : lang;
    return hljs.highlight(code, { language }).value;
};

marked.setOptions({
    gfm: true,
    highlight: function (code, lang, callback) {
        doHighlight(code, lang)
            .then((hl) => callback?.(undefined, hl))
            .catch((err) => callback?.(err));
    },
    langPrefix: 'hljs language-',
});

const defaultParser = async (markdown: string) => {
    const rendered = await new Promise<string>((resolve, reject) => {
        marked(markdown, (err, highlighted) => {
            if (err) {
                reject(err);
            } else {
                resolve(highlighted);
            }
        });
    });
    const div = document.createElement('div');
    div.innerHTML = rendered;
    return [...div.children];
};

@customElement('guh-preview')
export class Preview extends LitElement {
    @property({ type: Function, attribute: false })
    parser?: MarkdownParser;

    @property()
    markdown = '';

    @property()
    hljsThemeHref = '';

    get mdParser(): MarkdownParser {
        return this.parser ?? defaultParser
    }

    render() {
        const parsed = this.mdParser(this.markdown);
        return html`
            <link rel="stylesheet" href=${this.hljsThemeHref} />
            <div class="preview-wrapper">${until(parsed, html`<span>Loading...</span>`)}</div>
        `;
    }

    static styles = unsafeCSS(previewStyles);
}

declare global {
    interface HTMLElementTagNameMap {
        'guh-preview': Preview;
    }
}
