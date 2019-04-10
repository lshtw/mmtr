import VideoEvent from './videos.js';
import GetStartedForm from './get-started-form';
import Popup from './popup';
import {CONSTANTS} from './constants';

window.onload = function () {
    const RUMAIL = CONSTANTS.RUMAIL;
    const EMAIL = CONSTANTS.EMAIL;
    let word = '';
    let video = new VideoEvent();
    let getStartedForm = new GetStartedForm();
    video.addEvents();

    document.body.addEventListener('keypress', (event) => {
        if ((RUMAIL.indexOf(event.key) === word.length || EMAIL.indexOf(event.key) === word.length) && event.target.nodeName !== 'INPUT') {
            word += event.key;
        } else {
            word = '';
        }
        if (word === RUMAIL || word === EMAIL) {
            let locale = word === EMAIL ? 'EN' : 'RU';

            if (!Popup.isInit()) {
                new Popup(locale).openModal();
            }
            word = '';
        }

    });

};