import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
}

const CACHE_DURATION_MS = 60 * 60 * 1000; 
const cacheMap = new Map<string, CacheEntry>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.method !== 'GET') {
    return next(req);
  }

  const cacheKey = req.urlWithParams;
  const cached = cacheMap.get(cacheKey);

  if (cached) {
    const isExpired = (Date.now() - cached.timestamp) > CACHE_DURATION_MS;

    if (!isExpired) {
      return of(cached.response.clone());
    }
    cacheMap.delete(cacheKey);
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cacheMap.set(cacheKey, {
          response: event,
          timestamp: Date.now()
        });
      }
    })
  );
};