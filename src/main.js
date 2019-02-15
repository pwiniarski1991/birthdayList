import { getBirthdaysFromStorage, setBirthdaysInStorage, fetchApodData } from './helpers';
import calendar from './calendar';

var monthNum = new Date().getMonth();
var date = new Date(2019,monthNum + 1,0);
const previousMonth = document.querySelector('.previousMonth');
const nextMonth = document.querySelector('.nextMonth');
const list = document.querySelector('#birthdayList');
const daysList = document.querySelector('.daysInMonth');
const modal = document.querySelector('.modal');
const birth = document.querySelector('.birth');
const addButton = document.querySelector('.createForm');

document.addEventListener('DOMContentLoaded', () => {
    birth.classList.remove('birth--open');
    renderBirthdaysList();
    calendar.init(monthNum, date);
    eventListeners();
});

const eventListeners = () => {
    previousMonth.addEventListener('click', function() {
        monthNum = monthNum > 0 ? monthNum - 1 :  11;
        calendar.setMonth(monthNum);
        date = new Date(2019,monthNum + 1,0);
        console.log('prev: ',monthNum, date);
        calendar.fillCalendar(date, monthNum);
    });

    nextMonth.addEventListener('click', function() {
        monthNum = monthNum < 11 ?  monthNum + 1 : 0;
        calendar.setMonth(monthNum);
        date = new Date(2019,monthNum +1,0);
        console.log('next: ',monthNum, date);
        calendar.fillCalendar(date, monthNum);
    });

    list.addEventListener('click', ({ target }) => {
        const { nodeName, parentNode } = target;
        if(nodeName === 'BUTTON' || parentNode.nodeName === 'BUTTON') {
            const li = parentNode.nodeName === 'LI' ?  parentNode : parentNode.parentNode.parentNode;
            const id = parseInt(li.dataset.id);
            let { key, births } = getBirthdaysFromStorage('births');
            if(target.classList.contains('remove') || target.parentNode.classList.contains('remove')) {
                list.removeChild(li);
                births = [].concat(births.slice(0,id), births.slice(id+1));
                setBirthdaysInStorage(key, births);
            } else {
                Object.values(birth).forEach((v,i) => {
                    if(birth[i].type !== 'file' && births[id][v.name]) {
                        birth[i].value = births[id][v.name]
                    }
                });
                birth.classList.add('birth--open');
            }
        }
    }, true);

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

    birth.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formFields = Object.values(e.target);
        let personBirth = {};
        const id = formFields[0].value ? formFields[0].value : false;
        personBirth.id = !id ? parseInt(Math.random() * 1000000) : id;
        for(let i=1; i < formFields.length - 1 ; i++) {

            personBirth[e.target[i].name] = formFields[i].value;
        }
        const {key, births} = getBirthdaysFromStorage('births');
        if(id) {
            const index = births.findIndex(b => b.id === Number(id));
            births.splice(index,1);
        }
        births.push(personBirth);
        setBirthdaysInStorage(key, births);
        window.location = e.target.action;
    });

    addButton.addEventListener('click', () => {
        birth.classList.add('birth--open');
    });
}

const renderBirthdaysList = async () => {
    const { births } = getBirthdaysFromStorage('births');
    let birthdays;
    try {
        const birthdaysPromise = await births.map(async (b) => {
            const { url, title } = await fetchApodData(b.birthDate);
            b.thumbnail = { url, title };
            return b;
        });
        birthdays = await Promise.all(birthdaysPromise);
    } catch(e) {
        console.log('error: ', e);
    } finally {
        list.innerHTML = birthdays.map((b,i) =>
        `<li data-id="${i}">
            <div class="responsive-img">
                <img src="${b.thumbnail.url}" alt="${b.thumbnail.title}" class="thumbnail">
            </div>
            ${b.birthDate}
            <span>${b.name}</span>
            <span>${b.email}</span>
            <div class="actions">
                <button type="buton" class="edit form-open"><i class="fa fa-pencil-alt"></i></button>
                <button type="buton" class="remove"><i class="fa fa-times"></i></button>
            </div>
        </li>`
        ).join('');
    }
}
