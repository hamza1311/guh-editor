import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { marked } from 'marked';
import hljs from 'highlight.js';
import previewStyles from './preview.scss'

export type MarkdownParser = (markdown: string) => Element[];

const defaultParser: MarkdownParser = (markdown) => {
    const div = document.createElement('div');
    div.innerHTML = marked(markdown, {
        gfm: true,
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-',
    });
    return [...div.children];
};

@customElement('guh-preview')
export class Preview extends LitElement {
    @property({ type: Function })
    parser: MarkdownParser = defaultParser;

    @property({ noAccessor: true })
    markdown = '';

    render() {
        console.log('markdown', this.markdown)
        const parsed = this.parser(this.markdown);
        return html`
            <div class='preview-wrapper'>
                ${parsed}
            </div>
        `;
    }

    static styles = unsafeCSS(previewStyles)
}

declare global {
    interface HTMLElementTagNameMap {
        'guh-preview': Preview;
    }
}
