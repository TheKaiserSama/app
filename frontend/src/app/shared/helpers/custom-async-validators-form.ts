import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ApiPersonaService } from '@api/api-persona.service';
import { IPersona } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class CustomAsyncValidatorsService {

    constructor(private apiPersonaService: ApiPersonaService) { }

    documentoDuplicado(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return timer(200).pipe(
                switchMap(() => {
                    if (!control.value) return of(null);
                    return this.apiPersonaService.getPersonaPorNumeroDocumento(control.value).pipe(
                        map((persona: IPersona) => {
                            return persona ? { 'documentoDuplicado': true } : null;
                        })
                    )
                })
            );
            
        }
    }

}