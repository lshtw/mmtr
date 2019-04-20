import VideoEvent from './videos.js';
import GetStartedForm from './get-started-form';
import Popup from './popup';
import { CONSTANTS } from './constants';

window.onload = function () {
    let RUMAIL = localStorage.getItem('wordRU') ? localStorage.getItem('wordRU') : localStorage.setItem('wordRU', CONSTANTS.RUMAIL);
    let EMAIL = localStorage.getItem('wordEN') ? localStorage.getItem('wordEN') : localStorage.setItem('wordEN', CONSTANTS.EMAIL);
    let word = '';
    let video = new VideoEvent();
    let getStartedForm = new GetStartedForm();
    getStartedForm.init();
    video.addEvents();

    document.body.addEventListener('keypress', checkWord.bind(this));

    function checkWord(event) {
        RUMAIL = localStorage.getItem('wordRU');
        EMAIL = localStorage.getItem('wordEN');

        if (event.target.nodeName !== 'INPUT') {
            word += event.key;

            if (RUMAIL.indexOf(word) === -1 && EMAIL.indexOf(word) === -1) {
                word = '';
            }
        }

        if (word === RUMAIL || word === EMAIL) {
            let locale = word === EMAIL ? 'EN' : 'RU';

            if (!Popup.isInit()) {
                new Popup(locale).openModal();
            }

            word = '';
        }
    }

};

export function getKey() {
    let version = (require('./../../package.json').version);

    return `emails-v${version}`;
}

export function getEmailsObject() {
    return JSON.parse(localStorage.getItem(getKey()));
}

export function getEmails() {
    return Object.keys(getEmailsObject());
}