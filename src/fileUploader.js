const fileUploader = {
    uploadPhoto({ target: { files } }) {
        if(!files.length || !files[0].type.startsWith('image/')) {
            preview.removeChild(preview.querySelector('img'));
            document.querySelector('.preview').innerHTML = 'no file choosen';
            return;
        } 
        console.log('file: ', files[0]);
        
        const img = document.createElement('img');
        img.file = files[0];
        const preview = document.querySelector('.preview');
        preview.innerHTML = '';
        preview.appendChild(img);

        const reader = new FileReader();
        reader.onload = (function(aImg) { return ({ target }) => aImg.src = target.result })(img);
        reader.readAsDataURL(files[0]);
    },
    createUploadsDirectory() {
        try {
            fs.mkdirSync(`${path.dirname}/uploads`);
        } catch(err) {
            console.error('error: ', err);
            return false;
        } finally {
            return true;
        }
    }
}

export default fileUploader;