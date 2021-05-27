import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

import { getCurrentDate, getCurrentYear } from '@shared/helpers/transform';
import { MustMatch } from '@shared/helpers/must-match.validator';
import * as customValidators from '@shared/helpers/custom-validators-form';

@Injectable({
	providedIn: 'root'
})
export class FormInitService {

	constructor(private fb: FormBuilder) { }

    getControlNota(): FormControl {
        return new FormControl(
            { value: null }, {
            validators: [
                Validators.required,
                customValidators.interval(0, 5)
            ],
            updateOn: 'blur'
        });
    }

    getFormActividad(): FormGroup {
        return this.fb.group({
            nombre: [null, [ Validators.required ]],
            descripcion: [null, [ Validators.required ]],
            porcentaje: [0, {
                validators: [
                    Validators.required,
                    customValidators.interval(1, 100)
                ],
                updateOn: 'blur'
            }]
        });
    }

    getFormAnioLectivo(): FormGroup {
        return this.fb.group({
            anio_actual: [getCurrentYear(), {
                validators: [
                    Validators.required,
                    customValidators.interval(1900, 3000),
                    customValidators.noNegativeNumbers
                ],
                updateOn: 'blur'
            }],
            descripcion: [null],
            estado_anio_lectivo: [null, Validators.required],
            rango: [null, Validators.required],
            vigente: [true, []],
        });
    }

    getFormArea(): FormGroup {
        return this.fb.group({
            nombre: [null, [ Validators.required ]],
            descripcion: [null]
        });
    }

	getFormCarAcadDocente(): FormGroup {
		return this.fb.group({
			fecha_registro: [{ value: getCurrentDate(), disabled: true }, [ Validators.required ]],
			// fecha_ingreso: [null, [ Validators.required ]],
			// area: [null, [ Validators.required ]],
			materia: [null, [ Validators.required ]],
			periodo: [null, [ Validators.required ]],
			anio_lectivo: [{ value: null, disabled: true }, [ Validators.required ]],
			sede: [null, [ Validators.required ]],
            grado: [null, [ Validators.required ]],
            grupo: [null, [ Validators.required ]]
		});
    }

    getFormCurso(): FormGroup {
        return this.fb.group({
            grado: [null, [Validators.required]],
            grupo: [null, [Validators.required]],
            jornada: [null, [Validators.required]],
            sede: [null, [Validators.required]],
            anio_lectivo: [null, [Validators.required]],
            cupo_maximo: [null, [
                Validators.required,
                customValidators.noNegativeNumbers
            ]]
        });
    }
    
    getFormDocente(): FormGroup {
        return this.fb.group({
			fecha_registro: [{ value: getCurrentDate(), disabled: true }, [ Validators.required ]],
			fecha_ingreso: [null, [ Validators.required ]],
			titulo: [null, [ Validators.required ]],
            estado_docente: [null, [ Validators.required ]],
            vigente: [null, []]
		});
    }

    getFormGrado(): FormGroup {
        return this.fb.group({
            descripcion: [null, [
                Validators.required,
                customValidators.noNegativeNumbers
            ]]
        });
    }

    getFormGradoMateria(): FormGroup {
        return this.fb.group({
            anio_lectivo: [null, [Validators.required]],
            grado: [null, [Validators.required]],
            area: [null, [Validators.required]],
            materia: [null, [Validators.required]],
            vigente: [true, []]
        });
    }
    
    getFormGrupo(): FormGroup {
        return this.fb.group({
            vigente: [true, []],
            descripcion: [null, [
                Validators.required,
                customValidators.noNegativeNumbers
            ]]
        });
    }

    getFormInstitucion(): FormGroup {
        return this.fb.group({
			nombre: [null, [Validators.required]],
			descripcion: [null, []],
			mision: [null, []],
			vision: [null, []],
			himno: [null, []],
			lema: [null, []],
		});
    }

    getFormLogro(): FormGroup {
        return this.fb.group({
            porcentaje: [0, {
                validators: [
                    Validators.required,
                    customValidators.interval(1, 100)
                ],
                updateOn: 'blur'
            }],
            descripcion: [null, [Validators.required]]
        });
    }

    getFormMateria(): FormGroup {
        return this.fb.group({
            nombre: [null, [ Validators.required ]],
            descripcion: [null],
            area: [null, [ Validators.required ]]
        });
    }

    getFormMatricula(): FormGroup {
        return this.fb.group({
            anio_lectivo: [{ value: getCurrentYear(), disabled: true }, [ Validators.required ]],
            fecha_registro: [{ value: getCurrentDate(), disabled: true }, [ Validators.required ]],
            fecha_ingreso: [null, [ Validators.required ]],
            grado: [null, [ Validators.required ]],
            grupo: [null, [ Validators.required ]],
            sede: [null, [ Validators.required ]],
            estado_matricula: [null, [ Validators.required ]],
            estado_estudiante: [null, [ Validators.required ]],
            vigente: [true, []],
		});
    }

    getFormPeriodo(): FormGroup {
        return this.fb.group({
            fecha_inicio: [null, [ Validators.required ]],
            fecha_finalizacion: [null, [ Validators.required ]],
            numero: [null, {
                validators: [
                    Validators.required,
                    customValidators.noNegativeNumbers
                ],
                updateOn: 'blur'
            }],
            descripcion: [null],
            anio_lectivo: [null, [ Validators.required ]]
        });
    }

	getFormPersona(): FormGroup {
		return this.fb.group({
            primer_nombre: ['', [
                Validators.required,
                Validators.minLength(3),
                customValidators.validadorSoloLetras
            ]],
            segundo_nombre: ['', [
                Validators.minLength(3),
                customValidators.validadorSoloLetras
            ]],
            primer_apellido: ['', [
                Validators.required,
                Validators.minLength(3),
                customValidators.validadorSoloLetras
            ]],
            segundo_apellido: ['', [
                Validators.required,
                Validators.minLength(3),
                customValidators.validadorSoloLetras
            ]],
            documento: ['', [
                Validators.required,
                customValidators.validadorSoloNumeros
            ]],
            numero_telefono: ['', [ customValidators.validadorSoloNumeros ]],
            numero_celular: ['', [ customValidators.validadorSoloNumeros ]],
            direccion: ['', [ Validators.required ]],
            departamento: [null, [ Validators.required ]],
            municipio: [null, [ Validators.required ]],
            tipo_documento: [null, [ Validators.required ]],
            sexo: [null, [ Validators.required ]],
            rol: [null, [ Validators.required ]],
            fecha_nacimiento: ['', [
                Validators.required,
                // customValidators.validatorEdadMinima
            ]]
        });
    }
    
    getFormSede(): FormGroup {
        return this.fb.group({
            nombre: [null, [Validators.required]],
            descripcion: [null, []],
            direccion: [null, []],
            telefono: [null, []],
            institucion: [{ value: null, disabled: true }, [Validators.required]]
        });
    }

    getFormUsuario(): FormGroup {
        return this.fb.group({
            username: [null, [Validators.required]],
            password: [null, [Validators.required, Validators.minLength(4)]],
            confirm_password: [null, [Validators.required]]
        }, {
            validator: MustMatch('password', 'confirm_password')
        });
    }

    getFormValoracionFormativa(): FormGroup {
        return this.fb.group({
            vigente: [true, []],
            descripcion: [null, []]
        });
    }

}