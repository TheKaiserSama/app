import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { FooterService } from '@services/footer/footer.service';
import { HEADER_INSTITUCION, FOOTER_INSTITUCION } from '@shared/helpers/info-institucional';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

	private path: string;
	HEADER_INSTITUCION = HEADER_INSTITUCION;
	FOOTER_INSTITUCION = FOOTER_INSTITUCION;

	constructor(
		private location: Location,
		public footerService: FooterService
	) {
		this.path = this.location.path();
		if (this.path === '' || this.path === '/home') {
			this.footerService.show();
		} else {
			this.footerService.hide();
		}
	}

	ngOnInit(): void { }

}