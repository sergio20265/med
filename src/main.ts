import 'zone.js';
// import {AppComponent} from './app/app.component';
import {bootstrapApplication, BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {AppComponent} from "./app/app.component";
import { importProvidersFrom } from '@angular/core';
import { AppRoutes } from './app/app.routes';
import {ReactiveFormsModule} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from "primeng/button";
import { InputMaskModule } from 'primeng/inputmask';
import {AccordionModule} from "primeng/accordion";
import {TagModule} from "primeng/tag";
import { TabViewModule } from 'primeng/tabview';
import {CarouselModule} from "primeng/carousel";
import {GalleriaModule} from "primeng/galleria";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";

// import {AppComponent} from './app/app.component';
// import {appConfig} from './app/app.config';
//
// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err)
// );


// bootstrapApplication(AppComponent, [
//   provideRouter(appRoutes),
//   provideServerRendering(),
// ]).catch((err) => console.error(err));
//

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(),
    importProvidersFrom(BrowserModule.withServerTransition({appId: 'serverApp'}),
      AppRoutes,
      ReactiveFormsModule,
      DialogModule, OverlayPanelModule,
      InputTextModule,
      ButtonModule, InputMaskModule,
      AccordionModule, CarouselModule,
      TagModule, TabViewModule,
      GalleriaModule
    ),
    // { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
})
  .catch(err => console.error(err));
