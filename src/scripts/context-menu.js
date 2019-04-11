import {getPhrases} from './localization/get-phrases';
import Notification from './notification';
import {getActions} from './actions';
import {getEmailsObject} from "./main";

let isShow = false;

export default class ContextMenu {

    constructor(event, email, index, locale = 'RU') {
        this.event = event;
        this.target = event.target;
        this.email = email;
        this.index = index;
        this.locale = locale;
        this.emailsObject = getEmailsObject();
        this.dates = JSON.parse(localStorage.getItem('emails'))[this.email];
        this.phrases = getPhrases()[locale];
        console.log('new instance');
        this.init();
    }

    init() {
        this.contextMenu = document.createElement('div');
        this.contextMenu.classList.add('dropdown-content');
        this.contextMenu.style.top = `${event.clientY - event.srcElement.getBoundingClientRect().top}px`;
        this.contextMenu.style.left = `${event.clientX - event.srcElement.getBoundingClientRect().left}px`;

        let deleteItem = document.createElement('div');
        deleteItem.classList.add('dropdown-content__item');
        deleteItem.innerHTML = this.contextMenuTemplate;

        this.contextMenu.appendChild(deleteItem);

        deleteItem.firstChild.addEventListener('click', () => this.deleteItemEvent(event));
        deleteItem.firstChild.addEventListener('contextmenu',() => this.deleteItemEvent(event));
    }

    static isShow() {
        return isShow;
    }

    static set setShow(value) {
        isShow = value;
    }

    deleteItemEvent(event) {
        event.preventDefault();
        event.stopPropagation();

        console.log(this.index + '  ' + this.email);
        let date = this.emailsObject[this.email][this.index];

        this.emailsObject[this.email].splice(this.index, 1);
        localStorage.setItem('emails', JSON.stringify(this.emailsObject));

        if (this.emailsObject[this.email].length === 1) {
            console.log(this.emailsObject);
            event.srcElement.closest('.date-list').previousElementSibling.children[1].innerHTML = this.emailsObject[this.email][0];
            event.srcElement.closest('.date-list').remove();
        }

        this.target.nextElementSibling.remove();
        this.target.remove();
         ContextMenu.setShow = false;

        new Notification(getActions().DELETE_DATE, this.locale).showNotification(date);
    }

    addHideEvent() {
        let wrap = document.querySelector('.popup-wrap');

        wrap.addEventListener('click', this.hideContextMenuEvent);
    }

    hideContextMenuEvent(event) {
        event.stopPropagation();

        if (!document.querySelector('.dropdown-content')) {
            return;
        }

        if (!event.srcElement.closest('.dropdown-content')) {
            document.querySelector('.dropdown-content').remove();
            isShow = false;
            event.target.removeEventListener('click', this.hideContextMenuEvent);
        }
    }

    get contextMenuTemplate() {
        return `<span class="delete_item" data-email="${this.email}" data-id="${this.index}">${this.phrases.remove}</span>`;
    }

    // get getContextMenu() {
    //     return document.querySelector('.dropdown-content');
    // }

    get getContextMenu() {
        return this.contextMenu;
    }

    removeC() {
        this.event.srcElement.firstElementChild.remove();
        isShow = false;
    }

    static delete() {
        document.querySelector('.dropdown-content').remove();
    }
}