const Spinner = {
    add(el) {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        el.insertAdjacentElement('beforeend',spinner);
    },
    remove(el) {
        el.removeChild(document.querySelector('.spinner'));
    }
}

export default Spinner;
