import { Component, OnInit,Input,Output,EventEmitter} from '@angular/core';
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
    MatPaginatorModule
  ]
})
export class AdminComponent implements OnInit {
  @Input() products: Product[] = [];
  @Input() events: Event[] = [];
  @Output() productAdded = new EventEmitter<Product>();
  @Output() eventAdded = new EventEmitter<Event>();

  productForm: FormGroup;
  eventForm: FormGroup;
  selectedProduct: Product | null = null;
  selectedEvent: Event | null = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      imageUrl: [''],
      category: ['']
    });

    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Initialization logic here
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const newProduct = this.productForm.value;
      this.productAdded.emit(newProduct);
      this.productForm.reset();
    }
  }

  addEvent(): void {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value;
      this.eventAdded.emit(newEvent);
      this.eventForm.reset();
    }
  }
}