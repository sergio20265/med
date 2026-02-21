import {AfterContentInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {ApiService} from "../../api.service";
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, finalize } from 'rxjs';

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
  error: string | null = null;
  
  // Карусель
  currentSlide = 0;
  slidesPerView = 2;
  canScrollLeft = false;
  canScrollRight = true;
  
  private destroy$ = new Subject<void>();
  private intersectionObserver?: IntersectionObserver;
  private loadedVideos = new Set<string>();

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.setupIntersectionObserver();
  }

  ngAfterContentInit(): void {
    this.loadVideos();
    this.updateSlidesPerView();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.intersectionObserver?.disconnect();
    
    // Удаляем обработчик изменения размера окна
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.updateSlidesPerView();
  }

  // Методы карусели
  nextSlide() {
    if (this.canScrollRight) {
      this.currentSlide++;
      this.updateCarouselState();
    }
  }

  prevSlide() {
    if (this.canScrollLeft) {
      this.currentSlide--;
      this.updateCarouselState();
    }
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
    if (width < 768) {
      this.slidesPerView = 1;
    } else if (width < 1200) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 3;
    }
    this.updateCarouselState();
  }

  loadVideos(): void {
    this.loading = true;
    this.error = null;
    
    // Прямой запрос без кэширования
    this.api.get_video_rewiew_no_cache()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response?.files) {
            this.videos = response.files.map((video: any) => ({
              ...video,
              loaded: false,
              error: false
            }));
          } else {
            this.videos = [];
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Ошибка загрузки видео:', err);
          this.error = 'Не удалось загрузить видео отзывы';
          this.videos = [];
          this.cdr.markForCheck();
        }
      });
  }

  private setupIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const videoElement = entry.target as HTMLVideoElement;
              this.preloadVideo(videoElement);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );
    }
  }

  onVideoElementReady(videoElement: HTMLVideoElement, video: VideoItem): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(videoElement);
    }
    
    // Установка атрибутов для оптимизации
    videoElement.preload = 'metadata';
    videoElement.playsInline = true;
    
    // Обработчики событий
    videoElement.addEventListener('loadedmetadata', () => {
      video.loaded = true;
      this.cdr.markForCheck();
    });
    
    videoElement.addEventListener('error', () => {
      video.error = true;
      this.cdr.markForCheck();
    });
  }

  private preloadVideo(videoElement: HTMLVideoElement): void {
    const videoUrl = videoElement.src;
    if (!this.loadedVideos.has(videoUrl)) {
      videoElement.preload = 'metadata';
      this.loadedVideos.add(videoUrl);
    }
  }

  playVideo(videoElement: HTMLVideoElement, video: VideoItem): void {
    if (video.error) {
      return;
    }

    // Пауза всех других видео
    this.pauseAllVideos();
    
    // Воспроизведение текущего видео
    videoElement.play().catch(error => {
      console.error('Ошибка воспроизведения видео:', error);
      video.error = true;
      this.cdr.markForCheck();
    });
  }

  private pauseAllVideos(): void {
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      if (!video.paused) {
        video.pause();
      }
    });
  }

  getVideoUrl(video: VideoItem): string {
    return `https://front-api.nmpansion.ru${video.url}`;
  }

  retryLoadVideo(video: VideoItem): void {
    video.error = false;
    video.loaded = false;
    this.cdr.markForCheck();
  }

  trackByVideo(index: number, video: VideoItem): string {
    return video.url;
  }

}
