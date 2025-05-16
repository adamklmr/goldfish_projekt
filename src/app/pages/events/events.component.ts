import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule,MatCardTitleGroup } from '@angular/material/card';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/Event';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';





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
  currentUser: any = null;
  locations: string[] = ['Budapest', 'Szeged', 'Debrecen', 'Pécs', 'Győr']; 
  interested: boolean = true;

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  

  async ngOnInit(): Promise<void> {
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
    try {
      this.currentUser = await this.authService.getCurrentUserId(); // Fetch the current user
      console.log('Current user:', this.currentUser);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }
  

  toggleInterest(eventId: string): void {
    this.eventService.isInterested(this.currentUser, eventId).then((isInterested) => {
      if (isInterested) {
        this.interested = this.currentUser?.events?.includes(eventId) || false;
      
        this.eventService.removeInterest(this.currentUser, eventId).then(() => {
          console.log(`Interest removed for event ${eventId}`);
          alert(`You are no longer interested in this event`);
        }).catch((error) => {
          console.error('Error removing interest:', error);
        });
      } else {
        this.interested = this.currentUser?.events?.includes(eventId);
        this.eventService.addInterest(this.currentUser, eventId).then(() => {
          alert(`You are now interested in this event`);
          console.log(`Interest added for event ${eventId}`);
          
        }).catch((error) => {
          console.error('Error adding interest:', error);
        });
      }
    }).catch((error) => {
      console.error('Error checking interest:', error);
    });
  }
  // loadUserInterests(): void {
  //   this.eventService.isInterested(this.currentUser, this.events[0].id).then((isInterested) => {
  //     this.interested = isInterested;
  //     console.log(`User is interested in event ${this.events[0].id}: ${isInterested}`);
  //   }).catch((error) => {
  //     console.error('Error checking interest:', error);
  //   });
  // }
  // filterEventsByLocation(): void {
  //   if (this.selectedLocation) {
  //     this.isLoading = true;
  //     this.eventService.getFilteredEvents(this.selectedLocation).subscribe({
  //       next: (data) => {
  //         this.events = data;
  //         this.isLoading = false;
  //       },
  //       error: (err) => {
  //         console.error('Error filtering events:', err);
  //         this.isLoading = false;
  //       }
  //     });
  //   } else {
  //     this.loadAllEvents(); // Ha nincs helyszín kiválasztva, töltsd be az összes eseményt
  //   }
  // }
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
