import {getPhrases} from './localization/get-phrases';
import ContextMenu from './context-menu';
import {getActions} from './actions';
import Notification from './notification';
import {CONSTANTS} from './constants';
import {getEmailsObject, getEmails, getKey} from './main';
import ApexCharts from 'apexcharts';

let isInit = false;

export default class Popup {

    constructor(locale = 'RU') {
        this.locale = locale;
        this.phrases = getPhrases()[this.locale];
        this.popupElem = document.createElement('div');
        this.popupElem.classList.add('popup-wrap');
        this.popupElem.innerHTML = this.popupTemplate;
        this.key = getKey();
    }


    get popupTemplate() {
        return `
       <div class="popup">
	       <span class="popup__close" title="Закрыть"></span>
	           <ul class="tabs">
                   <li class="tabs__item active">${this.phrases.header}</li>
                   <li  class="tabs__item">${this.phrases.diagrams}</li>
                   <li  class="tabs__item">${this.phrases.secretWordPlaceholder}</li>
               </ul>
               <ul class="tabs-content">
                   <li class="tabs-content__item emails-tab">
                       <h3 class="popup__header">${this.phrases.header}</h3>
                   </li>
                   <li class="tabs-content__item">
                       <div class="chart"></div>
                       <div>${this.selectMonthTemplate}</div>
                   </li>
                   <li class="tabs-content__item word-tab">
                       <form action="/" class="word-tab-form">
                           <input type="text" maxlength="10" name="secret-word" class="word-tab-form__input" placeholder="${this.phrases.secretWordPlaceholder}">
                           <button type="submit" class="button word-tab-form__button">${this.phrases.save}</button>
                       </form>
                   </li>
               </ul>
       </div>`;
    }


    get selectMonthTemplate() {
        return `
<form class="months">
	<ul class="select">
		<li>
			<input class="select_close" type="radio" name="awesomeness" id="awesomeness-close" value=""/>
			<span class="select_label select_label-placeholder">Awesomeness Level</span>
		</li>
		
		<li class="select_items">
			<input class="select_expand" type="radio" name="awesomeness" id="awesomeness-opener"/>
			<label class="select_closeLabel" for="awesomeness-close"></label>
			
			<ul class="select_options">
				<li class="select_option">
					<input class="select_input" type="radio" name="awesomeness" id="awesomeness-ridiculous"/>
					<label class="select_label" for="awesomeness-ridiculous">ridiculous</label>
				</li>

				<li class="select_option">
					<input class="select_input" type="radio" name="awesomeness" id="awesomeness-reasonable"/>
					<label class="select_label" for="awesomeness-reasonable">reasonable</label>
				</li>

				<li class="select_option">
					<input class="select_input" type="radio" name="awesomeness" id="awesomeness-lacking"/>
					<label class="select_label" for="awesomeness-lacking">lacking</label>
				</li>

				<li class="select_option">
					<input class="select_input" type="radio" name="awesomeness" id="awesomeness-awesomeless"/>
					<label class="select_label" for="awesomeness-awesomeless">awesomeless</label>
				</li>
			</ul>
			
			<label class="select_expandLabel" for="awesomeness-opener"></label>
		</li>
	</ul>
	
</form>
        `;
    }

    static isInit() {
        return isInit;
    }

    clickPastModal(event) {
        if (!event.srcElement.closest('.popup')) {
            document.querySelector('.popup__close').click();
        }
    }

    clickEscape(event) {
        if (event.keyCode === CONSTANTS.ESCAPE_CODE) {
            document.querySelector('.popup__close').click();
        }
    }

    closeModal() {
        document.body.removeChild(this.popupElem);

        document.body.removeEventListener('keydown', this.clickEscape);

        document.body.classList.toggle('overflow-hidden');
        isInit = false;
        this.popupWrapper.removeEventListener('click', this.clickPastModal);
    }

    openModal() {
        ContextMenu.setShow = false;
        if (!isInit) {
            isInit = true;
            document.body.appendChild(this.popupElem);

            let links = document.querySelectorAll('.tabs__item');
            let content = document.querySelectorAll('.tabs-content__item');
            let secretForm = document.querySelector('.word-tab-form');

            document.querySelector('.popup__close').addEventListener('click', this.closeModal.bind(this));
            this.popupWrapper.addEventListener('click', this.clickPastModal);
            document.body.addEventListener('keydown', this.clickEscape);
            document.body.classList.toggle('overflow-hidden');
            this.popupWrapper.querySelector('.emails-tab').appendChild(this.generateEmailList());
            this.generateDiagramms();

            for (let i = 0; i < links.length; i++) {
                let link = links[i];

                link.addEventListener('click', this.clickOnTab.bind(this, links, content, i));
            }

            secretForm.addEventListener('submit', this.submitSecretForm);

        }
    }

    submitSecretForm(event) {
        event.preventDefault();

        localStorage.setItem('wordEN', event.target['secret-word'].value);
    }

