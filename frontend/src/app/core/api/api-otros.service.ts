import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { 
	IDepartamento, IMunicipio, IRol, ISexo, ITipoDocumento,
	IEstadoMatricula, IJornada, IEstadoEstudiante, IEstadoDocente, IPeriodo
} from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiOtrosService {

	constructor(private http: HttpClient) { }

	getDepartamentos(): Observable<IDepartamento[]> {
		return this.http.get<IDepartamento[]>(`/departamentos`);
	}

	getEstadosDocente(): Observable<IEstadoDocente[]> {
		return this.http.get<IEstadoDocente[]>(`/estados-docentes`);
	}

	getEstadosEstudiante(): Observable<IEstadoEstudiante[]> {
		return this.http.get<IEstadoEstudiante[]>(`/estados-estudiantes`);
	}
	
	getEstadosMatricula(): Observable<IEstadoMatricula[]> {
		return this.http.get<IEstadoMatricula[]>(`/estados-matriculas`);
	}

	getJornadas(): Observable<IJornada[]> {
		return this.http.get<IJornada[]>(`/jornadas`);
	}

	getMunicipio(id: number): Observable<IMunicipio> {
		return this.http.get<IMunicipio>(`/municipios/${ id }`);
	}

	getMunicipiosPorDepartamento(idDepartamento: number | string): Observable<IMunicipio[]> {
		return this.http.get<IMunicipio[]>(`/municipios/departamento/${ idDepartamento }`);
	}

	getPeriodo(id: number): Observable<IPeriodo> {
		return this.http.get<IPeriodo>(`/periodos/${ id }`);
	}

	getRolByPk(id: number): Observable<IRol> {
		return this.http.get<IRol>(`/roles/${ id }`);
	}

	getRoles(idRol: string[]): Observable<IRol[]> {
		let params = new HttpParams();
		params = params.set('id_rol', JSON.stringify(idRol));
		return this.http.get<IRol[]>(`/roles`, { params: params });
	}

	getSexos(): Observable<ISexo[]> {
		return this.http.get<ISexo[]>(`/sexos`);
	}

	getTiposDocumento(): Observable<ITipoDocumento[]> {
		return this.http.get<ITipoDocumento[]>(`/tipos-documentos`);
	}

}
