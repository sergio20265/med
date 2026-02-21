import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StacionarComponent} from './stacionar/stacionar.component';
import {DomPrestarelComponent} from './dom-prestarel/dom-prestarel.component';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";

import {TabViewModule} from "primeng/tabview";
import {BreadcumbComponent} from "../../layaot/breadcumb/breadcumb.component";
import {ReabilitaciyaPosleInsultovComponent} from './reabilitaciya-posle-insultov/reabilitaciya-posle-insultov.component';


const routes: Routes = [
  {path: 'dom-prestarelyh', component: DomPrestarelComponent},
  {path: 'stacionar', component: StacionarComponent},
  // {path: 'reabilitaciya-posle-insultov', component: ReabilitaciyaPosleInsultovComponent},
  {path: 'reabilitaciya-posle-insultov/:gorod', component: ReabilitaciyaPosleInsultovComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking'
    }),

    TabViewModule,
  ],
  exports: [RouterModule],
  providers: [BreadcumbComponent],
})
export class GorodaModule {
}
