import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule, MatCardTitleGroup } from '@angular/material/card';
import { Product, ProductObject } from '../../shared/models/Product';
import { MatButtonModule } from '@angular/material/button';
import { EventObject } from '../../shared/models/Event';
import { CurrencyPipePipe } from '../../shared/pipes/currency.pipe.pipe';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';


@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CurrencyPipePipe,
    
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  ProductObject = ProductObject;
  EventObject = EventObject; // Az események tömbje

  hasStarted(eventStartDate: Date): boolean {
    const now = new Date();
    return new Date(eventStartDate) < now;
  }
}
