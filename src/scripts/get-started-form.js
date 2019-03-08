import * as moment from 'moment';
import { Notification } from "./notification";
import { getActions } from "./actions";

export class GetStartedForm {

    constructor() {
        this.init();
    }

    init() {
        this.getStartedForm = document.getElementsByClassName('get-started-form')[0];
        this.emailButton = document.getElementsByClassName('get-started-form__button')[0];
        this.emailInput = document.getElementsByClassName('get-started-form__input')[0];
        let formatDate = 'DD.MM.YYYY HH:mm:ss';

        if (!localStorage.getItem('emails')) {
            localStorage.setItem('emails', JSON.stringify({}));
        }

        this.getStartedForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!this.emailInput.value) {
                return;
            }
            new Notification(getActions().ADD).showNotification(this.emailInput.value);
            this.emailInput.blur();

            if (this.emailInput.value in JSON.parse(localStorage.getItem('emails'))) {
                let obj = JSON.parse(localStorage.getItem('emails'));
                let arr = obj[this.emailInput.value];

                arr.unshift(moment(new Date()).format(formatDate));
                obj[this.emailInput.value] = arr;
                localStorage.setItem('emails', JSON.stringify(obj));
            } else {
                let obj = JSON.parse(localStorage.getItem('emails'));
                obj[this.emailInput.value] = [moment(new Date()).format(formatDate)];

                localStorage.setItem('emails', JSON.stringify(obj));
            }

            this.emailInput.value = '';
        });

        this.getStartedForm.addEventListener('click', () => {
            this.emailInput.focus();
        })
    }
}