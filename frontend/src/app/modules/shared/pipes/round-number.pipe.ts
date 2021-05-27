import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'roundNumber'
})
export class RoundNumberPipe implements PipeTransform {

	transform(value: number): number {
		if (value !== undefined && value !== null) {
			return Math.round(value * 20);
		}
		return 0;
	}

}