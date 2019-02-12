export class Popup {
    template = `<div class="popup-wrap">
   <div class="popup">
	<h3 class="popup__header">Заголовок</h3>
	<div class="popup-data">
	данные окна
	</div>
	<a class="popup__close" title="Закрыть" href="#close"></a>
   </div>
</div>`;

    popupElem = document.createElement('div');

    constructor() {
        this.popupElem.innerHTML = this.template;
    }
    isInit = false;

    openModal() {
        document.body.appendChild(this.popupElem);
        let elModal = document.querySelector('.popup-wrap');
        if (this.isInit === false) {
            this.isInit = true;
            document.querySelector('.popup__close').addEventListener('click',
                (event) => {
                    event.preventDefault();
                    elModal.classList.toggle('active');
                }
            );
        }
        elModal.classList.toggle('active');
    }

    generateEmailList() {
        let emails = Object.keys(localStorage);
    }
}