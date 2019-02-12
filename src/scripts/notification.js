export class Notification {

    template = `
 <p>email-адрес добавлен в систему</p>
`;

    popupElem = document.createElement('div');
    timer;

    constructor() {
        this.popupElem.classList.add('notification');
        this.popupElem.innerHTML = this.template;
    }

    showNotification(email) {
        this.hideNotification();
        this.popupElem.innerText = `email-адрес ${email} добавлен в систему`;
        document.body.appendChild(this.popupElem);
        let elModal = document.querySelector('.notification');
        elModal.style.left = `calc(50% - ${elModal.clientWidth / 2}px)`;

        this.timer = setTimeout(() => this.hideNotification(), 3000);
    }

    hideNotification() {
        let elModal = document.querySelector('.notification');
        if (document.body.contains(elModal)) {
            document.body.removeChild(elModal);
        }
        clearTimeout(this.timer);
    }
}