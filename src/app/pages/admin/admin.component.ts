import { Component, OnInit,ViewChild,OnDestroy} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptgroup, MatOption, MatSelect } from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../shared/models/Product';
import { Event } from '../../shared/models/Event';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { CurrencyPipePipe } from '../../shared/pipes/currency.pipe.pipe';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { EventService } from '../../shared/services/event.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOption,
    MatSelectModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    CurrencyPipePipe,
    DateFormatterPipe,
    MatPaginatorModule, 
    MatSnackBarModule,
  ]
})
export class AdminComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  eventForm!: FormGroup;
  ProductsdisplayedColumns: string[] = ['instock', 'name', 'category', 'price', 'description'];
  EventsdisplayedColumns: string[] = ['name', 'startDate', 'endDate', 'location', 'description'];
  products: Product[] = [];
  events: Event[] = [];
  form!: FormGroup;
  private subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  productsDataSource = new MatTableDataSource(this.products);
  eventsDataSource = new MatTableDataSource(this.events);

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              private eventService: EventService,
              private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      instock: [true],
      pic: ['']
    });
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      pic: [''],
      description: ['']
    });
    this.form = this.fb.group({
      listingItem: ['products'] // Default value can be 'products' or 'events'
    });
    this.loadAllProducts();
    this.loadAllEvents();


  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const newProduct = this.productForm.value;

      this.productService.addProduct(newProduct).then(() => {
        this.loadAllProducts();
        this.showNotification('Product added successfully', 'success');
        this.productForm.reset();
      }).catch(error => {
        console.error('Error adding product:', error);
        this.showNotification('Error adding product', 'error');
      });
    } else {
      this.showNotification('Form is invalid. Please check your input.', 'error');
    }
  }

  addEvent(): void {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value;

      const startDate = this.eventForm.get('startDate')?.value;
      const endDate = this.eventForm.get('endDate')?.value;

      this.eventService.addEvent(newEvent).then(() => {
        this.loadAllEvents();
        this.showNotification('Event added successfully', 'success');
        this.eventForm.reset();
      }).catch(error => {
        console.error('Error adding event:', error);
      });
    }
  }

  toggleProductCompletion(product: Product): void {
    product.instock = !product.instock;
    this.productService.updateProduct(product).then(() => {
      this.loadAllProducts();
      const message = product.instock ? 'Product marked as in stock' : 'Product marked as out of stock';
      this.showNotification(message,'success');
    }).catch(error => {
      console.error('Error updating product:', error);
    });
  }


  loadAllProducts(): void {
    const allProducts$ = this.productService.getAllProducts();
    const subscription = allProducts$.subscribe(products => {
      this.products = products;
      console.log('Loaded products:', this.products);
    }, error => {
      console.error('Error loading products:', error);
    });
    this.subscriptions.push(subscription);
  }

  loadAllEvents(): void {
    const allEvents$ = this.eventService.getAllEvents();
    const subscription = allEvents$.subscribe(events => {
      this.events = events;
      console.log('Loaded events:', this.events);
    }, error => {
      console.error('Error loading events:', error);
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).then(() => {
        this.loadAllProducts();
        this.showNotification('Product deleted successfully','success');
      }).catch(error => {
        console.error('Error deleting product:', error);
        this.showNotification('Error deleting product','error');
      });
    }
  }


  deleteEvent(eventId: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).then(() => {
        this.loadAllEvents();
        this.showNotification('Event deleted successfully','success');
      }).catch(error => {
        console.error('Error deleting event:', error);
        this.showNotification('Error deleting event','error');
      });
    }
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