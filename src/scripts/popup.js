import {getPhrases} from './localization/get-phrases';
import {ContextMenu} from './context-menu';
import {getActions} from './actions';
import {Notification} from './notification';

let isInit = false;

export class Popup {

    popupElem = document.createElement('div');
    phrases;

    constructor(locale = 'RU') {
        this.locale = locale;
        this.phrases = getPhrases()[this.locale];
        this.template = `<div class="popup-wrap">
                            <div class="popup">
	                            <h3 class="popup__header">${this.phrases.header}</h3>
	                                <span class="popup__close" title="Закрыть"></span>
                            </div>
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
        if (event.keyCode === 27) {
            document.querySelector('.popup__close').click();
        }
    }

    openModal() {
        if (!isInit) {
            isInit = true;
            document.body.appendChild(this.popupElem);
            let elModal = document.querySelector('.popup-wrap');

            elModal.addEventListener('click', this.clickPastModal);
            document.body.addEventListener('keydown', this.clickEscape);
            document.body.classList.toggle('overflow-hidden');

            document.querySelector('.popup__close').addEventListener('click',
                (event) => {
                    event.preventDefault();
                    elModal.classList.toggle('active');
                    document.body.removeChild(this.popupElem);
                    elModal.removeEventListener('click', this.clickPastModal);
                    document.body.removeEventListener('keydown', this.clickEscape);
                    document.body.classList.toggle('overflow-hidden');
                    isInit = false;

                    window.onclick = null;
                }
            );
            elModal.classList.toggle('active');
            elModal.querySelector('.popup').appendChild(this.generateEmailTable());
        } else {
            return;
        }

    }

    generateEmailTable() {
        let emailsObject = JSON.parse(localStorage.getItem('emails'));
        let emails = Object.keys(JSON.parse(localStorage.getItem('emails')));

        if (!emails.length) {
            let span = document.createElement('span');
            span.innerText = this.phrases.emptyEmails;

            return span;
        }

        let table = document.createElement('table');
        table.classList.add('popup-data');

        emails.forEach((item) => {
            let tr = document.createElement('tr'),
                td1 = document.createElement('td'),
                td2 = document.createElement('td'),
                td3 = document.createElement('td');

            td1.innerHTML = item;

            if (emailsObject[item].length > 1) {
                let anchor = document.createElement('a');

                anchor.innerHTML = this.phrases.listOfDates + ' &#9776;';
                td2.appendChild(anchor);

                anchor.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    let contextMenu = new ContextMenu(item, emailsObject[item], this.locale);

                    if (document.contains(document.querySelector('.dropdown-content'))) {
                        contextMenu.addHideEvent();
                    } else {
                        event.toElement.appendChild(contextMenu.showMenu());
                        contextMenu.addHideEvent();
                    }
                    if (emailsObject[item].length === 0) {
                        table.removeChild(event.srcElement.parentNode.parentNode);
                    }
                });
            } else {
                td2.innerHTML = emailsObject[item];
            }
            td3.innerHTML = `<button class="button" data-name="${item}">${this.phrases.remove}</button>`;
            td3.firstChild.addEventListener('click', (event) => {
                event.stopPropagation();
                let email = event.srcElement.getAttribute('data-name');

                delete emailsObject[email];
                localStorage.setItem('emails', JSON.stringify(emailsObject));
                table.removeChild(event.srcElement.parentNode.parentNode);
                new Notification(getActions().DELETE, this.locale).showNotification(email);

                if (Object.keys(emailsObject).length === 0) {
                    table.innerHTML = this.phrases.emptyEmails;
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