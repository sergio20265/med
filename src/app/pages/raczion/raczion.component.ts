import {Component} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';


@Component({
    selector: 'app-raczion',
    templateUrl: './raczion.component.html',
    styleUrls: ['./raczion.component.scss'],
    standalone: true,
    imports: [BreadcumbComponent, AccordionModule]
})
export class RaczionComponent {

}
