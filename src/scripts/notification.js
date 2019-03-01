import { getPhrases } from "./localization/get-phrases";
import { getActions } from "./actions";

export class Notification {



    constructor(action = getActions().ADD,locale = 'RU') {
        this.phrases = getPhrases()[locale];
        this.action = action;
        this.init();
    }

    init() {
        this.popupElem = document.createElement('div');
        this.popupElem.classList.add('notification');
    }

    showNotification(email) {
        this.hideNotification();
        this.popupElem.innerText = this.phrases[this.action](email);
        document.body.appendChild(this.popupElem);
        let elModal = document.querySelector('.notification');
        elModal.style.left = `calc(50% - ${elModal.clientWidth / 2}px)`;

        this.timer = setTimeout(() => this.hideNotification(), 3000);
    }

    hideNotification() {
        let elModal = document.querySelector('.notification');
        if (document.body.contains(elModal)) {
            document.body.removeChild(elModal);
        }
        clearTimeout(this.timer);
    }
}