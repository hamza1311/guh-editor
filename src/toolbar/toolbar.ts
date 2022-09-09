import { customElement, state } from 'lit/decorators.js';
import { unsafeCSS, html, LitElement } from 'lit';
import styleSheet from './toolbar.scss?inline';

export type Tab = 'edit' | 'preview'

@customElement('guh-toolbar')
export class Toolbar extends LitElement {

    @state()
    private _tab: Tab = 'edit';

    private editClicked() {
        this._tab = 'edit';
        this.tabActivated('edit');
    }

    private previewClicked() {
        this._tab = 'preview';
        this.tabActivated('preview');
    }

    private tabActivated(tab: Tab) {
        const event = new CustomEvent('tabSelect', {
            bubbles: true,
            composed: true,
            detail: {
                tab,
            },
        });
        this.dispatchEvent(event);
    }

    activated(tab: Tab) {
        if (this._tab === tab) {
            return `${tab}-activated activated`;
        } else {
            return '';
        }
    }

    render() {
        return html`
            <nav>
                <section class='tabs'>
                    <button class="tab ${this.activated('edit')}" @click=${this.editClicked}>Edit</button>
                    <button class="tab ${this.activated('preview')}" @click=${this.previewClicked}>Preview</button>
                    <span class='glider'></span>
                </section>

                <section class='formatting'>
                    <button class="tooltip" title="Click to bold (ctrl + b)">b</button>
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
