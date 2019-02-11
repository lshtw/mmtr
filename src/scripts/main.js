import { VideoEvent } from './videos.js';
import { GetStartedForm } from "./get-started-form";

window.onload = function () {
    let video = new VideoEvent();
    let getStartedForm = new GetStartedForm();

    video.addEvents();
};