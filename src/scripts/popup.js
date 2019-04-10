import {getPhrases} from './localization/get-phrases';
import ContextMenu from './context-menu';
import {getActions} from './actions';
import Notification from './notification';
import {CONSTANTS} from './constants';

let isInit = false;

export default class Popup {

    constructor(locale = 'RU') {
        this.locale = locale;
        this.phrases = getPhrases()[this.locale];
        this.popupElem = document.createElement('div');
        this.popupElem.classList.add('popup-wrap');
        this.popupElem.innerHTML = this.popupTemplate;
    }


    get popupTemplate() {
        return `<div class="popup">
	                            <h3 class="popup__header">${this.phrases.header}</h3>
	                                <span class="popup__close" title="Закрыть"></span>
                            </div>`;
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

        event.target.closest('.row').nextElementSibling.classList.toggle('active');
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

        let section = document.createElement('section');
        section.classList.add('popup-data');

        emails.forEach((email) => {
            let row = document.createElement('div'),
                emailDiv = document.createElement('div'),
                dateDiv = document.createElement('div'),
                deleteDiv = document.createElement('div');

            row.classList.add('row');
            section.appendChild(row);
            emailDiv.innerHTML = email;

            if (emailsObject[email].length > 1) {
                let anchor = document.createElement('span');
                let div = document.createElement('div');

                anchor.innerHTML = this.phrases.listOfDates + ' &#9776;';
                anchor.classList.add('toggle-date-list');
                dateDiv.appendChild(anchor);
                div.classList.add('date-list');

                emailsObject[email].forEach((item, index) => {
                    let dateRow = document.createElement('div');
                    let dateElement = document.createElement('p');
                    let deleteIcon = document.createElement('span');

                    dateElement.classList.add('date-list__item');
                    deleteIcon.classList.add('date-list__item-delete');
                    dateElement.innerText = item;

                    dateRow.appendChild(dateElement);
                    dateRow.appendChild(deleteIcon);
                    div.appendChild(dateRow);

                    dateElement.addEventListener('contextmenu', (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        let contextMenu = new ContextMenu(event, email, index, this.locale);

                        if(contextMenu.cont.contains(event.srcElement)) {
                            return;
                        }

                        if (document.contains(contextMenu.getContextMenu)) {
                            if (!contextMenu.getContextMenu.contains(event.srcElement)) {
                                contextMenu.getContextMenu.remove();
                                this.popupWrapper.onclick = null;
                            } else {
                                return;
                            }
                        }
                        event.toElement.appendChild(contextMenu.cont);
                        contextMenu.addHideEvent();
                    })
                });

                row.parentElement.appendChild(div);

                anchor.addEventListener('click', this.clickOnDateListElement);
            } else {
                dateDiv.innerHTML = emailsObject[email];
            }
            deleteDiv.innerHTML = `<button class="button" data-name="${email}">${this.phrases.remove}</button>`;
            deleteDiv.firstChild.addEventListener('click', (event) => {
                event.stopPropagation();

                let email = event.srcElement.getAttribute('data-name');

                delete emailsObject[email];
                localStorage.setItem('emails', JSON.stringify(emailsObject));
                section.removeChild(event.srcElement.parentNode.parentNode);
                new Notification(getActions().DELETE, this.locale).showNotification(email);

                if (Object.keys(emailsObject).length === 0) {
                    section.innerHTML = this.phrases.emptyEmails;
                    this.popupWrapper.onclick = null;
                }
            });

            row.appendChild(emailDiv);
            row.appendChild(dateDiv);
            row.appendChild(deleteDiv);
        });

        return section;
    }
}