import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../ui/card/card.component';
import { CardTitleComponent } from '../../ui/card/card-title.component';
import { CardDescriptionComponent } from '../../ui/card/card-description.component';
import { BadgeComponent } from '../../ui/badge/badge.component'; // Importar BadgeComponent

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    BadgeComponent, // Adicionar BadgeComponent aos imports
  ],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
})
export class EventCardComponent {
  @Input() eventName: string = '';
  @Input() description: string = '';
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  @Input() image: string = '/images/cards/card-01.png';
  @Input() links: { text: string; url: string; variant: 'primary' | 'outline' | 'info' | 'warning' }[] = [];
  @Input() isPublic: boolean = false;
  @Input() actionLabel: string = 'Ver Detalhes';
  @Output() viewLinks = new EventEmitter<void>();
  @Output() editEvent = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();

  onViewLinksClick() {
    this.viewLinks.emit();
  }

  onEditClick() {
    if (this.isPublic) {
      this.actionClick.emit();
    } else {
      this.editEvent.emit();
    }
  }
  
  onActionClick() {
    this.actionClick.emit();
  }
}