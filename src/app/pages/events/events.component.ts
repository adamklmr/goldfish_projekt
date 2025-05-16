import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule,MatCardTitleGroup } from '@angular/material/card';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/Event';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    DateFormatterPipe,
    FormsModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;
  selectedLocation: string = ''; // Alapértelmezett üres helyszín
  locations: string[] = ['Budapest', 'Szeged', 'Debrecen', 'Pécs', 'Győr']; 

  constructor(private eventService: EventService) {}

  

  ngOnInit(): void {
    this.loadAllEvents(); 
  }
  loadAllEvents(): void {
    this.isLoading = true;
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
  filterEventsByLocation(): void {
    if (this.selectedLocation) {
      this.isLoading = true;
      this.eventService.getFilteredEvents(this.selectedLocation).subscribe({
        next: (data) => {
          this.events = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error filtering events:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.loadAllEvents(); // Ha nincs helyszín kiválasztva, töltsd be az összes eseményt
    }
  }
  hasStarted(eventStartDate: string): boolean {
    const now = new Date();
    return new Date(eventStartDate) < now;
  }


  trackByEventId(index: number, event: any): any {

    return event.id; // Assuming each event has a unique 'id' property

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
