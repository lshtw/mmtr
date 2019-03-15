import {getPhrases} from './localization/get-phrases';
import {ContextMenu} from './context-menu';
import {getActions} from './actions';
import {Notification} from './notification';
import {CONSTANTS} from './constants';

let isInit = false;

export class Popup {

    constructor(locale = 'RU') {
        this.locale = locale;
        this.phrases = getPhrases()[this.locale];
        this.popupElem = document.createElement('div');
        this.popupElem.classList.add('popup-wrap');
        this.template = `<div class="popup">
	                            <h3 class="popup__header">${this.phrases.header}</h3>
	                                <span class="popup__close" title="Закрыть"></span>
                            </div>`;
        this.popupElem.innerHTML = this.template;
    }


    static isInit() {
        return isInit;
    }

    clickPastModal(event) {
        if (!event.srcElement.closest('.popup')) {
            document.querySelector('.popup__close').click();
        }
    }

    clickEscape(event) {
        if (event.keyCode === CONSTANTS.ESCAPE_CODE) {
            document.querySelector('.popup__close').click();
        }
    }

    closeModal() {
        this.popupWrapper.remove();

        // elModal.removeEventListener('click', this.clickPastModal);
        document.body.removeEventListener('keydown', this.clickEscape);

        document.body.classList.toggle('overflow-hidden');
        isInit = false;
        this.popupWrapper.onclick = null;
    }

    openModal() {
        if (!isInit) {
            isInit = true;
            document.body.appendChild(this.popupElem);
            document.querySelector('.popup__close').addEventListener('click', () => {this.closeModal()}, true);
            this.popupWrapper.addEventListener('click', this.clickPastModal);
            document.body.addEventListener('keydown', this.clickEscape);
            document.body.classList.toggle('overflow-hidden');
            this.popupWrapper.querySelector('.popup').appendChild(this.generateEmailTable());
        }
    }

    clickOnDateListElement(event) {
        event.stopPropagation();

        event.target.nextElementSibling.classList.toggle('active');
    }

    get popupWrapper() {
        return this.popupElem;
    }

    get emailsObject() {
        return JSON.parse(localStorage.getItem('emails'));
    }

    get emails() {
        return Object.keys(this.emailsObject);
    }

    generateEmailTable() {
        let emailsObject = this.emailsObject;
        let emails = this.emails;

        if (!emails.length) {
            let span = document.createElement('span');
            span.innerText = this.phrases.emptyEmails;

            return span;
        }

        let table = document.createElement('table');
        table.classList.add('popup-data');

        emails.forEach((email) => {
            let tr = document.createElement('tr'),
                td1 = document.createElement('td'),
                td2 = document.createElement('td'),
                td3 = document.createElement('td');

            tr.classList.add('table-row');
            td1.innerHTML = email;

            if (emailsObject[email].length > 1) {
                let anchor = document.createElement('span');
                let div = document.createElement('div');

                anchor.innerHTML = this.phrases.listOfDates + ' &#9776;';
                td2.appendChild(anchor);
                div.classList.add('date-list');

                emailsObject[email].forEach((item, index) => {
                    let dateElement = document.createElement('p');

                    dateElement.classList.add('date-list__item');
                    dateElement.innerText = item;
                    div.appendChild(dateElement);

                    dateElement.addEventListener('contextmenu', (event) => {
                        event.preventDefault();

                        let contextMenu = new ContextMenu(event.target, email, index, this.locale);

                        if (document.contains(contextMenu.getContextMenu)) {
                            if (!contextMenu.getContextMenu.contains(event.srcElement)) {
                                contextMenu.getContextMenu.remove();
                                this.popupWrapper.onclick = null;
                            }
                        } else {
                            event.toElement.appendChild(contextMenu.showMenu());
                            contextMenu.addHideEvent();
                        }
                    })
                });

                td2.appendChild(div);

                anchor.addEventListener('click', this.clickOnDateListElement);
            } else {
                td2.innerHTML = emailsObject[email];
            }
            td3.innerHTML = `<button class="button" data-name="${email}">${this.phrases.remove}</button>`;
            td3.firstChild.addEventListener('click', (event) => {
                event.stopPropagation();

                let email = event.srcElement.getAttribute('data-name');

                delete emailsObject[email];
                localStorage.setItem('emails', JSON.stringify(emailsObject));
                table.removeChild(event.srcElement.parentNode.parentNode);
                new Notification(getActions().DELETE, this.locale).showNotification(email);

                if (Object.keys(emailsObject).length === 0) {
                    table.innerHTML = this.phrases.emptyEmails;
                    this.popupWrapper.onclick = null;
                }
            });

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            table.appendChild(tr);
        });

        return table;
    }
}