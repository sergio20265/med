import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../api.service';
import { SeoService } from '../../../seo-service.service';
import { NgIf, NgFor } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor]
})
export class StaffDetailComponent implements OnInit {
  staff_detail: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.api.det_personal_detail(params['slug']).subscribe(r => {
        this.staff_detail = r;
        this.updateSeo();
      });
    });
  }

  private updateSeo(): void {
    const attrs = this.staff_detail?.data?.attributes;
    if (!attrs) return;
    const name = attrs.name ?? 'Врач';
    const positions = attrs.dolzhnosti_sotrudnikovs?.data;
    const position = positions?.length ? positions[0]?.attributes?.title : 'Медицинский специалист';
    const imgPath = attrs.img?.data?.attributes?.url ?? attrs.img?.data?.attributes?.formats?.small?.url;
    const image = imgPath ? `${environment.apiHost}${imgPath}` : undefined;
    const description = `Врач частного стационара "Новая медицина" - ${name}, ${position}. Квалификация, опыт работы, специализация.`;
    this.seo.updateStaffSeo({ name, position, description, image });
  }
}
