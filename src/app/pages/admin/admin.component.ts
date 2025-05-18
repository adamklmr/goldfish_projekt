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
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { EventService } from '../../shared/services/event.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../shared/services/auth.service';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';



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
  ProductsdisplayedColumns: string[] = ['pic','instock', 'name', 'category', 'price', 'description','action','edit'];
  EventsdisplayedColumns: string[] = ['pic','name', 'startDate', 'endDate', 'location', 'description','action','edit'];
  products: Product[] = [];
  events: Event[] = [];
  form!: FormGroup;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageIndexEvents: number = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  pagedProducts: any[] = [];
  pagedEvents: any[] = [];
  currentUser: any = null;
  selectedImageFile: File | null = null;
  selectedImageFileEvent: File | null = null;
  selectedProduct: Product | null = null;
  selectedEvent: Event | null = null;
  editMode: boolean = false;
  editProductId: string | null = null;
  editEventId: string | null = null;
  
  private subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  productsDataSource = new MatTableDataSource(this.products);
  eventsDataSource = new MatTableDataSource(this.events);

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              private eventService: EventService,
              private snackBar: MatSnackBar,
              private authService: AuthService,

  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      instock: [true],
      
    });
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      description: ['']
    });
    this.form = this.fb.group({
      listingItem: ['products'] // Default value can be 'products' or 'events'
    });
    this.loadAllProducts();
    this.loadAllEvents();
    this.loadUserData();


  }
  async loadUserData(): Promise<void> {
    try {
      this.currentUser = await this.authService.getCurrentUser();
      console.log('Current user:', this.currentUser);
      
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async addProduct(): Promise<void> {

    if(this.productForm.invalid || !this.selectedImageFile) {
      return;
    }

    if (this.editMode && this.editProductId) {
      const productData = this.productForm.value;
      // Update existing product
      this.productService.updateProduct(this.editProductId, productData).then(() => {
        this.loadAllProducts(); // Refresh product list
        this.showNotification('Product updated successfully', 'success');
        this.productForm.reset();
      });
    }else{
    if (this.productForm.valid) {

    
      const filePath = `termekek/${Date.now()}_${this.selectedImageFile.name}`;
      const storage = getStorage();
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, this.selectedImageFile);
      const downloadURL = await getDownloadURL(storageRef);

      const { name, category, price, description, instock } = this.productForm.value;
      const newProduct = {
        name,
        category,
        price,
        description,
        instock,
        pic: downloadURL
      };

      this.productService.addProduct(newProduct).then(() => {
        this.loadAllProducts();
        this.showNotification('Product added successfully', 'success');
        this.productForm.reset();
        this.selectedImageFile = null;

      }).catch(error => {
        console.error('Error adding product:', error);
        this.showNotification('Error adding product', 'error');
      });
    } else {
      this.showNotification('Form is invalid. Please check your input.', 'error');
    }
  }
  }

  async addEvent(): Promise<void> {
    if(this.eventForm.invalid || !this.selectedImageFileEvent) {
      return;
    }
    if (this.editMode && this.editEventId) {
      const eventData = this.eventForm.value;
      // Update existing product
      this.eventService.updateEvent(this.editEventId, eventData).then(() => {
        this.loadAllEvents(); // Refresh product list
        this.showNotification('Event updated successfully', 'success');
        this.eventForm.reset();
      });
    }else{
    if (this.eventForm.valid) {
      const filePath = `esemenyek/${Date.now()}_${this.selectedImageFileEvent.name}`;
      const storage = getStorage();
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, this.selectedImageFileEvent);
      const downloadURL = await getDownloadURL(storageRef);
      
      // const eventStartDate = this.eventForm.value.startDate;
      // const eventEndDate = this.eventForm.value.endDate;
      const { name, startDate, endDate, location, description } = this.eventForm.value;
      const newEvent = {
        name,
        startDate,
        endDate,
        location,
        description,
        pic: downloadURL
      };

      this.eventService.addEvent(newEvent).then(() => {
        this.loadAllEvents();
        this.showNotification('Event added successfully', 'success');
        this.eventForm.reset();
      }).catch(error => {
        console.error('Error adding event:', error);
      });
    }else {
      this.showNotification('Form is invalid. Please check your input.', 'error');
    }
  }
  }

  toggleProductCompletion(product: Product): void {
    product.instock = !product.instock;
    this.productService.toggleProductsInstock(product.id,product.instock).then(() => {
      this.loadAllProducts();
      // console.log('Product updated:', product.instock);
      const message = product.instock ? 'Product marked as in stock' : 'Product marked as out of stock';
      this.showNotification(message,'success');
    }).catch(error => {
      console.error('Error updating product:', error);
      this.showNotification('Error adding product', 'error');
    });
  }


  loadAllProducts(): void {
    const allProducts$ = this.productService.getAllProductsAdmin();
    const subscription = allProducts$.subscribe(products => {
      this.products = products;
      console.log('Loaded products:', this.products);
    }, error => {
      console.error('Error loading products:', error);
    });
    this.subscriptions.push(subscription);
    this.updatePagedProducts();
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

  editProduct(product: Product): void {
    this.editMode = true;
    this.editProductId = product.id; 
    // Populate the form with the selected product's data
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.instock,
     
    });
  
    // Store the selected product for updates
    this.selectedProduct = product;
  }
  editEvent(event: Event): void {
    this.editMode = true;
    this.editEventId = event.id; 
    // Populate the form with the selected event's data
    this.eventForm.patchValue({
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      description: event.description
    });
  
    // Store the selected product for updates
    this.selectedEvent = event;
  }

  // updateProduct(product: Product): void {
  //   if (this.productForm.invalid) {
  //     this.showNotification('Form is invalid. Please check your input.', 'error');
  //     return;
  //   }

  //   const updatedProduct = {
  //     ...product,
  //     ...this.productForm.value
  //   };

  //   if (this.selectedImageFile) {
  //     const filePath = `termekek/${Date.now()}_${this.selectedImageFile.name}`;
  //     const storage = getStorage();
  //     const storageRef = ref(storage, filePath);

  //     uploadBytes(storageRef, this.selectedImageFile).then(() => {
  //       return getDownloadURL(storageRef);
  //     }).then((downloadURL) => {
  //       updatedProduct.pic = downloadURL;
  //       return this.productService.updateProduct(product.id, updatedProduct);
  //     }).then(() => {
  //       this.loadAllProducts();
  //       this.showNotification('Product updated successfully', 'success');
  //       this.productForm.reset();
  //       this.selectedImageFile = null;
  //     }).catch(error => {
  //       console.error('Error updating product:', error);
  //       this.showNotification('Error updating product', 'error');
  //     });
  //   } else {
  //     this.productService.updateProduct(product.id, updatedProduct).then(() => {
  //       this.loadAllProducts();
  //       this.showNotification('Product updated successfully', 'success');
  //       this.productForm.reset();
  //     }).catch(error => {
  //       console.error('Error updating product:', error);
  //       this.showNotification('Error updating product', 'error');
  //     });
  //   }
  // }

  private showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`]
    });
  }  
  updatePagedProducts(){
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProducts = this.products.slice(start, end);
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedProducts();
  }
  onImageSelectedProduct(event: any): void {
    this.selectedImageFile = event.target.files[0] || null;
  }
  onImageSelectedEvent(event: any): void {
    this.selectedImageFileEvent = event.target.files[0] || null;
  }
  
}