    clickOnTab(links, content, i, event) {
        links.forEach((link) => {
            if (link.classList.contains('active')) {
                link.classList.remove('active');
            }
        });

        event.srcElement.classList.add('active');

        for (let j = 0; j < content.length; j++) {
            let opacity = window.getComputedStyle(content[j]).opacity;
            if (opacity === '1') {
                content[j].style.opacity = '0';
            }
        }
        content[i].style.opacity = '1';
    }

    clickOnDateListElement(event) {
        event.stopPropagation();

        event.target.closest('.row').nextElementSibling.classList.toggle('active');
    }

    clickDeleteIcon(event) {
        event.stopPropagation();


        let emails = getEmailsObject();
        let email = event.srcElement.getAttribute('data-email');
        let index = event.srcElement.getAttribute('data-index');
        let date = emails[email][index];

        emails[email].splice(index, 1);
        localStorage.setItem(this.key, JSON.stringify(emails));

        if (emails[email].length === 1) {
            event.srcElement.closest('.date-list').previousElementSibling.children[1].innerHTML = emails[email][0];
            event.srcElement.parentElement.remove();
        }

        event.srcElement.previousElementSibling.remove();
        event.srcElement.remove();

        new Notification(getActions().DELETE_DATE, this.locale).showNotification(date);
    }

    contextMenuEvent(email, index, event) {
        event.preventDefault();
        event.stopPropagation();

        if (event.srcElement.classList.contains('dropdown-content')) {
            return;
        }

        let contextMenu = new ContextMenu(event, email, index, this.locale);
        let cont = contextMenu.getContextMenu;

        if (ContextMenu.isShow()) {
            ContextMenu.delete();
        }

        event.toElement.appendChild(cont);
        contextMenu.addHideEvent();
    }

    deleteDateRowEvent(section, emailsObject, event) {
        event.stopPropagation();

        let email = event.srcElement.getAttribute('data-name');

        delete emailsObject[email];
        localStorage.setItem(this.key, JSON.stringify(emailsObject));
        if (event.srcElement.closest('.row').nextElementSibling && event.srcElement.closest('.row').nextElementSibling.classList.contains('date-list')) {
            event.srcElement.closest('.row').nextElementSibling.remove();
        }
        section.removeChild(event.srcElement.parentNode.parentNode);

        new Notification(getActions().DELETE, this.locale).showNotification(email);

        if (Object.keys(emailsObject).length === 0) {
            section.innerHTML = this.phrases.emptyEmails;
        }
    }

    get popupWrapper() {
        return this.popupElem;
    }

    generateEmailList() {
        let emailsObject = getEmailsObject();
        let emails = getEmails();

        if (!emails.length) {
            let span = document.createElement('span');
            span.innerText = this.phrases.emptyEmails;

            return span;
        }

        let section = document.createElement('section');
        section.classList.add('popup-data');

        emails.forEach((email) => {
            let row = document.createElement('div'),
                emailDiv = document.createElement('div'),
                dateDiv = document.createElement('div'),
                deleteDiv = document.createElement('div');

            row.classList.add('row');
            section.appendChild(row);
            emailDiv.innerHTML = email;

            if (emailsObject[email].length > 1) {
                let anchor = document.createElement('span');
                let div = document.createElement('div');

                anchor.innerHTML = this.phrases.listOfDates + ' &#9776;';
                anchor.classList.add('toggle-date-list');
                dateDiv.appendChild(anchor);
                div.classList.add('date-list');

                emailsObject[email].forEach((item, index) => {
                    let dateElement = document.createElement('p');
                    let deleteIcon = document.createElement('span');

                    dateElement.classList.add('date-list__item');
                    deleteIcon.setAttribute('data-email', email);
                    deleteIcon.setAttribute('data-index', index);
                    deleteIcon.classList.add('date-list__item-delete');
                    dateElement.innerText = item;

                    div.appendChild(dateElement);
                    div.appendChild(deleteIcon);

                    deleteIcon.addEventListener('click', this.clickDeleteIcon);

                    dateElement.addEventListener('contextmenu', this.contextMenuEvent.bind(this, email, index));
                });

                row.parentElement.appendChild(div);

                anchor.addEventListener('click', this.clickOnDateListElement);
            } else {
                dateDiv.innerHTML = emailsObject[email];
            }
            deleteDiv.innerHTML = `<button class="button" data-name="${email}">${this.phrases.remove}</button>`;

            deleteDiv.firstChild.addEventListener('click', this.deleteDateRowEvent.bind(this, section, emailsObject));

            row.appendChild(emailDiv);
            row.appendChild(dateDiv);
            row.appendChild(deleteDiv);
        });

        return section;
    }

    generateDiagramms() {

        let emailsArray = getEmails();
        let emailsObject = getEmailsObject();

        let data = emailsArray.map((email) => {
            return emailsObject[email].length;
        });

        let options = {
            chart: {
                type: 'bar',
                height: 200
            },
            series: [{
                name: 'sales',
                data: data
            }],
            xaxis: {
                categories: emailsArray,
                labels: {
                    show: false
                }
            }
        };

        let chart1 = new ApexCharts(document.querySelector('.chart'), options);
        chart1.render();
    }


}