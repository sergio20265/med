import {AfterContentInit, Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Inject, PLATFORM_ID} from '@angular/core';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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
  isMobile = false;
  displayCount = 8;

  private readonly localVideos: VideoItem[] = [
    { url: 'https://nmrehab1.ru/assets/video/avg22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/avg22-2.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/avg23.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/apr22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/apr22-2.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/apr22-3.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/apr23-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/dek22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/iul22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/iul22-2.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/iun22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/iun23-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/iun23-2.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/may22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/may22-2.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/mar22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/mar22-2.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/mar22-3.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/mar23-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/mar23-2.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/noy23-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/okt22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/okt23-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/sen22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/sen22-2.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/fev22-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/fev22-2.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/yan23-1.mp4' },
    { url: 'https://nmrehab1.ru/assets/video/yan23-2.mp4' },
  ];

  // Карусель (десктоп)
  currentSlide = 0;
  slidesPerView = 3;
  canScrollLeft = false;
  canScrollRight = true;

  // Попап
  selectedVideo: VideoItem | null = null;
  @ViewChild('modalVideo') modalVideoRef?: ElementRef<HTMLVideoElement>;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get displayedVideos(): VideoItem[] {
    return this.videos.slice(0, this.displayCount);
  }

  get hasMore(): boolean {
    return this.displayCount < this.videos.length;
  }

  loadMore(): void {
    this.displayCount = Math.min(this.displayCount + 8, this.videos.length);
    this.cdr.markForCheck();
  }

  ngAfterContentInit(): void {
    this.loadVideos();
    if (isPlatformBrowser(this.platformId)) {
      this.updateLayout();
      window.addEventListener('resize', this.handleResize);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.handleResize);
      document.body.style.overflow = '';
    }
  }

  private handleResize = () => { this.updateLayout(); };

  private updateLayout(): void {
    const width = window.innerWidth;
    this.isMobile = width < 768;
    if (width < 768) this.slidesPerView = 1;
    else if (width < 1200) this.slidesPerView = 2;
    else this.slidesPerView = 3;
    this.updateCarouselState();
    this.cdr.markForCheck();
  }

  loadVideos(): void {
    this.videos = this.localVideos.map(v => ({ ...v, loaded: false, error: false }));
    this.loading = false;
    this.updateCarouselState();
    this.cdr.markForCheck();
  }

  onVideoMetadata(event: Event, video: VideoItem): void {
    const el = event.target as HTMLVideoElement;
    video.orientation = el.videoWidth > el.videoHeight ? 'landscape' : 'portrait';
    video.loaded = true;
    this.cdr.markForCheck();
  }

  nextSlide(): void {
    if (this.canScrollRight) { this.currentSlide++; this.updateCarouselState(); }
  }

  prevSlide(): void {
    if (this.canScrollLeft) { this.currentSlide--; this.updateCarouselState(); }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.updateCarouselState();
  }

  private updateCarouselState(): void {
    this.canScrollLeft = this.currentSlide > 0;
    this.canScrollRight = this.currentSlide < this.videos.length - this.slidesPerView;
    this.cdr.detectChanges();
  }

  openModal(video: VideoItem): void {
    this.selectedVideo = video;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
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
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
    this.cdr.markForCheck();
  }

  getVideoUrl(video: VideoItem): string {
    return video.url;
  }

  trackByVideo(index: number, video: VideoItem): string {
    return video.url;
  }
}
