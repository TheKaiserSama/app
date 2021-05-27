import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { URL_SOCKECT } from '@shared/const';

@Injectable({
	providedIn: 'root'
})
export class SocketIoService {
	
	socket: Socket;
	readonly url: string = URL_SOCKECT;

	constructor() {
		this.socket = io(this.url, { transports: ['websocket'] });
	}

	listen(eventName: string): Observable<any> {
		return new Observable((subscriber) => {
			this.socket.on(eventName, (data: any) => {
				subscriber.next(data);
			});
		});
	}

	emit(eventName: string, data: any) {
		this.socket.emit(eventName, data);
	}
	
}