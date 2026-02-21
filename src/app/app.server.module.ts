import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    ServerModule
  ],
  bootstrap: []
})
export class AppServerModule {}
