import * as moment from 'moment';
import {Notification} from './notification';
import {getActions} from './actions';
import {CONSTANTS} from './constants';

export class GetStartedForm {

    constructor() {
        this.init();
    }

    init() {
        this.getStartedForm = document.getElementsByClassName('get-started-form')[0];
        this.emailButton = document.getElementsByClassName('get-started-form__button')[0];
        this.emailInput = document.getElementsByClassName('get-started-form__input')[0];
        this.formatDate = CONSTANTS.DATE_FORMAT;

        if (!localStorage.getItem('emails')) {
            localStorage.setItem('emails', JSON.stringify({}));
        }

        this.getStartedForm.addEventListener('submit', () => {
            this.onSubmit(event)
        });

        this.getStartedForm.addEventListener('click', () => {
            this.emailInput.focus();
        })
    }

    onSubmit(event) {
        event.preventDefault();
        if (!this.emailInput.value) {
            return;
        }

        new Notification(getActions().ADD).showNotification(this.emailInput.value);
        this.emailInput.blur();

        if (this.emailInput.value in JSON.parse(localStorage.getItem('emails'))) {
            let obj = JSON.parse(localStorage.getItem('emails'));
            let arr = obj[this.emailInput.value];

            arr.unshift(moment(new Date()).format(this.formatDate));
            obj[this.emailInput.value] = arr;
            localStorage.setItem('emails', JSON.stringify(obj));
        } else {
            let obj = JSON.parse(localStorage.getItem('emails'));
            obj[this.emailInput.value] = [moment(new Date()).format(this.formatDate)];

            localStorage.setItem('emails', JSON.stringify(obj));
        }

        this.emailInput.value = '';
    }
}