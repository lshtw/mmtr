import * as moment from 'moment';
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
        new Notification().showNotification(this.emailInput.value);
        if (localStorage.getItem(this.emailInput.value)) {
            let arr = JSON.parse(localStorage.getItem(this.emailInput.value));
            arr.push(moment().toDate());
            localStorage.setItem(this.emailInput.value, JSON.stringify(arr));
        } else {
            localStorage.setItem(this.emailInput.value, JSON.stringify([moment().toDate()]));
        }
    }
}