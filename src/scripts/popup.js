export class Popup {
    template = `<div class="popup-wrap">
   <div class="popup">
	<h3 class="popup__header">Заголовок</h3>
	<div class="popup-data">
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
                    document.body.removeChild(this.popupElem);
                }
            );
        }
        elModal.classList.toggle('active');
        elModal.querySelector('.popup-data').appendChild(this.generateEmailTable());
    }

    generateEmailTable() {
        let emailsObject = JSON.parse(localStorage.getItem('emails'));
        let emails = Object.keys(JSON.parse(localStorage.getItem('emails')));
        console.log(emails);
        let table = document.createElement('table'), tr, td1,td2;
        emails.forEach((item) => {
            tr = document.createElement('tr');
            td1 = document.createElement('td');
            td2 = document.createElement('td');
            td1.innerHTML = item;
            td2.innerHTML = emailsObject[item];
            tr.appendChild(td1);
            tr.appendChild(td2);
            table.appendChild(tr);
        });

        return table;
    }
}