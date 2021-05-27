import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { circle, latLng, marker, polygon, tileLayer } from 'leaflet';

import { ApiInstitucionService } from '@api/api-institucion.service';
import { IInstitucion } from '@interfaces/all.interface';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	images: string[] = [142, 149, 155, 165, 17, 20, 212].map((n) => `https://picsum.photos/id/${ n }/900/500`);
	pauseOnHover: boolean = true;
	min: number = 0;
	max: number = 1001;
	institucion$: Observable<IInstitucion>;
	options = {
		layers: [
		  tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
		],
		zoom: 11,
		center: latLng(1.6571234, -78.7446364)
	  };
	
	  layersControl = {
		baseLayers: {
		  	'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
		  	'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
		},
		overlays: {
		  	'Big Circle': circle([ 46.95, -122 ], { radius: 5000 }),
		  	'Big Square': polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
		}
	}
	  layers: any;

	constructor(private apiInstitucionService: ApiInstitucionService) { }
	
	ngOnInit(): void {
		this.institucion$ = this.apiInstitucionService.getInstituciones()
		.pipe(
			map((instituciones: IInstitucion[]) => {
				if (instituciones.length > 0)
					return instituciones[0];
			}));
		
		this.layers = [
			marker([ 1.6571234, -78.7446364 ])
			.bindPopup(`
				<center>
				<p>
					<strong>Institución Educativa Integrada de Chilvi</strong>
				</p>
				<img
					style="max-width: -webkit-fill-available;"
					src="assets/img/institucion_chilvi.png">
				</center>
			`)
		];
	}

	getListImages(): number[] {
		const listImages: number[] = [];
		for(let i = 0; i < 7; i++) {
			listImages.push(this.getRandomInt());
		}
		return listImages;
	}

	getRandomInt(): number {
		return Math.floor(Math.random() * (this.max - this.min)) + this.min;
	}

}