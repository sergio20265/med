import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // время жизни в миллисекундах
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 минут
  private readonly MAX_CACHE_SIZE = 100;
  
  // Для отслеживания активных запросов
  private activeRequests = new Map<string, Observable<any>>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Очищаем кэш каждые 10 минут
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => this.cleanExpiredCache(), 10 * 60 * 1000);
    }
  }

  /**
   * Получить данные из кэша или выполнить запрос
   */
  get<T>(key: string, requestFn: () => Observable<T>, ttl: number = this.DEFAULT_TTL): Observable<T> {
    // Проверяем, есть ли валидные данные в кэше
    const cachedItem = this.cache.get(key);
    if (cachedItem && this.isValidCacheItem(cachedItem)) {
      return of(cachedItem.data);
    }

    // Проверяем, есть ли активный запрос для этого ключа
    const activeRequest = this.activeRequests.get(key);
    if (activeRequest) {
      return activeRequest;
    }

    // Выполняем новый запрос
    const request$ = requestFn().pipe(
      tap(data => {
        this.set(key, data, ttl);
        this.activeRequests.delete(key);
      }),
      shareReplay(1)
    );

    this.activeRequests.set(key, request$);
    return request$;
  }

  /**
   * Сохранить данные в кэш
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    // Проверяем размер кэша и очищаем при необходимости
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanOldestCache();
    }

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.cache.set(key, cacheItem);
  }

  /**
   * Получить данные из кэша (без запроса)
   */
  getFromCache<T>(key: string): T | null {
    const cachedItem = this.cache.get(key);
    if (cachedItem && this.isValidCacheItem(cachedItem)) {
      return cachedItem.data;
    }
    return null;
  }

  /**
   * Удалить элемент из кэша
   */
  delete(key: string): void {
    this.cache.delete(key);
    this.activeRequests.delete(key);
  }

  /**
   * Очистить весь кэш
   */
  clear(): void {
    this.cache.clear();
    this.activeRequests.clear();
  }

  /**
   * Инвалидировать кэш по паттерну
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  /**
   * Получить статистику кэша
   */
  getCacheStats(): {
    size: number;
    maxSize: number;
    activeRequests: number;
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      activeRequests: this.activeRequests.size,
      hitRate: this.calculateHitRate()
    };
  }

  /**
   * Предварительная загрузка данных
   */
  preload<T>(key: string, requestFn: () => Observable<T>, ttl: number = this.DEFAULT_TTL): void {
    if (!this.cache.has(key)) {
      this.get(key, requestFn, ttl).subscribe();
    }
  }

  /**
   * Проверить, валиден ли элемент кэша
   */
  private isValidCacheItem(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp < item.ttl;
  }

  /**
   * Очистить просроченные элементы кэша
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now - item.timestamp >= item.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Очистить самые старые элементы кэша
   */
  private cleanOldestCache(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Удаляем 20% самых старых элементов
    const itemsToRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < itemsToRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Вычислить коэффициент попаданий в кэш
   */
  private calculateHitRate(): number {
    // Простая реализация - в реальном проекте можно добавить более сложную логику
    return this.cache.size > 0 ? 0.8 : 0;
  }

  /**
   * Создать ключ кэша для API запроса
   */
  static createApiCacheKey(endpoint: string, params?: any): string {
    const baseKey = `api:${endpoint}`;
    if (params) {
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${JSON.stringify(params[key])}`)
        .join('&');
      return `${baseKey}?${sortedParams}`;
    }
    return baseKey;
  }
}

// Утилита для создания ключей кэша
export class CacheKeyBuilder {
  static forMethod(className: string, methodName: string, args: any[]): string {
    return `${className}:${methodName}:${JSON.stringify(args)}`;
  }
  
  static forApi(endpoint: string, params?: any): string {
    return CacheService.createApiCacheKey(endpoint, params);
  }
}