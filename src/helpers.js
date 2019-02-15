export const getBirthdaysFromStorage = (key) => {
    const personBirthdays = localStorage.getItem(key);
    return personBirthdays ?  { key, births: JSON.parse(personBirthdays) } : { key, births: [] };
}

export const setBirthdaysInStorage = (key, data) => {    
    localStorage.setItem(key, JSON.stringify(data));
}

export const fetchApodData= async(d) => {
    let dataImg;
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=5zps91PqfDaxXrWkwj9yJuMi04bYHCmOEsvjyMpR&date=${d}`);
        dataImg = await response.json();
    } catch(e) {
        console.log('error: ', e);
    } finally {
        return dataImg;
    }
}
