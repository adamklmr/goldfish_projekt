import { Component, IterableDiffers, OnInit } from '@angular/core';
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
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../shared/services/auth.service';


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
  ProductsdisplayedColumns = ['pic', 'name', 'category','quantity','price','actions']; // Az oszlopok, amiket meg akarunk jeleníteni a táblázatban
  couponCode: string = '';
  totalPrice: number = 0; // Példa alapár
  discount: number = 0;
  discountedPrice: number = 0;
  cartItemsWithDetails: any[] = [];
  currentUser: any = null;

  constructor(private cartService: CartService,private authService: AuthService) {}
  async ngOnInit(): Promise<void> {
    try {
      // Fetch the current user ID
      this.currentUser = await this.authService.getCurrentUserId();
      console.log('Current user:', this.currentUser);
  
      // Load cart items after the current user is set
      await this.loadCartItems();
  
      // Calculate the total price
      this.totalPrice = this.getTotalPrice();
      this.discountedPrice = this.totalPrice; // Initially, discounted price is the same as total price
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }
  // async loadCurrentUser(): Promise<void> {
  //   try {
  //     this.currentUser = await this.authService.getCurrentUserId(); // Fetch the current user
  //     console.log('Current user:', this.currentUser);
  //   } catch (error) {
  //     console.error('Error fetching current user:', error);
  //   }
  // }

  async loadCartItems(): Promise<void> {
    if (!this.currentUser) {
      console.error('Current user is not set. Cannot load cart items.');
      return;
    }
  
    try {
      this.cartItemsWithDetails = await this.cartService.fetchCartWithProductDetails(this.currentUser);
      console.log('Loaded cart items:', this.cartItemsWithDetails);
  
      // Check for missing data in cart items
      this.cartItemsWithDetails.forEach(item => {
        if (!item.product_price || !item.product_name) {
          console.warn('Missing data for item:', item);
        }
      });
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  }

  removeFromCart(productId: string): void {
    // // Ellenőrizzük, hogy az index érvényes-e
    // if (index >= 0 && index < this.products.length) {
    //   this.ProductObject.splice(index,1); // Eltávolítjuk a terméket a tömbből 
    //   this.products = [...this.ProductObject]; // Frissítjük a termékek tömbjét
    //   console.log("Termék eltávolítva:", index); // Ellenőrzéshez
    //   this.ngOnInit() // Frissítjük a teljes árat
    //   this.getTotalPrice(); // Frissítjük a teljes árat
    //   alert("Termék eltávolítva a kosárból");
    // } else {
    //   console.error("Érvénytelen index:", index);
    // }
    this.cartService.removeFromCart(productId,this.currentUser);
    this.loadCartItems();
  }

  getTotalPrice(): number {
    this.totalPrice = 0; // Reset totalPrice to 0 before calculation
    this.cartItemsWithDetails.forEach(item => {
      if(item.user_id == this.currentUser)
      this.totalPrice += item.price * item.quantity;
    });
    return this.totalPrice || 0;
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
  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1 || quantity > 10) {
      alert('Quantity must be between 1 and 10.');
      return;
    }
  
    const cartItem = this.cartItemsWithDetails.find(item => item.product_id === productId);
    if (!cartItem) {
      console.error(`Cart item not found for product ID: ${productId}`);
      return;
    }
  
    // Log the existing item details
    console.log('Before update:', cartItem);
  
    this.cartService.updateCartItem(cartItem.id,cartItem.quantity)
      .then(() => {
        console.log('Quantity updated successfully');
        cartItem.quantity = quantity;
  
        // Ensure price is recalculated based on the updated quantity
        // if (cartItem.product_price) {
        //   cartItem.price = cartItem.product_price * cartItem.quantity;
        // } else {
        //   console.error('Product price is missing for item:', cartItem);
        // }
  
        // Log the updated item
        console.log('After update:', cartItem);
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
      });
  }
  
  
  checkout(): void {
    // if (this.products.length === 0) {

    //       alert("A kosár üres, nem lehet fizetni.");
    //       return;
    //     }
    //     alert(`Fizetendő összeg: ${this.discountedPrice} HUF`);
    //     const totalPrice2 = this.getTotalPrice();

    //     this.ProductObject = []; // Kiürítjük a kosarat
    //     this.products = []; // Frissítjük a termékek tömbjét
    //     this.discount = 0;
    //     console.log(this.discountedPrice);
    //     this.discountedPrice = 0;
    this.cartService.checkout(this.currentUser);
    alert('A termékek megrendelve!');
  }  
}
