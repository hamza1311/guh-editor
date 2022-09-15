import { customElement } from 'lit/decorators.js';
import { unsafeCSS, html, LitElement } from 'lit';
import styleSheet from './footer.scss?inline';
import mdIcon from '../assets/icons/md.svg?raw';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

@customElement('guh-footer')
export class Footer extends LitElement {
    render() {
        return html`
            <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
               target="_blank">
                ${unsafeSVG(mdIcon)} Markdown is supported
            </a>

            <hr />

            <span class="upload-text">
                Upload files by pasting or dragging and dropping them.
            </span>
        `;
    }

    static styles = unsafeCSS(styleSheet);
}

declare global {
    interface HTMLElementTagNameMap {
        'guh-footer': Footer;
    }
}
