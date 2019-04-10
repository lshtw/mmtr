export default class VideoEvent {

    constructor() {
        this.videos = [...document.getElementsByClassName('video')];
    }

    addEvents() {
        if (this.videos) {
            this.videos.forEach((item) => {
                item.addEventListener('mouseover', ()=> {
                    let src = item.getAttribute('src');
                    item.setAttribute('src', src + '&autoplay=1');
                });
                item.addEventListener('mouseout', ()=> {
                    let src = item.getAttribute('src');
                    item.setAttribute('src', src.replace( '&autoplay=1',''));
                });
            });
        }
    }
}