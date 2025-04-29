import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatCardTitleGroup } from '@angular/material/card';
import { Product, ProductObject } from '../../shared/models/Product';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CurrencyPipePipe } from '../../shared/pipes/currency.pipe.pipe';
import { CouponObject } from '../../shared/models/Coupon';
import { Cart, CartObject } from '../../shared/models/Cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    CurrencyPipePipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  ProductObject = CartObject; // A termékek tömbje
  ProductsdisplayedColumns = ['pic', 'name', 'category','quantity','price','actions']; // Az oszlopok, amiket meg akarunk jeleníteni a táblázatban

  couponCode: string = '';
  totalPrice: number = 0; // Példa alapár
  discount: number = 0;
  discountedPrice: number = 0;
  products: Cart[] = CartObject;

  ngOnInit(): void {
    this.discountedPrice = this.getTotalPrice(); // Kezdetben a kedvezmény nélküli ár
    
  }
  removeFromCart(index: number): void {
    // Ellenőrizzük, hogy az index érvényes-e
    if (index >= 0 && index < this.products.length) {
      this.ProductObject.splice(index,1); // Eltávolítjuk a terméket a tömbből 
      this.products = [...this.ProductObject]; // Frissítjük a termékek tömbjét
      console.log("Termék eltávolítva:", index); // Ellenőrzéshez
      this.ngOnInit() // Frissítjük a teljes árat
      this.getTotalPrice(); // Frissítjük a teljes árat
      alert("Termék eltávolítva a kosárból");
    } else {
      console.error("Érvénytelen index:", index);
    }
  }

  getTotalPrice(): number {
      return this.products.reduce((total, product) => total + (product.price), 0);
  }

  applyCoupon(): void {
    const foundCoupon = CouponObject.find(coupon => 
      coupon.name.toLowerCase() === this.couponCode.toLowerCase()
    );
    if (foundCoupon) {
      this.discount = foundCoupon.value;
      this.discountedPrice = this.getTotalPrice() - (this.getTotalPrice() * this.discount) / 100;
      // this.discountedPrice = this.getTotalPrice();
      // console.log(this.getTotalPrice());
      alert(`Kuponkód alkalmazva! ${this.discount}% kedvezmény.`);
    } else {
      alert('Érvénytelen kuponkód.');
      this.discount = 0;
      this.discountedPrice = this.getTotalPrice();
    }
  }
  checkout(): void {
    if (this.products.length === 0) {
          alert("A kosár üres, nem lehet fizetni.");
          return;
        }
        alert(`Fizetendő összeg: ${this.discountedPrice} HUF`);
        const totalPrice2 = this.getTotalPrice();

        this.ProductObject = []; // Kiürítjük a kosarat
        this.products = []; // Frissítjük a termékek tömbjét
        this.discount = 0;
        console.log(this.discountedPrice);
        this.discountedPrice = 0;
  }
 

  
}
