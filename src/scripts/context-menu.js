import {getPhrases} from './localization/get-phrases';
import {Notification} from './notification';
import {getActions} from './actions';

export class ContextMenu {

    constructor(email, dates, locale = 'RU') {
        this.email = email;
        this.locale = locale;
        this.emailsObject = JSON.parse(localStorage.getItem('emails'));
        this.dates = JSON.parse(localStorage.getItem('emails'))[this.email];
        this.phrases = getPhrases()[locale];
        this.init();
    }

    init() {
        this.contextMenu = document.createElement('div');
        this.contextMenu.classList.add('dropdown-content');
    }

    showMenu() {
        this.contextMenu.appendChild(this.generateItems());
        this.contextMenu.classList.add('show');
        return this.contextMenu;
    }

    addHideEvent() {
        let wrap = document.querySelector('.popup-wrap');

        wrap.onclick = function (e) {
            e.stopPropagation();

            if (!e.srcElement.closest('.dropdown-content.show') || e.srcElement !== document.querySelector('.dropdown-content.show')) {
                document.querySelector('.dropdown-content').remove();
                wrap.onclick = null;
            }
        };
    }

    generateItems() {
        let table = document.createElement('table');

        this.dates.forEach((item) => {
            let tr = document.createElement('tr'),
                td1 = document.createElement('td'),
                td2 = document.createElement('td');

            td1.innerHTML = item;
            td2.innerHTML = `<button class="button delete-button" data-name="${item}">${this.phrases.remove}</button>`;

            td2.firstChild.addEventListener('click', (event) => {
                event.stopPropagation();
                let date = event.srcElement.getAttribute('data-name');
                let index = this.emailsObject[this.email].indexOf(date);

                this.emailsObject[this.email].splice(index, 1);
                localStorage.setItem('emails', JSON.stringify(this.emailsObject));
                table.removeChild(event.srcElement.parentNode.parentNode);
                new Notification(getActions().DELETE_DATE, this.locale).showNotification(date);

                if (this.emailsObject[this.email].length === 1) {
                    this.contextMenu.closest('td').innerHTML = this.emailsObject[this.email];
                }
                if (this.emailsObject[this.email].length === 0) {
                    this.contextMenu.closest('tr').remove();
                }
            });

            tr.appendChild(td1);
            tr.appendChild(td2);
            table.appendChild(tr);
        });

        return table;
    }
}