(function() {
let videos = [...document.getElementsByClassName('video')];

videos.forEach((item) => {
   item.addEventListener('mouseover', ()=> {
       let src = item.getAttribute('src');
       item.setAttribute('src', src + '&autoplay=1');
   });
    item.addEventListener('mouseout', ()=> {
        let src = item.getAttribute('src');
        item.setAttribute('src', src.replace( '&autoplay=1',''));
    });
});
}());