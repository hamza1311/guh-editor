import { customElement, property } from 'lit/decorators.js';
import { unsafeCSS, html, LitElement } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import styleSheet from './toolbar.scss?inline';
import boldIcon from '../../src/assets/icons/bold.svg?raw';
import codeIcon from '../../src/assets/icons/code.svg?raw';
import italicsIcon from '../../src/assets/icons/italics.svg?raw';
import linkIcon from '../../src/assets/icons/link.svg?raw';
import previewIcon from '../../src/assets/icons/preview.svg?raw';
import editIcon from '../../src/assets/icons/edit.svg?raw';

export type Tab = 'edit' | 'preview';

const getOppositeTab = (tab: Tab): Tab => {
    if (tab === 'preview') {
        return 'edit';
    } else {
        return 'preview';
    }
};

@customElement('guh-toolbar')
export class Toolbar extends LitElement {
    @property()
    private tab: Tab = 'edit';

    private swapTab() {
        this.tab = getOppositeTab(this.tab);
        this.tabActivated(this.tab);
    }

    dispatchCustomEvent<T>(type: string, detail: T): boolean {
        const event = new CustomEvent(type, {
            bubbles: true,
            composed: true,
            detail,
        });
        return this.dispatchEvent(event);
    }

    private tabActivated(tab: Tab) {
        this.dispatchCustomEvent('tabSelect', { tab });
    }

    activated(tab: Tab) {
        if (this.tab === tab) {
            return `${tab}-activated activated`;
        } else {
            return '';
        }
    }

    render() {
        const oppositeTab = getOppositeTab(this.tab);
        const formatButtonClick = (label: string) => () =>
            this.dispatchCustomEvent('formatButtonClick', { button: label });

        const formattingSection =
            this.tab === 'edit'
                ? html`
                      <section class="formatting">
                          <!--<button class="tooltip" title="Click to bold (ctrl + b)"></button>-->
                          <button class='rounded' @click=${formatButtonClick('bold')}>${unsafeSVG(boldIcon)}</button>
                          <button class='rounded' @click=${formatButtonClick('italics')}>${unsafeSVG(italicsIcon)}</button>
                          <button class='rounded' @click=${formatButtonClick('code')}>${unsafeSVG(codeIcon)}</button>
                          <button class='rounded' @click=${formatButtonClick('link')}>${unsafeSVG(linkIcon)}</button>
                      </section>
                  `
                : html``;

        return html`
            <section class="tabs">
                <button @click=${this.swapTab} class='centered'>
                    ${oppositeTab === 'preview' ? unsafeSVG(previewIcon) : unsafeSVG(editIcon)}
                    ${oppositeTab}
                </button>
            </section>

            ${formattingSection}
        `;
    }

    static styles = unsafeCSS(styleSheet);
}

declare global {
    interface HTMLElementTagNameMap {
        'guh-toolbar': Toolbar;
    }
}
