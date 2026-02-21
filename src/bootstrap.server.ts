import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutes } from './app/app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { TabViewModule } from 'primeng/tabview';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

const bootstrap = () => bootstrapApplication(AppComponent, {
  providers: [
    provideServerRendering(),
    importProvidersFrom(
      AppRoutes,
      ReactiveFormsModule,
      DialogModule,
      OverlayPanelModule,
      InputTextModule,
      ButtonModule,
      InputMaskModule,
      AccordionModule,
      CarouselModule,
      TagModule,
      TabViewModule,
      GalleriaModule
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
});

export default bootstrap;