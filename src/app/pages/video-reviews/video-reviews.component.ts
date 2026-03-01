import {AfterContentInit, Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';
import { CommonModule } from '@angular/common';

interface VideoItem {
  url: string;
  orientation?: 'portrait' | 'landscape';
  loaded?: boolean;
  error?: boolean;
}

@Component({
    selector: 'app-video-reviews',
    templateUrl: './video-reviews.component.html',
    styleUrls: ['./video-reviews.component.scss'],
    standalone: true,
    imports: [BreadcumbComponent, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoReviewsComponent implements AfterContentInit, OnDestroy {
  videos: VideoItem[] = [];
  loading = true;

  // ← Добавляйте локальные видео сюда
  private readonly localVideos: VideoItem[] = [
    { url: 'assets/video/avg22-1.mp4' },
    { url: 'assets/video/avg22-2.mp4' },
    { url: 'assets/video/avg23.mp4' },
    { url: 'assets/video/apr22-1.mp4' },
    { url: 'assets/video/apr22-2.mp4' },
    { url: 'assets/video/apr22-3.mp4' },
    { url: 'assets/video/apr23-1.mp4' },
    { url: 'assets/video/dek22-1.mp4' },
    { url: 'assets/video/iul22-1.mp4' },
    { url: 'assets/video/iul22-2.mp4' },
    { url: 'assets/video/iun22-1.mp4' },
    { url: 'assets/video/iun23-1.mp4' },
    { url: 'assets/video/iun23-2.mp4' },
    { url: 'assets/video/may22-1.mp4' },
    { url: 'assets/video/may22-2.mp4' },
    { url: 'assets/video/mar22-1.mp4' },
    { url: 'assets/video/mar22-2.mp4' },
    { url: 'assets/video/mar22-3.mp4' },
    { url: 'assets/video/mar23-1.mp4' },
    { url: 'assets/video/mar23-2.mp4' },
    { url: 'assets/video/noy23-1.mp4' },
    { url: 'assets/video/okt22-1.mp4' },
    { url: 'assets/video/okt23-1.mp4' },
    { url: 'assets/video/sen22-1.mp4' },
    { url: 'assets/video/sen22-2.mp4' },
    { url: 'assets/video/fev22-1.mp4' },
    { url: 'assets/video/fev22-2.mp4' },
    { url: 'assets/video/yan23-1.mp4' },
    { url: 'assets/video/yan23-2.mp4' },
  ];

  // Карусель
  currentSlide = 0;
  slidesPerView = 3;
  canScrollLeft = false;
  canScrollRight = true;

  // Попап
  selectedVideo: VideoItem | null = null;
  @ViewChild('modalVideo') modalVideoRef?: ElementRef<HTMLVideoElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this.loadVideos();
    this.updateSlidesPerView();
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
    document.body.style.overflow = '';
  }

  private handleResize = () => { this.updateSlidesPerView(); };

  nextSlide() {
    if (this.canScrollRight) { this.currentSlide++; this.updateCarouselState(); }
  }

  prevSlide() {
    if (this.canScrollLeft) { this.currentSlide--; this.updateCarouselState(); }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.updateCarouselState();
  }

  private updateCarouselState() {
    this.canScrollLeft = this.currentSlide > 0;
    this.canScrollRight = this.currentSlide < this.videos.length - this.slidesPerView;
    this.cdr.detectChanges();
  }

  private updateSlidesPerView() {
    const width = window.innerWidth;
    if (width < 768) this.slidesPerView = 1;
    else if (width < 1200) this.slidesPerView = 2;
    else this.slidesPerView = 3;
    this.updateCarouselState();
  }

  loadVideos(): void {
    this.videos = this.localVideos.map(v => ({ ...v, loaded: false, error: false }));
    this.loading = false;
    this.updateCarouselState();
    this.cdr.markForCheck();
  }

  /** Определяем ориентацию по реальным размерам видео после загрузки метаданных */
  onVideoMetadata(event: Event, video: VideoItem): void {
    const el = event.target as HTMLVideoElement;
    video.orientation = el.videoWidth > el.videoHeight ? 'landscape' : 'portrait';
    video.loaded = true;
    this.cdr.markForCheck();
  }

  openModal(video: VideoItem): void {
    this.selectedVideo = video;
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('vr-modal-overlay')) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.modalVideoRef?.nativeElement?.pause();
    this.selectedVideo = null;
    document.body.style.overflow = '';
    this.cdr.markForCheck();
  }

  getVideoUrl(video: VideoItem): string {
    return video.url;
  }

  trackByVideo(index: number, video: VideoItem): string {
    return video.url;
  }
}
