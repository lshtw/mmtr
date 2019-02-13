import { VideoEvent } from './videos.js';
import { GetStartedForm } from "./get-started-form";
import { Popup } from "./popup";

window.onload = function () {
    const RUMAIL = 'почта';
    const EMAIL = 'email';
    let word = '';
    let video = new VideoEvent();
    let getStartedForm = new GetStartedForm();
    video.addEvents();

    document.body.addEventListener('keypress', (event) => {
        if (RUMAIL.indexOf(event.key) === word.length || EMAIL.indexOf(event.key) === word.length) {
            word += event.key;
        } else {
            word = '';
        }
        if (word === RUMAIL) {
            new Popup().openModal();
            word = '';
        }
        if (word === EMAIL) {
            new Popup().openModal();
            word = '';
        }
    });

};