import { getBirthdaysFromStorage, fetchApodData } from './helpers';

const calendar = { 
    monthDays: [],
    monthDates: [],
    getMonthName(month) {
        const months = ['January', 'February', 'March', 'April', 'Mai', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
        return months[month];
    },
    async fillCalendar(date, monthNum) {
        const day = date.getDay();
        const daysofMonth = date.getDate();
        const previousMonth = day > 1 ? new Date(2019,monthNum-1,0).getDate() : null;
        const nextMonth = daysofMonth - day % 7 !== 0 ? new Date(2019,monthNum+1,0).getDate() : null;
        let month = '';
        let days = day;
        const { births } = getBirthdaysFromStorage('births');
        const birthDays = births.filter(b => {
            const d = b.birthDate.split('-');
            const month = monthNum < 10 ? `0${monthNum+1}` : `${monthNum+1}`;
            return d[1] === month ? true : false;
        });
        console.log('births: ', birthDays);
        for(let i = 1; i <= daysofMonth; i++) {
            if(days === 7) {
                month += '</div>';
                days = 0;
            }
            if(i === 1 || days === 0) {
                month += `<div class="week">`;
                if(previousMonth && i === 1) {
                    const r = days - i;
                    for(let j=previousMonth - r; j <= previousMonth; j++) {
                        month +=`<div class="day--out">${j}</div>`;
                    }
                }
            }
            month += await this.getDayMarkup(i, birthDays);
            if(nextMonth && i === daysofMonth ) {   
                const r = 6 - days;   
                for(let j = 1; j <= r; j++) {
                    month +=`<div class="day--out">${j}</div>`;
                }
            }
            days += 1;
        }
        if (month.length) {
            this.render(month);   
        }
    },
    setMonth(month) {
        document.querySelector('.monthName').textContent = this.getMonthName(month);
    },
    async init(monthNum = 1, date) {
        await this.fillCalendar(date, monthNum);
        this.setMonth(monthNum);
    },
    render(month) {
        const monthView = document.querySelector('.daysInMonth');
        monthView.innerHTML = month;
    },
    async getDayMarkup(num, births) {
        let date = '';
        let icon = '';
        let tooltip = '';
        const dayNum = num < 9 ? `0${num}` : `${num}`;
        for(let i=0; i < births.length; i++) {
            const splitDate = births[i].birthDate.split('-');
            if(splitDate[2] === dayNum) {
                date = `${births[i].birthDate}`;
                icon = `<i class="fa fa-map-marker-alt">${dayNum}</i>`;
                const thumbnail = await fetchApodData(date);
                tooltip =  `<div class="tooltip">
                                <span>${births[i].name}</span>
                                <span>${new Date().getFullYear() - parseInt(births[i].birthDate.split('-')[0])}</span>
                                <span>${births[i].email}</span>
                                <div class="responsive-img">
                                    <img src="${thumbnail.url}" alt="${thumbnail.title}">
                                </div>
                            </div>`;
                break; 
            }
        }
        return `<div class="day ${date ? 'birthday' : ''}" data-birth="${date ? date : '' }">
                    ${date ? icon : dayNum}
                    ${tooltip}
                </div>`;
    }
};

export default calendar;