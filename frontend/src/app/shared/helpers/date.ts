export function _getCurrentDate() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    
    if (month < 10) month = +`0${ (date.getMonth() + 1) }`;
    if (day < 10) day = +`0${ date.getDate() }`;

    return `${ year }-${ month }-${ day }`;
}