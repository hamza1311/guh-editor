import { customElement, property } from 'lit/decorators.js';
import { unsafeCSS, html, LitElement } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
// todo no material?
import '@material/mwc-icon-button';
import '@material/mwc-button';
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

        const formattingSection = this.tab === 'edit' ? html`
            <section class="formatting">
                <!--<button class="tooltip" title="Click to bold (ctrl + b)"></button>-->
                <mwc-icon-button @click=${formatButtonClick('bold')}
                    >${unsafeSVG(boldIcon)}</mwc-icon-button
                >
                <mwc-icon-button @click=${formatButtonClick('italics')}
                    >${unsafeSVG(italicsIcon)}</mwc-icon-button
                >
                <mwc-icon-button @click=${formatButtonClick('code')}
                    >${unsafeSVG(codeIcon)}</mwc-icon-button
                >
                <mwc-icon-button @click=${formatButtonClick('link')}
                    >${unsafeSVG(linkIcon)}</mwc-icon-button
                >
            </section>
        ` : html``

        return html`
            <section class="tabs">
                <mwc-button label=${oppositeTab.toUpperCase()} trailingIcon @click=${this.swapTab}>
                    <span slot="icon">
                        ${oppositeTab === 'preview' ? unsafeSVG(previewIcon) : unsafeSVG(editIcon)}
                    </span>
                </mwc-button>
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
