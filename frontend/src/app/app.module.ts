import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';

// HttpClient
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Reactive Forms
import { ReactiveFormsModule } from '@angular/forms';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Interceptors
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { BaseURLInterceptor } from './core/interceptors/base-url.interceptor';
import { AuthTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { HttpResponseInterceptor } from './core/interceptors/extraer-payload.interceptor';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './core/home/home.component';
import { CarouselComponent } from './core/home/carousel.component';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

// Modules: Shared
import { SharedModule } from '@modules/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

registerLocaleData(localeEsCo, 'es-CO');

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		CarouselComponent,
		FooterComponent,
		HeaderComponent,
		PageNotFoundComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		ReactiveFormsModule,
		AppRoutingModule,
		SharedModule,
		BrowserAnimationsModule,
		NgbModule,
		LeafletModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'es-CO' },
		{ provide: HTTP_INTERCEPTORS, useClass: BaseURLInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }