import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthenticationService } from '@core/authentication/authentication.service';
import { FooterService } from '@services/footer/footer.service';
import { HeaderService } from '@services/header/header.service';
import { NotificacionEstudianteService } from '@services/notificacion-estudiante/notificacion-estudiante.service';
import { SocketIoService } from '@services/socket-io/socket-io.service';
import { IUsuario } from '@interfaces/all.interface';
import { IMenu } from '@interfaces/menu.interface';
import { menuSinCaracteresEspeciales } from '@shared/helpers/menu-sin-caracteres-especiales.helper';
import { ROL } from '@shared/const';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	wrapper: HTMLElement;
	sidebar: HTMLElement;
	logo: HTMLElement;
	window_width: number;
	style_display: string = '';
	list_class: string[] = ['w-desktop-with-sidebar', 'w-desktop-without-sidebar', 'w-mobile-with-sidebar', 'w-mobile-without-sidebar'];
	menus: IMenu[];
	menuSinCaracteresEspeciales: IMenu[];
	currentUser: IUsuario = this.authService.currentUserValue;
	notificaciones: any;

	constructor(
		private headerService: HeaderService,
		private footerService: FooterService,
		private authService: AuthenticationService,
		private socketIoService: SocketIoService,
		private notificacionEstudianteService: NotificacionEstudianteService,
	) { }

	ngOnInit(): void {
		this.headerService.hide();
		this.footerService.hide();
		this.wrapper = document.getElementById('wrapper');
		this.sidebar = document.getElementById('sidebar');
		this.logo = document.getElementById('logo');
		this.window_width = this.get_width_window();
		this.menus = this.currentUser.menu;
		this.menuSinCaracteresEspeciales = menuSinCaracteresEspeciales(this.menus);
		if (this.window_width > 768) this.set_styles('flex', 'block', this.list_class[0], this.class_delete(0));
		this.window_resize();
		
		this.socketIoService.emit('saveSocket', this.currentUser.persona);
		if (this.authService.currentUserValue.id_rol == ROL.ESTUDIANTE.id) {
			this.socketIoService.listen('privateNotificacion')
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(notificaciones => {
				this.notificacionEstudianteService.getNotificacionesEstudiante();
				this.notificaciones = notificaciones;
			});
		}
	}

	ngOnDestroy(): void {
		this.headerService.hide();
		this.footerService.hide();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
	
	private get_width_window(): number {
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	}

	private class_delete(index: number): string[] {
		return this.list_class.filter((element, i) => i !== index);
	}
	
	private set_styles(my_logo: string, my_sidebar: string, add_class: string, remove_class: string[]): void {
		remove_class.map(x => {
			this.wrapper.classList.remove(x)
		});
		this.wrapper.classList.add(add_class);
		if (my_logo !== null) this.logo.style.display = my_logo;
		this.sidebar.style.display = my_sidebar;
	}

	private window_resize(): void {
		window.addEventListener('resize', () => {
			this.window_width = this.get_width_window();
			this.style_display = this.sidebar.style.display;

			switch(true) {
				case this.window_width <= 768 && this.style_display === 'none':
					this.set_styles('none', 'none', this.list_class[3], this.class_delete(3));
					break;
				case this.window_width <= 768 && this.style_display === 'block':
					this.set_styles('none', 'block', this.list_class[2], this.class_delete(2));
					break;
				case this.window_width > 768 && this.style_display === 'none':
					this.set_styles('flex', 'none', this.list_class[1], this.class_delete(1));
					break;
				case this.window_width > 768 && this.style_display === 'block':
					this.set_styles('flex', 'block', this.list_class[0], this.class_delete(0));
					break;
			}
		});
	}

	toggleMenu(): void {
		this.window_width = this.get_width_window();
		this.style_display = this.sidebar.style.display;

		switch(true) {
			case this.window_width <= 768 && this.style_display === 'none':
				this.set_styles(null, 'block', this.list_class[2], this.class_delete(2));
				break;
			case this.window_width <= 768 && this.style_display === 'block':
				this.set_styles(null, 'none', this.list_class[3], this.class_delete(3));
				break;
			case this.window_width > 768 && this.style_display === 'none':
				this.set_styles(null, 'block', this.list_class[0], this.class_delete(0));
				break;
			case this.window_width > 768 && this.style_display === 'block':
				this.set_styles(null, 'none', this.list_class[1], this.class_delete(1));
				break;
		}
	}
	
}