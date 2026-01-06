import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { EventsService, EventApi } from '../../../shared/services/events.service';
import { TranslateModule } from '@ngx-translate/core';
import { EventCardComponent } from '../../../shared/components/cards/event-card/event-card.component';

@Component({
  selector: 'app-home-default',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    EventCardComponent
  ],
  templateUrl: './home-default.component.html',
  styles: ``
})
export class HomeDefaultComponent implements OnInit {
  publicEvents: EventApi[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private eventsService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.loadPublicEvents();
  }

  loadPublicEvents(): void {
    this.isLoading = true;
    this.eventsService.listPublicEvents({ limit: 20, sort_by: 'start_datetime', order: 'asc' }).subscribe({
      next: (events) => {
        this.publicEvents = events;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading public events:', err);
        this.errorMessage = 'Falha ao carregar eventos públicos.';
        this.isLoading = false;
      }
    });
  }

  openEvent(event: EventApi) {
    if (event.id_code) {
      this.router.navigate(['/events/checkin', event.id_code]);
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    try {
      // Simple formatting to match dd/MM/yyyy HH:mm
      const d = new Date(date);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }
}
