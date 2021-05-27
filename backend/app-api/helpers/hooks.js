function capitalize(cadena) {
    if (typeof cadena !== 'string') return '';
    let nuevaCadena = '';
    for (let i = 0; i < cadena.length; i++) {
        if (i === 0) nuevaCadena += cadena[i].toUpperCase();
        else nuevaCadena += cadena[i].toLowerCase();
    }
    return nuevaCadena;
}

module.exports = {
    capitalize
};
