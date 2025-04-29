import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatCardTitleGroup } from '@angular/material/card';
import { Product, ProductObject } from '../../shared/models/Product';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule,
    MatButtonModule,      
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {
  ProductObject = ProductObject; // ProA termékek tömbje
  selectedIndex: number = 0; // Alapértelmezésben az első termék indexe
  maxPrice: number = 0; // Alapértelmezett maximális ár
  filteredProducts: Product[] = [...this.ProductObject];
  categories: string[] = Array.from(new Set(this.ProductObject.map(product => product.category)));; // Kategóriák tömbje

  ngOnInit(): void {

  }
  reload(index: number): void {
    // Ellenőrizzük, hogy az index érvényes-e
    if (index >= 0 && index < this.ProductObject.length) {
      this.selectedIndex = index; // Beállítjuk az új kiválasztott indexet
      console.log("Új selectedIndex:", index); // Ellenőrzéshez
    } else {
      console.error("Érvénytelen index:", index);
    }
  }
  getFilteredProducts(): void {
    console.log('Max Price:', this.maxPrice);
    console.log('All Products:', this.ProductObject);
    if (this.maxPrice !== null && !isNaN(this.maxPrice)) {
      this.filteredProducts = this.ProductObject.filter(product => product.price <= this.maxPrice);
    } else {
      this.filteredProducts = [...this.ProductObject];
    }
  }
  // maxPrize(): void {
  //   console.log('Max Price:', this.maxPrice);
  //   if (this.maxPrice !== null && !isNaN(this.maxPrice)) {
  //     this.filteredProducts = this.ProductObject.filter(product => product.price <= this.maxPrice);
  //   } else {
  //     this.filteredProducts = [...this.ProductObject];
  //   }
  // }
  // selectedCategory(category: string): void {
  //   if (category) {
  //     this.filteredProducts = this.ProductObject.filter(product => product.category === category);
  //     console.log('Selected Category:', category);
  //   } else {
  //     this.filteredProducts = [...this.ProductObject];
  //   }
  // }

}

