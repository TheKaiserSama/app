module.exports = (result) => {
    const iconos = [
        'fa fa-list-alt',
        'fa fa-line-chart',
        'fa fa-bell',
        'fa fa-cogs',
        'fa fa-user'
    ];
    const indices = [];
    const menu = [];
    let idxIcono = 0;
    result.forEach(element => indices.push(element.id_opcion_padre));
    const sinRepetir = indices.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
    sinRepetir.forEach(indice => {
        const sub_menu = new Object();
        const arrayPermisos = [];
        result.forEach(element => {
            const opcion = new Object();
            const permisos = new Object();
            if (element.id_opcion_padre === indice) {
                permisos.leer = element.leer;
                permisos.crear = element.crear;
                permisos.actualizar = element.actualizar;
                permisos.eliminar = element.eliminar;
                opcion.titulo = element['nombre']; 
                opcion['permisos'] = permisos;
                arrayPermisos.push(opcion);
                sub_menu.id = element.id_opcion_padre;
                sub_menu.icono = iconos[idxIcono]
                sub_menu.titulo = element.nombre_opcion_padre;
            }
        });
        sub_menu.opciones = arrayPermisos;
        menu.push(sub_menu);
        idxIcono++;
    });
    return menu;
}