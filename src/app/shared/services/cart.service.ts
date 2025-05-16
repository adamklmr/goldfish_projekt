import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Firestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc,writeBatch } from '@angular/fire/firestore';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { deleteField, runTransaction } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Cart[] = [];
  private cartSubject = new BehaviorSubject<Cart[]>([]);

  constructor(private firestore: Firestore) {}

  getCartItems(): Observable<Cart[]> {
    return this.cartSubject.asObservable();
  }

  // async fetchCartWithProductDetails(): Promise<any[]> {
  //   const cartCollection = collection(this.firestore, 'cart');
  //   const cartSnapshot = await getDocs(cartCollection);
  //   const cartItems = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Cart[];
  
  //   // Collect product IDs from cart
  //   const productIds = cartItems.map(item => item.product_id).filter(id => id !== undefined && id !== null);
  
  //   // Query only the necessary products
  //   const productCollection = collection(this.firestore, 'products');
  //   const q = query(productCollection, where('id', 'in', productIds));
  //   const productSnapshot = await getDocs(q);
  //   const products = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
  
  //   // Join cart items with product details
  //   return cartItems.map(cartItem => {
  //     const product = products.find(p => p.id === cartItem.product_id);
  //     return {
  //       ...cartItem,
  //       ...product // Merge product details into the cart item
  //     };
  //   });
  // }
  async fetchCartWithProductDetails(userId: string): Promise<any[]> {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    // Fetch cart items for the specific user
    const cartCollection = collection(this.firestore, 'cart');
    const cartQuery = query(cartCollection, where('user_id', '==', userId));
    const cartSnapshot = await getDocs(cartQuery);
    const cartItems = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Cart[];

    if (cartItems.length === 0) {
      console.warn('No cart items found for the user.');
      return [];
    }

    // Collect product IDs from the user's cart
    const productIds = cartItems.map(item => item.product_id).filter(id => id !== undefined && id !== null);

    if (productIds.length === 0) {
      console.warn('No product IDs found in the cart.');
      return [];
    }

    // Query products in batches of 10 (Firestore's limit for 'in' queries)
    const productCollection = collection(this.firestore, 'products');
    const products: Product[] = [];
    const batchSize = 10;

    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);
      const productQuery = query(productCollection, where('id', 'in', batch));
      const productSnapshot = await getDocs(productQuery);
      products.push(...productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
    }

    // Join cart items with product details
    return cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.product_id);
      if (!product) {
        console.warn(`Product not found for cart item: ${cartItem.product_id}`);
        return null;
      }
      return {
        ...cartItem,
        ...product // Merge product details into the cart item
      };
    }).filter(item => item !== null); // Remove null entries
  }
  
  async addToCart(productId: string, userId: string, quantity: number = 1): Promise<void> {
    if (!userId || !productId) {
      throw new Error('Invalid userId or productId. Both must be defined.');
    }
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0.');
    }
  
    const cartCollection = collection(this.firestore, 'cart');
  
    await runTransaction(this.firestore, async (transaction) => {
      const q = query(cartCollection, where('user_id', '==', userId), where('product_id', '==', productId));
      const cartSnapshot = await getDocs(q);
  
      if (!cartSnapshot.empty) {
        // Update existing item
        const cartDocRef = cartSnapshot.docs[0].ref;
        const cartData = cartSnapshot.docs[0].data() as Cart;
        const updatedQuantity = cartData.quantity + quantity;
        transaction.update(cartDocRef, { quantity: updatedQuantity });
      } else {
        // Generate a new document reference with a unique ID
        const newDocRef = doc(cartCollection);
        const newDocId = newDocRef.id; // Retrieve the automatically generated ID
  
        // Add new item with the ID stored as a field
        const newCartItem: Cart = {
          id: newDocId, // Store the generated ID as a field
          user_id: userId,
          product_id: productId,
          quantity: quantity
        };
        transaction.set(newDocRef, newCartItem);
      }
    });
  
    console.log('Item successfully added to cart.');
  }
  
  

  async checkout(userId: string): Promise<void> {
    try {
      const cartCollection = collection(this.firestore, 'cart');
      const q = query(cartCollection, where('user_id', '==', userId));
      const cartSnapshot = await getDocs(q);
  
      if (cartSnapshot.empty) {
        console.warn(`No cart items found for user_id ${userId}`);
        return;
      }
  
      const batch = writeBatch(this.firestore);
  
      // Törli az összes kosár elemet a felhasználóhoz
      cartSnapshot.docs.forEach(doc => batch.delete(doc.ref));
  
      // Batch végrehajtása
      await batch.commit();
      console.log(`All cart items for user_id ${userId} have been purchased.`);
  
      // Helyi cache frissítése, ha van ilyen
      if (this.cartItems) {
        this.cartItems = this.cartItems.filter(item => item.user_id !== userId);
        this.cartSubject.next([...this.cartItems]);
      }
  
    } catch (error) {
      console.error(`Error during checkout for user_id ${userId}:`, error);
    }
  }
  


  getCurrentUserCart(userId: string): Observable<Cart[]> {
    return this.getCartItems().pipe(
      map(cartItems => cartItems.filter(item => item.user_id === userId))
    );
  }
  
  async removeFromCart(productId: string, userId: string): Promise<void> {
    try {
      const cartCollection = collection(this.firestore, 'cart');
      const q = query(cartCollection, where('product_id', '==', productId), where('user_id', '==', userId));
      const cartSnapshot = await getDocs(q);
  
      if (!cartSnapshot.empty) {
        const cartDocRef = cartSnapshot.docs[0].ref;
        console.log(`Deleting cart document for product_id ${productId} and user_id ${userId}`);
        
        // Dokumentum teljes törlése
        await deleteDoc(cartDocRef);
  
        // Frissítsd a helyi cache-t
        this.cartItems = this.cartItems.filter(item => item.product_id !== productId || item.user_id !== userId);
        this.cartSubject.next([...this.cartItems]);
      } else {
        console.warn(`No cart item found for product_id ${productId} and user_id ${userId}`);
      }
    } catch (error) {
      console.error(`Error removing cart item with product_id ${productId} and user_id ${userId}:`, error);
    }
  }

  async updateCartItem(productId: string, newQuantity: number): Promise<void> {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be greater than 0.');
    }
  
    const cartCollection = collection(this.firestore, 'cart');
    const q = query(cartCollection, where('product_id', '==', productId));
    const cartSnapshot = await getDocs(q);
  
    if (!cartSnapshot.empty) {
      const cartDocRef = cartSnapshot.docs[0].ref;
      console.log(`Updating cart item with product_id ${productId} to new quantity:`, newQuantity);
      await updateDoc(cartDocRef, { quantity: newQuantity });
  
      // Update local cache
      const index = this.cartItems.findIndex(item => item.product_id === productId);
      if (index !== -1) {
        this.cartItems[index] = { ...this.cartItems[index], quantity: newQuantity };
        this.cartSubject.next([...this.cartItems]);
      }
    } else {
      throw new Error(`Cart item with product_id ${productId} does not exist.`);
    }
  }
}