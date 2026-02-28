import {AfterContentInit, Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';
import { CommonModule } from '@angular/common';

interface VideoItem {
  url: string;
  name?: string;
  thumbnail?: string;
  duration?: number;
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
    { url: 'assets/video/video5262534676584637657.mp4', loaded: false, error: false },
  ];

  // Карусель
  currentSlide = 0;
  slidesPerView = 2;
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
    this.videos = [...this.localVideos];
    this.loading = false;
    this.updateCarouselState();
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
