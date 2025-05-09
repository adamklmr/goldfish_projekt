import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc, where } from '@angular/fire/firestore';
import { Observable, from, switchMap, map, of, take, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/User';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly PRODUCT_COLLECTION = 'products';
  private readonly USER_COLLECTION = 'users';

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  //CREATE
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const productsCollection = collection(this.firestore, this.PRODUCT_COLLECTION);

      const productToSave = {
        ...product,
      };
      const docRef = await addDoc(productsCollection, product);
      const productId = docRef.id;

      await updateDoc(docRef, { id: productId });

      const newProduct = {
        ...productToSave,
        id: productId
      } as Product;
    
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  //READ
  getAllProducts(): Observable<Product[]> {
    return from(getDocs(collection(this.firestore, this.PRODUCT_COLLECTION))).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
      })
    );
  }
  getProductById(productId: string): Observable<Product | null> {
    const productRef = doc(this.firestore, this.PRODUCT_COLLECTION, productId);
    return from(getDoc(productRef)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Product;
        } else {
          return null;
        }
      })
    );
  }
  getProductsByUserId(userId: string): Observable<Product[]> {
    const productsCollection = collection(this.firestore, this.PRODUCT_COLLECTION);
    const q = query(productsCollection, where('userId', '==', userId), orderBy('createdAt'));
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
      })
    );
  }

  //UPDATE
  async updateProduct(product: Product): Promise<void> {
    const productRef = doc(this.firestore, this.PRODUCT_COLLECTION, product.id);
    await updateDoc(productRef, { ...product });
  }

  //DELETE
  async deleteProduct(productId: string): Promise<void> {
    try {
    const productRef = doc(this.firestore, this.PRODUCT_COLLECTION, productId);
    await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
  getFilteredProductsByPrice(products: Product[], maxPrice: number): Product[] {
    if (maxPrice !== null && !isNaN(maxPrice)) {
      return products.filter(product => product.price <= maxPrice);
    } else {
      return products;
    }
  }
}
