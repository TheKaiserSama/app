import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Modules
import { ChartsModule } from 'ng2-charts';
import { NgBootstrapModule } from '../ng-bootstrap/ng-bootstrap.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';

// Pipes
import { RemoveCommaPipe } from './pipes/remove-comma.pipe';
import { RoundNumberPipe } from './pipes/round-number.pipe';

// Components
import { ListarCargaAcademicaDocenteComponent } from './components/listar-carga-academica-docente/listar-carga-academica-docente.component';
import { FormLogroComponent } from './components/form-logro/form-logro.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { FormActividadComponent } from './components/form-actividad/form-actividad.component';
import { StartsComponent } from './components/starts/starts.component';
import { CardComponent } from './components/card/card.component';
import { CardIndicadorComponent } from './components/card-indicador/card-indicador.component';
import { FormMateriaComponent } from './components/form-materia/form-materia.component';
import { FormAreaComponent } from './components/form-area/form-area.component';
import { FormGradoComponent } from './components/form-grado/form-grado.component';
import { FormGrupoComponent } from './components/form-grupo/form-grupo.component';
import { FormCursoComponent } from './components/form-curso/form-curso.component';
import { FormAnioLectivoComponent } from './components/form-anio-lectivo/form-anio-lectivo.component';
import { FormPeriodoComponent } from './components/form-periodo/form-periodo.component';
import { FormGradoMateriaComponent } from './components/form-grado-materia/form-grado-materia.component';
import { BarChartEstudianteActividadesComponent } from './components/bar-chart-estudiante-actividades/bar-chart-estudiante-actividades.component';
import { FormSedeComponent } from './components/form-sede/form-sede.component';
import { FormUsuarioComponent } from './components/form-usuario/form-usuario.component';
import { FieldErrorDisplayComponent } from './components/field-error-display/field-error-display.component';
import { FormValoracionFormativaComponent } from './components/form-valoracion-formativa/form-valoracion-formativa.component';
import { ListarDirectoresGrupoComponent } from './components/listar-directores-grupo/listar-directores-grupo.component';
import { CardWelcomeAdminComponent } from './components/card-welcome-admin/card-welcome-admin.component';
import { BarChartAdminWelcomeComponent } from './components/bar-chart-admin-welcome/bar-chart-admin-welcome.component';
import { PieChartAdminWelcomeComponent } from './components/pie-chart-admin-welcome/pie-chart-admin-welcome.component';
import { WidgetChartComponent } from './components/widget-chart/widget-chart.component';

@NgModule({
	declarations: [
		ListarCargaAcademicaDocenteComponent,
		FormLogroComponent,
		RemoveCommaPipe,
		ConfirmationModalComponent,
		FormActividadComponent,
		StartsComponent,
		CardComponent,
		CardIndicadorComponent,
		RoundNumberPipe,
		FormMateriaComponent,
		FormAreaComponent,
		FormGradoComponent,
		FormGrupoComponent,
		FormCursoComponent,
		FormAnioLectivoComponent,
		FormPeriodoComponent,
		FormGradoMateriaComponent,
		BarChartEstudianteActividadesComponent,
		FormSedeComponent,
		FormUsuarioComponent,
		FieldErrorDisplayComponent,
		FormValoracionFormativaComponent,
		ListarDirectoresGrupoComponent,
		CardWelcomeAdminComponent,
		BarChartAdminWelcomeComponent,
		PieChartAdminWelcomeComponent,
		WidgetChartComponent
	],
	imports: [
		CommonModule,
		NgBootstrapModule,
		FormsModule,
		ReactiveFormsModule,
		ChartsModule,
		AngularMaterialModule
	],
	exports: [
		CommonModule,
		NgBootstrapModule,
		FormsModule,
		ReactiveFormsModule,
        ListarCargaAcademicaDocenteComponent,
		FormLogroComponent,
		RemoveCommaPipe,
		FormActividadComponent,
		StartsComponent,
		CardComponent,
		CardIndicadorComponent,
		RoundNumberPipe,
		FormMateriaComponent,
		FormAreaComponent,
		FormGradoComponent,
		FormGrupoComponent,
		FormCursoComponent,
		FormAnioLectivoComponent,
		FormPeriodoComponent,
		FormGradoMateriaComponent,
		BarChartEstudianteActividadesComponent,
		ChartsModule,
		AngularMaterialModule,
		FormSedeComponent,
		FormUsuarioComponent,
		FieldErrorDisplayComponent,
		FormValoracionFormativaComponent,
		ListarDirectoresGrupoComponent,
		CardWelcomeAdminComponent,
		BarChartAdminWelcomeComponent,
		PieChartAdminWelcomeComponent,
		WidgetChartComponent
	],
	providers: [ DatePipe ]
})
export class SharedModule { }