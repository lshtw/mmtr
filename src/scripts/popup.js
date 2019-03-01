import {getPhrases} from "./localization/get-phrases";
import {ContextMenu} from "./context-menu";
import {getActions} from "./actions";
import {Notification} from "./notification";

export class Popup {

    popupElem = document.createElement('div');
    phrases;

    constructor(locale = 'RU') {
        this.locale = locale;
        this.phrases = getPhrases()[this.locale];
        this.template = `<div class="popup-wrap">
                            <div class="popup">
	                            <h3 class="popup__header">${this.phrases.header}</h3>
	                                <a class="popup__close" title="Закрыть" href="#close"></a>
                            </div>
                         </div>`;

        this.popupElem.innerHTML = this.template;
    }

    isInit = false;

    openModal() {
        document.body.appendChild(this.popupElem);
        let elModal = document.querySelector('.popup-wrap');
        if (this.isInit === false) {
            this.isInit = true;
            document.querySelector('.popup__close').addEventListener('click',
                (event) => {
                    event.preventDefault();
                    elModal.classList.toggle('active');
                    document.body.removeChild(this.popupElem);
                }
            );
        }
        elModal.classList.toggle('active');
        elModal.querySelector('.popup').appendChild(this.generateEmailTable());
    }

    generateEmailTable() {
        let emailsObject = JSON.parse(localStorage.getItem('emails'));
        let emails = Object.keys(JSON.parse(localStorage.getItem('emails')));

        if (!emails.length) {
            let span = document.createElement('span');
            span.innerText = this.phrases.emptyEmails;

            return span;
        }

        let table = document.createElement('table'), tr, td1, td2, td3;
        table.classList.add('popup-data');

        emails.forEach((item) => {
            tr = document.createElement('tr');
            td1 = document.createElement('td');
            td2 = document.createElement('td');
            td3 = document.createElement('td');
            td1.innerHTML = item;
            if (emailsObject[item].length > 1) {
                let anchor = document.createElement('a');
                anchor.innerText = 'click';
                td2.appendChild(anchor);
                anchor.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    let contextMenu = new ContextMenu(item, emailsObject[item], this.locale);
                    if (document.contains(document.querySelector('.dropdown-content'))) {
                        contextMenu.hideMenu();
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
            td3.innerHTML = `<button class="button delete-button" data-name="${item}">${this.phrases.remove}</button>`;
            td3.firstChild.addEventListener('click', (event) => {
                let email = event.srcElement.getAttribute('data-name');
                delete emailsObject[email];
                localStorage.setItem('emails', JSON.stringify(emailsObject));
                table.removeChild(event.srcElement.parentNode.parentNode);
                new Notification(getActions().DELETE, this.locale).showNotification(email);
            });

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            table.appendChild(tr);
        });

        return table;
    }
}