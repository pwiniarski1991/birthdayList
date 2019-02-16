import { getBirthdaysFromStorage, setBirthdaysInStorage } from './helpers';
import fileUploader from './fileUploader';

const root = document.querySelector('.wrapper');

const form = {
    async onSubmit(e) {
        e.preventDefault();
        const formFields = Object.values(e.target);
        let personBirth = {};
        const id = formFields[0].value ? formFields[0].value : false;
        personBirth.id = !id ? parseInt(Math.random() * 1000000) : id;
        for(let i=1; i < formFields.length - 1 ; i++) {
            if(formFields[i].type === 'file') {
                personBirth[e.target[i].name] = root.querySelector('.preview img').src;
                continue;
            }
            personBirth[e.target[i].name] = formFields[i].value;
        }
        const { key, births } = getBirthdaysFromStorage('births');
        if(id) {
            const index = births.findIndex(b => b.id === Number(id));
            births.splice(index,1);
        }
        births.push(personBirth);
        setBirthdaysInStorage(key, births);
        root.querySelector('input[type="file"]').removeEventListener('change',fileUploader.uploadPhoto);
        root.querySelector('.birth').removeEventListener('submit', this.onSubmit);
        root.removeChild(root.querySelector('.birth'));
        window.location = '/';
    },
    loadForm(isEditing = false, data = {}) {
        const img = data.photo ? `<img src="${data.photo}" alt="img">` : '';
        const form = document.createElement('form');
        form.method = 'POST';
        form.enctype = "multipart/form-data";
        form.className = 'birth';

        form.innerHTML = `
            <input type="hidden" name="id" value="${data.id || ''}">
            <div class="formfield">
                <label for="name">Name: </label>
                <input type="text" name="name" value="${data.name || ''}" id="name" required >
            </div>
            <div class="formfield">
                <label for="photo">Photo: 
                        <input type="file" name="photo" value="" id="photo" accept="image/*" ${isEditing ? '' : 'required'}>
                </label>
                <div class="preview">
                    ${data.photo ? img : 'No file choosen'}
                </div>
            </div>
            <div class="formfield">
                <label for="birthDate">Birth date: </label>
                <input type="date" name="birthDate" value="${data.birthDate || ''}" id="birthDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" required>
            </div>
            <div class="formfield">
                <label for="email">Email: </label>
                <input type="email" name="email" value="${data.email || ''}" id="email" pattern="^[a-zA-Z]+[a-zA-Z0-9]{0,24}@[a-zA-Z]+\.(com|pl|co|eu)" required>
            </div>
            <div class="formfield">
                <label for="phone">Phone: </label>
                <input type="tel" name="phone" value="${data.phone || ''}" id="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}" required>
            </div>
            <input type="submit" name="send" value="${isEditing ? 'Update' : 'Create'}" id="send">
        `;
    
        root.insertAdjacentElement('afterbegin',form);
    }
};

export default form;