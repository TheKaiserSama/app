import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-starts',
	template: `
		<ng-template #t let-fill="fill">
			<span class="star" [class.full]="fill === 100">
				<span class="half" [style.width.%]="fill">
					<em class="fa fa-star text-warning"></em>
				</span><em class="fa fa-star-o text-warning cursor"></em>
			</span>
		</ng-template>

		<ngb-rating [(rate)]="currentRate" [starTemplate]="t" [readonly]="true" max="5"></ngb-rating>
	`,
	styleUrls: ['./starts.component.scss']
})
export class StartsComponent implements OnInit {

	@Input() currentRate;

	constructor() { }

	ngOnInit(): void { }

}