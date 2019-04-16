export default class VideoEvent {

    constructor() {
        this.videos = [...document.getElementsByClassName('video')];
    }

    addEvents() {
        if (this.videos) {
            this.videos.forEach((item) => {
                item.addEventListener('mouseover', this.mouseOverEvent.bind(this, item));
                item.addEventListener('mouseout', this.mouseOutEvent.bind(this, item));
            });
        }
    }

    mouseOverEvent(item) {
        let src = item.getAttribute('src');
        item.setAttribute('src', src + '&autoplay=1');
    }

    mouseOutEvent(item) {
        let src = item.getAttribute('src');
        item.setAttribute('src', src.replace( '&autoplay=1',''));
    }
}