import {getPhrases} from './localization/get-phrases';
import {Notification} from './notification';
import {getActions} from './actions';

export class ContextMenu {

    constructor(target, email, index, locale = 'RU') {
        this.target = target;
        this.email = email;
        this.index = index;
        this.locale = locale;
        this.emailsObject = JSON.parse(localStorage.getItem('emails'));
        this.dates = JSON.parse(localStorage.getItem('emails'))[this.email];
        this.phrases = getPhrases()[locale];

        this.init();
    }

    init() {
        this.contextMenu = document.createElement('div');
        this.contextMenu.classList.add('dropdown-content');

        let deleteItem = document.createElement('div');
        deleteItem.classList.add('dropdown-content__item');
        deleteItem.innerHTML = `<span class="delete_item" data-email="${this.email}" data-id="${this.index}">${this.phrases.remove}</span>`;

        this.contextMenu.appendChild(deleteItem);

        deleteItem.firstChild.addEventListener('click', (event) => {
            event.stopPropagation();

            let td = event.srcElement.closest('td');
            let date = this.emailsObject[this.email][this.index];

            this.emailsObject[this.email].splice(this.index, 1);
            localStorage.setItem('emails', JSON.stringify(this.emailsObject));

            this.target.remove();
            new Notification(getActions().DELETE_DATE, this.locale).showNotification(date);

            if (this.emailsObject[this.email].length === 1) {
                td.innerHTML = this.emailsObject[this.email];
            }
        });
    }

    showMenu() {
        this.contextMenu.classList.add('show');
        return this.contextMenu;
    }

    addHideEvent() {
        let wrap = document.querySelector('.popup-wrap');

        wrap.onclick = function (e) {
            e.stopPropagation();

            if (!document.querySelector('.dropdown-content')) {
                return;
            }

            if (!e.srcElement.closest('.dropdown-content')) {
                console.log('aa');
                document.querySelector('.dropdown-content').remove();
                wrap.onclick = null;
            }
        };
    }

    get getContextMenu() {
        return document.querySelector('.dropdown-content');
    }
}