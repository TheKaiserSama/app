import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export function ngbDateToString(date: NgbDate): string {
    return `${ date.year }-${ date.month }-${ date.day }`;
}

export function getCurrentDate(): NgbDateStruct {
    const date = new Date();
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export function compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2; 
}

export function getCurrentYear() {
    return new Date().getFullYear();
}

export function stringToNgbDateStruct(date: string): NgbDateStruct {
    const [ year, month, day ] = date.split('-');
    return { year: +year, month: +month, day: +day };
}

export function dateToString(date: Date): string {
    return `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() }`;
}