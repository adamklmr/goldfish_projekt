import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule,MatCardTitleGroup } from '@angular/material/card';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/Event';




@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.isLoading = false;
      }
    });
  }

reload(index: number): void {
    // Ellenőrizzük, hogy az index érvényes-e
    // if (index >= 0 && index < this.EventObject.length) {
    //   this.selectedIndex = index; // Beállítjuk az új kiválasztott indexet
    //   console.log("Új selectedIndex:", index); // Ellenőrzéshez
    // } else {
    //   console.error("Érvénytelen index:", index);
    // }
  }
}
