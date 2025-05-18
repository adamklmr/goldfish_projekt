import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule, MatCardTitleGroup } from '@angular/material/card';
import { Product} from '../../shared/models/Product';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipePipe } from '../../shared/pipes/currency.pipe.pipe';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { Event } from '../../shared/models/Event';
import { EventService } from '../../shared/services/event.service';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../shared/services/auth.service'; // Assuming you have an AuthService to get the current user ID
import { MatSnackBarModule,MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CurrencyPipePipe,
    DateFormatterPipe,
    MatSnackBarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  events: Event[] = [];
  currentUser: any = null;
  interested: boolean = true;

  constructor(
    private eventService: EventService,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.loadadEvents();  
    this.loadUserData();
    this.loadadProducts();
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
  loadadProducts(): void 
  {
    this.productService.getAllProducts().subscribe({
    next: (data) => {
      this.products = data;
      
    },
    error: (err) => {
      console.error('Error loading products:', err);
      
    }
    });
  } 
  loadadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        
      },
      error: (err) => {
        console.error('Error loading events:', err);
        
      }
    });
  }

  addToCart(product: Product): void {
    if (this.currentUser !== null) {
      this.cartService.addToCart(product.id, this.currentUser.id);
    } else {
      console.error('User is not logged in.');
      alert('Please log in to add items to the cart.');
    }
    this.showNotification('A terméket hozzáadtad a kosárhoz!', 'success');
  }

  toggleInterest(eventId: string): void {
    this.eventService.isInterested(this.currentUser.id, eventId).then((isInterested) => {
      if (isInterested) {
        this.interested = this.currentUser?.events?.includes(eventId) || false;
      
        this.eventService.removeInterest(this.currentUser.id, eventId).then(() => {
          console.log(`Interest removed for event ${eventId}`);
          alert(`You are no longer interested in this event`);
        }).catch((error) => {
          console.error('Error removing interest:', error);
        });
      } else {
        this.interested = this.currentUser?.events?.includes(eventId);
        this.eventService.addInterest(this.currentUser.id, eventId).then(() => {
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
  trackByEventId(index: number, event: any): any {

    return event.id; // Assuming each event has a unique 'id' property

  }
  hasStarted(eventStartDate: string): boolean {
    const now = new Date();
    return new Date(eventStartDate) < now;
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
