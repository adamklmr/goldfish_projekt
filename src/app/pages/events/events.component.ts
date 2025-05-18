import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule,MatCardTitleGroup } from '@angular/material/card';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/Event';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';





@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    DateFormatterPipe,
    FormsModule,
    MatSnackBarModule
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
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  

  ngOnInit(): void {
    this.loadadEvents();  
    this.loadUserData();
  }
  async loadUserData(): Promise<void> {
    try {
      this.currentUser = await this.authService.getCurrentUser();
      console.log('Current user:', this.currentUser);
      console.log('User events:', this.currentUser.events);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }
  loadadEvents(): void {
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
  toggleInterest(eventId: string): void {
    this.eventService.isInterested(this.currentUser.id, eventId).then((isInterested) => {
      if (isInterested) {
        this.interested = this.currentUser?.events?.includes(eventId) || false;
      
        this.eventService.removeInterest(this.currentUser.id, eventId).then(() => {
          console.log(`Interest removed for event ${eventId}`);
          // this.showNotification('You are no longer interested in this event!', 'success');
        }).catch((error) => {
          console.error('Error removing interest:', error);
        });
      } else {
        this.interested = this.currentUser?.events?.includes(eventId);
        this.eventService.addInterest(this.currentUser.id, eventId).then(() => {
          // this.showNotification('You are now interested in this event!', 'success');
          console.log(`Interest added for event ${eventId}`);
          
        }).catch((error) => {
          console.error('Error adding interest:', error);
        });
      }
    }).catch((error) => {
      console.error('Error checking interest:', error);
    });
  }


  hasStarted(eventStartDate: string): boolean {
    const now = new Date();
    return new Date(eventStartDate) < now;
  }

 

  trackByEventId(index: number, event: any): any {

    return event.id; // Assuming each event has a unique 'id' property

  }

  isUserInterested(eventId: string): boolean {
    return Array.isArray(this.currentUser?.events) && this.currentUser.events.includes(eventId);
  }
  private showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`]
    });
  } 
}
