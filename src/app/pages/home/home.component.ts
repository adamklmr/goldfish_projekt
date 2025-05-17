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



@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CurrencyPipePipe,
    DateFormatterPipe
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
    private authService: AuthService
  ) {}
  async ngOnInit(): Promise<void> {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
    });
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
    try {
      this.currentUser = await this.authService.getCurrentUserId(); // Fetch the current user
      console.log('Current user:', this.currentUser);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }

  addToCart(product: Product): void {
    if (this.currentUser !== null) {
      this.cartService.addToCart(product.id, this.currentUser);
    } else {
      console.error('User is not logged in.');
      alert('Please log in to add items to the cart.');
    }
    alert(`${product.name} hozzáadva a kosárhoz!`);
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
  trackByEventId(index: number, event: any): any {

    return event.id; // Assuming each event has a unique 'id' property

  }
  hasStarted(eventStartDate: string): boolean {
    const now = new Date();
    return new Date(eventStartDate) < now;
  }
}
