import { Component, ViewChild} from '@angular/core';
import { ServiceComponent } from '../../layaot/service/service.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { RehabilitationComponent } from '../../layaot/rehabilitation/rehabilitation.component';
import { DiagnosesListComponent } from '../../layaot/diagnoses-list/diagnoses-list.component';
import { TabViewModule } from 'primeng/tabview';
import { DoctorCaruselComponent } from '../../layaot/doctor-carusel/doctor-carusel.component';
import { RegistrationRulesComponent } from '../../layaot/registration-rules/registration-rules.component';
import { DayTimerPatientComponent } from '../../layaot/day-timer-patient/day-timet-patient.component';
import { MainSliderComponent } from '../../layaot/main-slider/main-slider.component';

declare function ParallaxEffect(): any;

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styles: [],
    standalone: true,
    imports: [MainSliderComponent, DayTimerPatientComponent, RegistrationRulesComponent, DoctorCaruselComponent, TabViewModule, DiagnosesListComponent, RehabilitationComponent, GalleryComponent, ServiceComponent]
})
export class IndexComponent  {

//
//   ngAfterContentInit(): void {
//     // this.api.get_article_detail('raczion').subscribe(r=>console.log(r))
//     // this.api.get_video_rewiew().subscribe(r=> this.personal =r)
//     // this.http.get('http://localhost:1337/api/gorodas/?fields=name',{headers: {'Authorization':'Bearer fb867b0bb577ee5a67088a5b2a20025198ad61ef1b2e8b25f7253ea354e71916b82d752b93f8e11747981154eabd5983dd9048207a43e5bc582bc63a23e38ff78053e5999390da569407c35033c940894c788c22554c086351c908852fa0b9adef049491b9b79dce68980ac4da2b37a74242e515381dd43ea3ed19e8c12fa2fc'}}).subscribe(
//     //   r=>console.log(r)
//     // )
//
//
// // ParallaxEffect()
//   }

  // ngOnInit(): void {
  //   init_js()
  // }

}
