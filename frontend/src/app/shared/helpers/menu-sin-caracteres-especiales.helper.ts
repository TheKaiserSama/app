import { IMenu } from '../interfaces/menu.interface';

export function menuSinCaracteresEspeciales(menu: IMenu[]): IMenu[] {
    let menuSinCaracteresEspeciales: IMenu[] = [];
    menu.forEach(elementoMenu => {
        let menu: any;
        let titulo: string = '';
        let tituloOriginal: string;
        let opciones: any[] = [];
        let opcionesOriginales: any[] = [];
        
        titulo = reemplazarCaracteresEspeciales(elementoMenu.titulo);
        tituloOriginal = elementoMenu.titulo;
        elementoMenu.opciones.forEach(opcion => {
            const { leer, crear, actualizar, elimicar } = opcion['permisos'];
            if (leer || crear || actualizar || elimicar) {
                opciones.push(reemplazarCaracteresEspeciales(opcion.titulo));
                opcionesOriginales.push(opcion.titulo);
            }
        })
        menu = {
            titulo: titulo,
            tituloOriginal: tituloOriginal,
            opciones: opciones,
            opcionesOriginales: opcionesOriginales
        }
        menuSinCaracteresEspeciales.push(menu);
    });

    return menuSinCaracteresEspeciales;
}

export function menuURL(menu: IMenu[]): IMenu[] {
    let menuURL: IMenu[] = [];
    menu.forEach((itemMenu) => {
        const menuObj = {};
        const opciones = [];
        menuObj['titulo'] = reemplazarCaracteresEspeciales(itemMenu.titulo);
        itemMenu.opciones.forEach((itemOpcion) => {
            const opcion = {};
            opcion['titulo'] = reemplazarCaracteresEspeciales(itemOpcion['titulo']);
            opcion['permisos'] = itemOpcion['permisos'];
            opciones.push(opcion);
        });
        menuObj['opciones'] = opciones;
        menuURL.push(menuObj);
    });
    return menuURL;
}

export function reemplazarCaracteresEspeciales(cadena: string): string {
    let caracteresEspeciales = ['á', 'é', 'í', 'ó', 'ú', 'ñ', ' '];
    let sinCaracteresEspeciales = ['a', 'e', 'i', 'o', 'u', 'n', '-'];
    for (var i = 0; i < caracteresEspeciales.length; i++) {
        cadena = cadena.replace(new RegExp('\\' + caracteresEspeciales[i], 'gi'), sinCaracteresEspeciales[i]);
    }
    return cadena.toLowerCase();
}