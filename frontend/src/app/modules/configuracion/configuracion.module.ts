import { NgModule } from '@angular/core';

// Modules: Routing - Shared
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { InstitucionComponent } from './institucion/institucion.component';
import { InfoInstitucionComponent } from './institucion/info-institucion/info-institucion.component';
import { ListarSedesComponent } from './institucion/listar-sedes/listar-sedes.component';
import { ListarValoracionesFormativasComponent } from './institucion/listar-valoraciones-formativas/listar-valoraciones-formativas.component';

@NgModule({
	declarations: [
		InstitucionComponent,
		InfoInstitucionComponent,
		ListarSedesComponent,
		ListarValoracionesFormativasComponent
	],
	imports: [
		ConfiguracionRoutingModule,
		SharedModule
	]
})
export class ConfiguracionModule { }