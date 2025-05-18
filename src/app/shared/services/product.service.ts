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
  async addProduct(product: Omit<Product, 'id' | 'pic'>): Promise<Product> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const productsCollection = collection(this.firestore, this.PRODUCT_COLLECTION);

      const productToSave = {
        ...product,
        instock: true,
        pic: 'assets/images/products/test.png' // Default image path
      };
      const docRef = await addDoc(productsCollection, productToSave);
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
  getAllProductsAdmin(): Observable<Product[]> {
    return from(getDocs(collection(this.firestore, this.PRODUCT_COLLECTION))).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
      })
    );
  }

  getAllProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, this.PRODUCT_COLLECTION);
    // Filter by inStock = true and order by price ascending
    const q = query(
      productsCollection,
      where('instock', '==', true),
      orderBy('price', 'asc'),
      orderBy('name', 'asc') // Secondary sort by name alphabetically
    );
    return from(getDocs(q)).pipe(
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
    const q = query(productsCollection, where('userId', '==', userId));
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
  async updateProduct(productId: string, updatedData: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(this.firestore, this.PRODUCT_COLLECTION, productId);
      await updateDoc(productRef, updatedData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
  toggleProductsInstock(productId: string, instock: boolean): Promise<void> {
    return this.updateProduct(productId, { instock});
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
  getEquipmentProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, this.PRODUCT_COLLECTION);
    const q = query(
      productsCollection,
      where('instock', '==', true),
      where('category', '==', 'Felszerelés'),
      orderBy('price', 'asc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
      })
    );
  }
  getClothsProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, this.PRODUCT_COLLECTION);
    const q = query(
      productsCollection,
      where('instock', '==', true),
      where('category', '==', 'Ruházat'),
      orderBy('price', 'asc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
      })
    );
  }
  getEveryProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, this.PRODUCT_COLLECTION);
    const q = query(
      productsCollection,
      where('instock', '==', true),
      where('category', 'in', ['Ruházat', 'Felszerelés']),
      orderBy('price', 'asc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
      })
    );
  }
}
