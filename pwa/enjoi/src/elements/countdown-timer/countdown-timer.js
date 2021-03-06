import { encapsulate, fire } from '../../utils/utils';

const TICK_MS = 1000;

export class CountdownTimer extends HTMLElement {
    constructor() {
        super();
        encapsulate(this);
    }

    static get observedAttributes() {
        return ['status', 'start', 'seconds'];
    }

    connectedCallback() {
        if (this.seconds < 0) this.remove();

        this.render();
        this._timeEl = this.shadowRoot.querySelector('time');
        this._remaining = this.seconds;
        this.update();

        const counter = setInterval(() => {
            this._remaining--;
            this.update();

            if (this._remaining < 0) {
                this._onCountdownEnd(counter);
            }
        }, TICK_MS);
    }

    _onCountdownEnd(counter) {
        clearInterval(counter);
        fire('countdown-ended', {}, this);
    }

    get status() {
        return this.getAttribute('status');
    }

    get start() {
        return this.getAttribute('start');
    }

    get seconds() {
        return parseInt(this.getAttribute('seconds'), 10);
    }

    set seconds(val) {
        this.setAttribute('seconds', val);
    }

    update() {
        const minutesToEnd = parseInt(this._remaining / 60);
        this._timeEl.textContent =
            this.status === 'live' ? `⌛ ${minutesToEnd}` : `➡️ ${this.start}`;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <time></time>
        `;
    }
}