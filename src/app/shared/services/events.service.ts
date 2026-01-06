import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService, User } from './auth.service';
import { environment } from '../../../environments/environment';

export interface EventApi {
  id: number;
  id_code?: string;
  name?: string;
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  start_datetime?: string;
  end_datetime?: string;
  startDate?: string;
  endDate?: string;
  image_url?: string;
  banner_url?: string;
  image?: string;
  created_by?: string;
  slug?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly API_BASE_URL = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  listEvents(): Observable<EventApi[]> {
    const token = this.authService.getAuthToken();
    const headers: { [key: string]: string } = token ? { Authorization: `Bearer ${token}` } : {};
    return this.http.get<any>(`${this.API_BASE_URL}/events`, { headers }).pipe(
      map((res: any) => {
        // Accept either array response or wrapped { data: [] }
        if (Array.isArray(res)) return res as EventApi[];
        if (Array.isArray(res?.data)) return res.data as EventApi[];
        return [];
      }),
      catchError(() => of([]))
    );
  }

  listEventsByCreator(createdBy: string): Observable<EventApi[]> {
    const token = this.authService.getAuthToken();
    const headers: { [key: string]: string } = token ? { Authorization: `Bearer ${token}` } : {};
    // Try server-side filtering via query param, fall back to client-side filtering
    return this.http
      .get<any>(`${this.API_BASE_URL}/events`, { headers, params: { created_by: String(createdBy) } })
      .pipe(
        map((res: any) => {
          const list: EventApi[] = Array.isArray(res)
            ? (res as EventApi[])
            : Array.isArray(res?.data)
            ? (res.data as EventApi[])
            : [];
          // If API ignored filter, apply client-side filtering
          return list.filter((e) => e.created_by === createdBy || (e as any)?.creator_id === createdBy || (e as any)?.createdBy === createdBy);
        }),
        catchError(() => of([]))
      );
  }

  // Lista eventos do endpoint público com filtros e suporta created_by
  listPublicEvents(params: {
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort_by?: string;
    name?: string;
    slug?: string;
    status?: string;
    from?: string;
    to?: string;
    date?: string;
    created_by?: string;
  } = {}): Observable<EventApi[]> {
    const token = this.authService.getAuthToken();
    const headers: { [key: string]: string } = token ? { Authorization: `Bearer ${token}` } : {};
    const query: any = {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      order: params.order ?? 'desc',
      sort_by: params.sort_by ?? 'start_datetime',
      name: params.name ?? '',
      slug: params.slug ?? '',
      status: params.status ?? '',
      from: params.from ?? '',
      to: params.to ?? '',
      date: params.date ?? '',
    };
    if (params.created_by) {
      query.created_by = String(params.created_by);
    }

    return this.http.get<any>(`${environment.apiUrl}/api/events/public`, { headers, params: query }).pipe(
      map((res: any) => {
        const list: EventApi[] = Array.isArray(res)
          ? (res as EventApi[])
          : Array.isArray(res?.data)
          ? (res.data as EventApi[])
          : Array.isArray(res?.data?.events) // Add support for { data: { events: [] } } format
          ? (res.data.events as EventApi[])
          : [];
        // Se o backend não filtrar por created_by, aplica filtro no cliente
        return params.created_by
          ? list.filter(
              (e) => e.created_by === params.created_by || (e as any)?.creator_id === params.created_by || (e as any)?.createdBy === params.created_by
            )
          : list;
      }),
      catchError(() => of([]))
    );
  }

  createEvent(payload: {
    name?: string;
    title?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    image_url?: string | null;
    created_by?: string;
  }): Observable<EventApi | null> {
    const token = this.authService.getAuthToken();
    const headers: { [key: string]: string } = token ? { Authorization: `Bearer ${token}` } : {};
    // Normalize keys to a canonical payload expected by the API
    const body = {
      name: payload.name ?? payload.title ?? '',
      description: payload.description ?? '',
      start_date: payload.start_date ?? '',
      end_date: payload.end_date ?? '',
      image_url: payload.image_url ?? null,
      created_by: payload.created_by ?? this.authService.getCurrentUser()?.id_code ?? undefined,
    };

    return this.http.post<any>(`${this.API_BASE_URL}/events`, body, { headers }).pipe(
      map((res: any) => (res?.data ? (res.data as EventApi) : (res as EventApi))),
      catchError(() => of(null))
    );
  }

  updateEvent(id: number, changes: Partial<EventApi>): Observable<EventApi | null> {
    const token = this.authService.getAuthToken();
    const headers: { [key: string]: string } = token ? { Authorization: `Bearer ${token}` } : {};
    // Map common fields to API naming
    const body: any = { ...changes };
    if (changes.startDate && !changes.start_date) body.start_date = changes.startDate;
    if (changes.endDate && !changes.end_date) body.end_date = changes.endDate;
    if (changes.title && !changes.name) body.name = changes.title;

    return this.http.put<any>(`${this.API_BASE_URL}/events/${id}`, body, { headers }).pipe(
      map((res: any) => (res?.data ? (res.data as EventApi) : (res as EventApi))),
      catchError(() => of(null))
    );
  }

  deleteEvent(id: number): Observable<boolean> {
    const token = this.authService.getAuthToken();
    const headers: { [key: string]: string } = token ? { Authorization: `Bearer ${token}` } : {};
    return this.http.delete<any>(`${this.API_BASE_URL}/events/${id}`, { headers }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}