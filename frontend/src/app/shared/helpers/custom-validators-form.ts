import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

let regExp: RegExp;
let estado: boolean;
let tecla: number;
let teclaFinal: string;

export function interval(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return (control.value < min || control.value > max) ? 
        { 'interval': true, 'requiredValue': `[${ min } - ${ max }]` } : null;
    }
}

export function noNegativeNumbers(control: AbstractControl) {
    return (control.value < 0) ? {'noNegativeNumbers': true } : null;
}

export function validatorEdadMinima(control: AbstractControl) {
    const [ year, month, day ] = control.value;
    const selectedDate = new Date(year, month, day);
    const date = new Date();
    // const diffDate: number = Math.abs(date - selectedDate);
    console.log('_________', control.value);
}

export function validadorSoloLetras(control: AbstractControl) {
    regExp = new RegExp('[^A-Za-zñÑáéíóúÁÉÍÓÚ]');
    estado = regExp.test(control.value);
    return estado ? { carateresNoPermitidos: true }: null;
}

export function validadorSoloNumeros(control: AbstractControl) {
    regExp = new RegExp('[^0-9]');
    estado = regExp.test(control.value);
    return estado ? { carateresNoPermitidos: true }: null;
}

// Event - blur
export function limpiarCarateresNoPermitidos(control: AbstractControl, letras: boolean = true) {
    regExp = letras ? new RegExp('[^A-Za-zñÑáéíóúÁÉÍÓÚ]') : new RegExp('[^0-9]');
    if (regExp.test(control.value)) {
        control.setValue('');
    }
}

// Event - keypress
export function soloLetras(event: KeyboardEvent): boolean {
    tecla = (document.all) ? event.keyCode : event.which;
    regExp = new RegExp('[A-Za-zñÑáéíóúÁÉÍÓÚ]');
    teclaFinal = String.fromCharCode(tecla);
    return regExp.test(teclaFinal);
}

export function soloNumeros(event: KeyboardEvent): boolean {
    tecla = (document.all) ? event.keyCode : event.which;
    regExp = new RegExp('[0-9]');
    teclaFinal = String.fromCharCode(tecla);
    return regExp.test(teclaFinal);
}