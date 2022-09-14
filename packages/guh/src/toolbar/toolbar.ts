import { customElement, state } from 'lit/decorators.js';
import { unsafeCSS, html, LitElement } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '@material/mwc-icon-button';
import '@material/mwc-button';
import styleSheet from './toolbar.scss?inline';
import boldIcon from '../../src/assets/icons/bold.svg?raw';
import codeIcon from '../../src/assets/icons/code.svg?raw';
import italicsIcon from '../../src/assets/icons/italics.svg?raw';
import linkIcon from '../../src/assets/icons/link.svg?raw';

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
    @state()
    private _tab: Tab = 'edit';

    private swapTab() {
        this._tab = getOppositeTab(this._tab);
        this.tabActivated(this._tab);
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
        if (this._tab === tab) {
            return `${tab}-activated activated`;
        } else {
            return '';
        }
    }

    render() {
        /*
        <button class="tab ${this.activated('edit')}" @click=${this.editClicked}>Edit</button>
                    <button class="tab ${this.activated('preview')}" @click=${this.previewClicked}>Preview</button>
                    <span class='glider'></span>
        */
        const tab = getOppositeTab(this._tab);
        const formatButtonClick = (label: string) => () =>
            this.dispatchCustomEvent('formatButtonClick', { button: label });
        return html`
            <nav>
                <section class="tabs">
                    <mwc-button
                        label=${tab.toUpperCase()}
                        icon=${tab}
                        @click=${this.swapTab}
                    ></mwc-button>
                </section>

                <section class="formatting">
                    <!--                    <button class="tooltip" title="Click to bold (ctrl + b)"></button>-->
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
            </nav>
        `;
    }

    static styles = unsafeCSS(styleSheet);
}

declare global {
    interface HTMLElementTagNameMap {
        'guh-toolbar': Toolbar;
    }
}
