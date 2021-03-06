import { getPhrases } from './localization/get-phrases';
import { getActions } from './actions';

export default class Notification {

    static _timer;

    constructor(action = getActions().ADD, locale = 'RU') {
        this.locale = locale;
        this.phrases = getPhrases()[this.locale];
        this.action = action;
        this.init();
        clearTimeout(Notification._timer);
    }

    init() {
        this.popupElem = document.createElement('div');
        this.popupElem.classList.add('notification');

        let elModal = document.querySelector('.notification');

        if (document.body.contains(elModal)) {
            document.body.removeChild(elModal);
        }
    }

    showNotification(data) {
        this.popupElem.innerText = this.phrases[this.action](data);
        document.body.appendChild(this.popupElem);
        this.popupElem.style.left = `calc(50% - ${this.popupElem.clientWidth / 2}px)`;

        Notification._timer = setTimeout(() => {
            document.body.removeChild(this.popupElem);
        }, 3000);
    }
}