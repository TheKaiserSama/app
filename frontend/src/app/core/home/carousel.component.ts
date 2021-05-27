import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-carousel',
	templateUrl: './carousel.component.html',
	styles: [`
		.img-slider {
			height: 400px;
			width: 100%;
			@media (min-width: 768px) {
				& {
					height: 500px; 
				}
			}
		}
	`]
})
export class CarouselComponent implements OnInit {

	@Input() images: [];
	@Input() pauseOnHover: boolean;

	constructor() { }

	ngOnInit(): void { }

}
