const moment = require('moment');

function formatDate(date) {
    return moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
}

function getCurrentTime() {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    
    return `${ hours }:${ minutes }:${ seconds }`;
}

function getCurrentDate() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    
    if (month < 10) month = `0${ (date.getMonth() + 1) }`;
    if (day < 10) day = `0${ date.getDate() }`;

    return `${ year }-${ month }-${ day }`;
}

function getCurrentYear() {
    return new Date().getFullYear();
}

module.exports = {
    formatDate,
    getCurrentDate,
    getCurrentYear,
    getCurrentTime
};