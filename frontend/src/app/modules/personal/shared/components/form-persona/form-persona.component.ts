import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ApiOtrosService } from '@api/api-otros.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { IDepartamento, IPersona, IRol, IMunicipio, ITipoDocumento, ISexo } from '@interfaces/all.interface';
import * as customValidators from '@shared/helpers/custom-validators-form';
import { ngbDateToString, stringToNgbDateStruct, compareFn } from '@shared/helpers/transform';
import { MIN_DATE, MAX_DATE } from '@shared/const';

@Component({
	selector: 'app-form-persona',
	templateUrl: './form-persona.component.html',
	styleUrls: ['./form-persona.component.scss']
})
export class FormPersonaComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();
    @Input() button: any;
    @Input('rolList') roles$: Observable<IRol[]>;
    @Output() emitPersona = new EventEmitter<IPersona>();
    @Output() statusForm = new EventEmitter<boolean>();
    @Output() emitRol = new EventEmitter<IRol>();
    minDate: NgbDateStruct = MIN_DATE;
    maxDate: NgbDateStruct = MAX_DATE;
    formPersona: FormGroup;
    tiposDocumento$: Observable<ITipoDocumento[]>;
    sexos$: Observable<ISexo[]>;
    departamentos$: Observable<IDepartamento[]>;
    municipios$: Observable<IMunicipio[]>;
    controls = {};
	
    // Funciones validadoras
    soloLetras = customValidators.soloLetras;
    soloNumeros = customValidators.soloNumeros;
    limpiarCarateresNoPermitidos = customValidators.limpiarCarateresNoPermitidos;
	compareFn = compareFn;

	constructor(
        private apiOtrosService: ApiOtrosService,
        private formInitService: FormInitService,
	) { }

	ngOnInit(): void {
        this.formPersona = this.formInitService.getFormPersona();
        this.initControls();
        this.tiposDocumento$ = this.apiOtrosService.getTiposDocumento();
        this.sexos$ = this.apiOtrosService.getSexos();
        this.departamentos$ = this.apiOtrosService.getDepartamentos();
        this.formPersona.statusChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((status: string) => {
            (status === 'INVALID') ? this.statusForm.emit(true) : this.statusForm.emit(false);
        });
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private initControls(): void {
        Object.keys(this.formPersona.controls).forEach(key => {
            this.controls[key] = this.formPersona.get(key);
        });
    }
    
	getPersona(): IPersona {
        const persona: IPersona = {};
        const date: NgbDate = this.controls['fecha_nacimiento'].value;
        const newDate: string = ngbDateToString(date);

        persona.documento = this.controls['documento'].value;
        persona.primer_nombre = this.controls['primer_nombre'].value;
        persona.segundo_nombre = this.controls['segundo_nombre'].value;
        persona.primer_apellido = this.controls['primer_apellido'].value;
        persona.segundo_apellido = this.controls['segundo_apellido'].value;
        persona.fecha_nacimiento = newDate;
        persona.numero_telefono = this.controls['numero_telefono'].value;
        persona.numero_celular = this.controls['numero_celular'].value;
        persona.direccion = this.controls['direccion'].value;
        persona.id_rol = this.controls['rol'].value.id;
        persona.id_tipo_documento = this.controls['tipo_documento'].value.id;
        persona.id_municipio = this.controls['municipio'].value.id;
        persona.id_sexo = this.controls['sexo'].value.id;

        persona.municipio = this.controls['municipio'].value;
        persona.municipio.departamento = this.controls['departamento'].value;
        persona.rol = this.controls['rol'].value;
        persona.sexo = this.controls['sexo'].value;
        persona.tipo_documento = this.controls['tipo_documento'].value;
        return persona;
    }
    
    setPersona(persona: IPersona): void {
        const { fecha_nacimiento, municipio: { departamento } } = persona;
        const _fecha_nacimiento = stringToNgbDateStruct(fecha_nacimiento);

        this.controls['documento'].setValue(persona.documento);
        this.controls['primer_nombre'].setValue(persona.primer_nombre);
        this.controls['segundo_nombre'].setValue(persona.segundo_nombre);
        this.controls['primer_apellido'].setValue(persona.primer_apellido);
        this.controls['segundo_apellido'].setValue(persona.segundo_apellido);
        this.controls['fecha_nacimiento'].setValue(_fecha_nacimiento);
        this.controls['numero_telefono'].setValue(persona.numero_telefono);
        this.controls['numero_celular'].setValue(persona.numero_celular);
        this.controls['direccion'].setValue(persona.direccion);
        this.controls['departamento'].setValue(persona.municipio.departamento);
        this.municipios$ = this.apiOtrosService.getMunicipiosPorDepartamento(departamento.id)
        .pipe(
            map((municipios: IMunicipio[]) => {
                const index = municipios.findIndex((municipio: IMunicipio) => municipio.id == persona.id_municipio);
                this.controls['municipio'].setValue(municipios[index]);
                return municipios;
            }));
        this.controls['rol'].setValue(persona.rol);
        this.controls['sexo'].setValue(persona.sexo);
        this.controls['tipo_documento'].setValue(persona.tipo_documento);
    }

    handleDepartamento(departamento: IDepartamento): void {
        if (!departamento) return;
        this.controls['municipio'].setValue(null);
        this.municipios$ = this.apiOtrosService.getMunicipiosPorDepartamento(departamento.id);
    }
    
    handleRol(rol: IRol): void {
        if (!rol) return;
        this.emitRol.emit(rol);
    }

	onDateSelect($event: NgbDate): void { }

	sendFormPersona(): void {
        if (this.formPersona.invalid) {
			console.log('Formulario invalido');
            if (this.controls['departamento'].value === null) console.log('No selecciono departamento');
            if (this.controls['municipio'].value === null) console.log('No selecciono municipio');
            if (this.controls['tipo_documento'].value === null) console.log('No selecciono tipo de documento');
            return;
        }
        this.emitPersona.emit(this.getPersona());
	}
	
	resetFormPersona(): void {
        this.formPersona.reset();
    }

    get documento() { return this.formPersona.get('documento'); }

}