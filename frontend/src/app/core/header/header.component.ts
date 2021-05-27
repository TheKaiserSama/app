import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { HeaderService } from '@services/header/header.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	private path: string;

	constructor(
		private location: Location,
		public navbarService: HeaderService
	) {
		this.path = this.location.path();
		if (this.path === '' || this.path === '/home' || this.path === '/login') {
			this.navbarService.show();
		} else {
			this.navbarService.hide();
		}
	}

	ngOnInit(): void { }

}