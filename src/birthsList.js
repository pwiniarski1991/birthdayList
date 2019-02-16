import { getBirthdaysFromStorage, setBirthdaysInStorage } from './helpers';
import form from './form';
import fileUploader from './fileUploader';
import calendar from './calendar';
import spinner from './spinner';

var list = document.querySelector('#birthdayList');
var listBlock = document.querySelector('.list');
var monthNum = new Date().getMonth();
var date = new Date(2019,monthNum + 1,0);

const birthsList = {
    fillList({ target }) {
        const { nodeName, parentNode } = target;
        if(nodeName === 'BUTTON' || parentNode.nodeName === 'BUTTON') {
            const li = parentNode.nodeName === 'LI' ?  parentNode : parentNode.parentNode.parentNode;
            const id = parseInt(li.dataset.id);
            let { key, births } = getBirthdaysFromStorage('births');
            if(target.classList.contains('remove') || target.parentNode.classList.contains('remove')) {
                this.removeChild(li);
                births = [].concat(births.slice(0,id), births.slice(id+1));
                setBirthdaysInStorage(key, births);
            } else {
                form.loadForm(true, births[id]);
                document.querySelector('input[type="file"]').addEventListener('change', fileUploader.uploadPhoto);
                document.querySelector('form').addEventListener('submit',form.onSubmit);
            }
            calendar.fillCalendar(date, monthNum);
        }
    },
    renderBirthdaysList() {
        spinner.add(listBlock);
        const { births } = getBirthdaysFromStorage('births');
        // let birthdays;
        // try {
        //     const birthdaysPromise = await births.map(async (b) => {
        //         const { url, title } = await fetchApodData(b.birthDate);
        //         b.thumbnail = { url, title };
        //         return b;
        //     });
        //     birthdays = await Promise.all(birthdaysPromise);
        // } catch(e) {
        //     console.error('error: ', e);
        // } finally {
            list.innerHTML = births.map((b,i) =>
            `<li data-id="${i}">
                <div class="responsive-img">
                    <img src="${b.photo}" alt="img" class="thumbnail">
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
        //}
        spinner.remove(listBlock);
    }    
}

export default birthsList;