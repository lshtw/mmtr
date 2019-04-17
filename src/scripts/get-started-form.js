import * as moment from 'moment';
import Notification from './notification';
import { getActions } from './actions';
import { CONSTANTS } from './constants';
import { getKey } from './main';

export default class GetStartedForm {

    constructor() {
    }

    init() {
        this.key = getKey();
        this.getStartedForm = document.getElementsByClassName('get-started-form')[0];
        this.emailButton = document.getElementsByClassName('get-started-form__button')[0];
        this.emailInput = document.getElementsByClassName('get-started-form__input')[0];
        this.formatDate = CONSTANTS.DATE_FORMAT;

        if (!localStorage.getItem(getKey())) {
            localStorage.setItem(this.key, JSON.stringify({}));
        }

        this.getStartedForm.addEventListener('submit', this.onSubmit.bind(this));

        this.getStartedForm.addEventListener('click', this.onClick.bind(this));
    }

    onClick() {
        this.emailInput.focus();
    }

    onSubmit(event) {
        event.preventDefault();

        if (!this.emailInput.value) {
            return;
        }

        new Notification(getActions().ADD).showNotification(this.emailInput.value);
        this.emailInput.blur();

        if (this.emailInput.value in JSON.parse(localStorage.getItem(this.key))) {
            let obj = JSON.parse(localStorage.getItem(this.key));
            let arr = obj[this.emailInput.value];

            arr.unshift(moment(new Date()).format(this.formatDate));
            obj[this.emailInput.value] = arr;
            localStorage.setItem(this.key, JSON.stringify(obj));
        } else {
            let obj = JSON.parse(localStorage.getItem(this.key));
            obj[this.emailInput.value] = [moment(new Date()).format(this.formatDate)];

            localStorage.setItem(this.key, JSON.stringify(obj));
        }

        this.emailInput.value = '';
    }
}