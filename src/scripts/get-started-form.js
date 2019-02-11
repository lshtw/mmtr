import { Popup } from "./popup";
import { Notification } from "./notification";

export class GetStartedForm {

    constructor() {
        this.getStartedForm = document.getElementsByClassName('get-started-form')[0];
        this.getStartedForm.addEventListener('submit', this.addEmail, false);
    }


    addEmail(event) {
        this.emailButton = document.getElementsByClassName('get-started-form__button')[0];
        this.emailInput = document.getElementsByClassName('get-started-form__input')[0];
        event.preventDefault();
        if (localStorage.getItem(this.emailInput.value)) {
            localStorage.setItem(this.emailInput.value, +localStorage.getItem(this.emailInput.value) + 1);
        } else {
            localStorage.setItem(this.emailInput.value, '1');
            new Notification().openModal();
        }
    }
}