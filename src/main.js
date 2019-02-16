import { fetchApodData } from './helpers';
import form from './form';
import fileUploader from './fileUploader';
import calendar from './calendar';
import birthsList from './birthsList';

var monthNum = new Date().getMonth();
var date = new Date(2019,monthNum,0);
var list = document.querySelector('#birthdayList');
const previousMonth = document.querySelector('.previousMonth');
const nextMonth = document.querySelector('.nextMonth');
const daysList = document.querySelector('.daysInMonth');
const modal = document.querySelector('.modal');
const addButton = document.querySelector('.createForm');

document.addEventListener('DOMContentLoaded', () => {
    birthsList.renderBirthdaysList();
    calendar.init(monthNum, date);
    eventListeners();
});

const eventListeners = () => {

    previousMonth.addEventListener('click', function() {
        monthNum = monthNum > 0 ? monthNum - 1 :  11;
        calendar.setMonth(monthNum);
        date = new Date(2019,monthNum,0);
        console.log('prev: ',monthNum, date);
        calendar.fillCalendar(date, monthNum);
    });

    nextMonth.addEventListener('click', function() {
        monthNum = monthNum < 11 ?  monthNum + 1 : 0;
        calendar.setMonth(monthNum);
        date = new Date(2019,monthNum,0);
        console.log('next: ',monthNum, date);
        calendar.fillCalendar(date, monthNum);
    });

    list.addEventListener('click', birthsList.fillList);

    daysList.addEventListener('click', async ({ target }) => {
        const { parentNode, classList } = target;
        if(classList.contains('birthday') || parentNode.classList.contains('birthday')) {
            const d = classList.contains('birthday') ? target.dataset.birth : parentNode.dataset.birth;
            modal.querySelector('.modal-header').innerHTML = '';
            modal.querySelector('.modal-body').innerHTML = '';
            document.body.classList.add('open');
            modal.setAttribute('open', true);
            const data = await fetchApodData(d);
            modal.querySelector('.modal-header').innerHTML = `<h2>${data.title}</h2>`;
            modal.querySelector('.modal-body').innerHTML = `
                <img src="${data.hdurl}" alt="${data.title}">
                <p>${data.explanation}</p>
            `;
        } 
    });

    modal.querySelector('.close').addEventListener('click', ({ target: { classList, parentNode} }) => {
        if(classList.contains('close') || parentNode.classList.contains('close')) {
            modal.removeAttribute('open');
            document.body.classList.remove('open');
        }
    });

    addButton.addEventListener('click', () => {
        form.loadForm();
        document.querySelector('input[type="file"]').addEventListener('change', fileUploader.uploadPhoto);
        document.querySelector('.birth').addEventListener('submit',form.onSubmit);
    });
}
