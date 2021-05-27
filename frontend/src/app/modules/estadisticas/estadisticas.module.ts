import { NgModule } from '@angular/core';

// Modules : Routing - Shared
import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { ReportesComponent } from './reportes/reportes.component';
import { ReportesAdministradorComponent } from './reportes/reportes-administrador/reportes-administrador.component';
import { VistaBoletinesAdministradorComponent } from './reportes/reportes-administrador/vista-boletines-administrador/vista-boletines-administrador.component';
import { VistaConsolidadosAdministradorComponent } from './reportes/reportes-administrador/vista-consolidados-administrador/vista-consolidados-administrador.component';
import { ListarDirectoresAdminComponent } from './reportes/reportes-administrador/listar-directores-admin/listar-directores-admin.component';
import { ReportesDocenteComponent } from './reportes/reportes-docente/reportes-docente.component';
import { BoletinComponent } from './reportes/reportes-docente/boletin/boletin.component';
import { ConsolidadoComponent } from './reportes/reportes-docente/consolidado/consolidado.component';
import { FormatoBoletinComponent } from './formato-boletin/formato-boletin.component';
import { ImprimirBoletinesComponent } from './imprimir-boletines/imprimir-boletines.component';
import { FormatoConsolidadoComponent } from './formato-consolidado/formato-consolidado.component';
import { ConsolidadoHeaderInstitucionComponent } from './formato-consolidado/consolidado-header-institucion/consolidado-header-institucion.component';
import { ConsolidadoHeaderComponent } from './formato-consolidado/consolidado-header/consolidado-header.component';

@NgModule({
	declarations: [
		ReportesComponent,
		ReportesAdministradorComponent,
		ReportesDocenteComponent,
		BoletinComponent,
		ConsolidadoComponent,
		FormatoBoletinComponent,
		ImprimirBoletinesComponent,
		VistaBoletinesAdministradorComponent,
		FormatoConsolidadoComponent,
		ConsolidadoHeaderInstitucionComponent,
		ConsolidadoHeaderComponent,
		VistaConsolidadosAdministradorComponent,
		ListarDirectoresAdminComponent
	],
	imports: [
		EstadisticasRoutingModule,
		SharedModule
	]
})
export class EstadisticasModule { }