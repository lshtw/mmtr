import {getPhrases} from "./localization/get-phrases";
import {getActions} from "./actions";
import {Notification} from "./notification";

export class ContextMenu {

    constructor(email, dates, locale = 'RU') {
        this.email = email;
        this.locale = locale;
        this.emailsObject = JSON.parse(localStorage.getItem('emails'));
        this.dates = JSON.parse(localStorage.getItem('emails'))[this.email].reverse();
        this.phrases = getPhrases()[locale];
        this.init();
    }

    init() {
        this.contextMenu = document.createElement('div');
        this.contextMenu.classList.add('dropdown-content');
    }

    hideMenu() {
        window.onclick = function (e) {
            if (!document.querySelector('.dropdown-content').contains(e.target)) {
                document.querySelector('.dropdown-content').remove();
            }
        };
    }

    showMenu() {
        this.contextMenu.appendChild(this.generateItems());
        this.contextMenu.classList.add('show');
        return this.contextMenu;
    }

    addHideEvent() {
        window.onclick = function (e) {
            if (e.target !== document.querySelector('.dropdown-content') && e.target !== document.querySelector('.dropdown-content').parentNode) {
                document.querySelector('.dropdown-content').remove();
            }
        };
    }

    generateItems() {
        let table = document.createElement('table'), tr, td1, td2;

        this.dates.forEach((item) => {
            tr = document.createElement('tr');
            td1 = document.createElement('td');
            td2 = document.createElement('td');
            td1.innerHTML = item;
            td2.innerHTML = `<button class="button delete-button" data-name="${item}">${this.phrases.remove}</button>`;

            td2.firstChild.addEventListener('click', (event) => {
                event.stopPropagation();
                let date = event.srcElement.getAttribute('data-name');
                let index = this.emailsObject[this.email].indexOf(date);

                this.emailsObject[this.email].splice(index, index + 1);
                localStorage.setItem('emails', JSON.stringify(this.emailsObject));
                table.removeChild(event.srcElement.parentNode.parentNode);

                if (this.emailsObject[this.email].length === 1) {
                    this.contextMenu.closest('td').innerHTML = this.emailsObject[this.email];
                    window.onclick = null;
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