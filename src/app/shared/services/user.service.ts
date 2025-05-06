import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  getUserProfile(): Observable<{
    user: User | null,
    products: Product[],
    events: Event[],
    stats: {
      products: number,
      events: number,
    }
  }> {
    return this.authService.currentUser.pipe(
      switchMap(authUser => {
        if (!authUser) {
          return of({
            user: null,
            products: [],
            events: [],
            stats: { 
              products: 0,
              events: 0
            }
          });
        }

        return from(this.fetchUserWithTasks(authUser.uid));
      })
    );
  }
  private async fetchUserWithTasks(userId: string): Promise<{
    user: User | null,
    products: Product[],
    events: Event[],
    stats: {
      products: number,
      events: number,
    }
  }> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      return {
        user: null,
        products: [],
        events: [],
        stats: {
          products: 0,
          events: 0,
        }
      };
    }

    const user = userSnapshot.data() as User;

    const productsQuery = query(
      collection(this.firestore, `users/${userId}/products`)
    );
    const productsSnapshot = await getDocs(productsQuery);
    const products = productsSnapshot.docs.map(doc => doc.data() as Product);

    const eventsQuery = query(
      collection(this.firestore, `users/${userId}/events`)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map(doc => doc.data() as Event);

    return {
      user,
      products,
      events,
      stats: {
        products: products.length,
        events: events.length,
      }
    };
  }

}