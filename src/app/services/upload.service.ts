import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type FitMode = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export interface UploadOptions {
  folder?: string;
  w?: number;
  h?: number;
  fit?: FitMode;
  format?: ImageFormat;
  q?: number;
  type?: string;
  fieldName?: string;
  entityId?: string | number;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  filename?: string;
  url?: string;
  size?: number;
  folder?: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);
  private readonly API_BASE_URL = `${environment.apiUrl}/api/v1`;

  uploadImage(file: File, options: UploadOptions = {}): Observable<UploadResponse> {
    const form = new FormData();
    const field = 'file'; // API Google Drive expects 'file'
    form.append(field, file);
    
    // Mapping options to FormData if API supports them or ignored
    if (options.folder) form.append('folder', options.folder);
    if (options.type) form.append('type', options.type);
    if (options.entityId !== undefined) form.append('entityId', String(options.entityId));

    return this.http.post<any>(`${this.API_BASE_URL}/uploads`, form).pipe(
      map(response => {
        if (response.success) {
          // A API agora retorna a URL pronta para uso (proxy ou direta)
          const finalUrl = response.data.url || response.data.downloadUrl;
          
          return {
            success: true,
            filename: response.data.name,
            url: finalUrl,
            folder: options.folder
          };
        }
        return { success: false, error: response.message || 'Upload failed' };
      })
    );
  }

  uploadAvatar(file: File, options: UploadOptions = {}): Observable<UploadResponse> {
    // Reusing the same endpoint logic
    return this.uploadImage(file, { ...options, type: 'avatar', folder: 'users' });
  }
}