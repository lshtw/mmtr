import { getPhrases } from "./localization/get-phrases";

export class ContextMenu {

    constructor(items, locale = 'RU') {
        this.items = items;
        this.phrases = getPhrases()[locale];
        this.init();
    }

    init() {
        this.contextMenu = document.createElement('div');
        this.contextMenu.classList.add('dropdown-content');
    }

    hideMenu() {
        window.onclick = function (e) {
            if (!document.querySelector('.dropdown-content').contains(e.target)) {
                document.querySelector('.dropdown-content').remove();
            }
        };
    }

    showMenu() {
        this.contextMenu.appendChild(this.generateItems());
        this.contextMenu.classList.add('show');
        return this.contextMenu;
    }

    addHideEvent() {
        window.onclick = function (e) {
            if (e.target !== document.querySelector('.dropdown-content') && e.target !== document.querySelector('.dropdown-content').parentNode) {
                document.querySelector('.dropdown-content').remove();
            }
        };
    }

    generateItems() {
        let table = document.createElement('table'), tr, td1, td2;
        this.items.forEach((item, index) => {
            tr = document.createElement('tr');
            td1 = document.createElement('td');
            td2 = document.createElement('td');
            td1.innerHTML = item;
            td2.innerHTML = `<button class="button delete-button" data-id="${index}">${this.phrases.remove}</button>`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            table.appendChild(tr);
        });

        return table;
    }
}