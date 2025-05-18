import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc, where,QuerySnapshot,arrayUnion,arrayRemove } from '@angular/fire/firestore';
import { Observable, from, switchMap, map, of, take, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/User';
import { Event } from '../models/Event';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly EVENT_COLLECTION = 'events';
  private readonly USER_COLLECTION = 'users';


  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  private formatDateToString(date: Date | string): string {
    if (typeof date === 'string') {
      const DateObj = new Date(date);
      if (!isNaN(DateObj.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.includes('T') ? date.split('T')[0] : date;
    }
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }

  //CREATE
  async addEvent(event: Omit<Event, 'id'>): Promise<Event> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const eventsCollection = collection(this.firestore, this.EVENT_COLLECTION);
      
      const eventToSave = {
        ...event,
        startDate: this.formatDateToString(event.startDate as string),
        endDate: this.formatDateToString(event.endDate as string),
        pic: 'assets/images/events/testevent.png' // Default image path
      };
      
      const docRef = await addDoc(eventsCollection, eventToSave);
      const eventId = docRef.id;
      
      await updateDoc(docRef, { id: eventId });
      
      const newEvent = {
        ...eventToSave,
        id: eventId
      } as Event;
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }
  //READ
  getAllEvents(): Observable<Event[]> {
    return from(getDocs(collection(this.firestore, this.EVENT_COLLECTION))).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
      })
    );
  }
  getEventById(eventId: string): Observable<Event | null> {
    const eventDocRef = doc(this.firestore, this.EVENT_COLLECTION, eventId);
    return from(getDoc(eventDocRef)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Event;
        } else {
          return null;
        }
      })
    );
  }

  getEventsByUserId(userId: string): Observable<Event[]> {
    const eventsCollection = collection(this.firestore, this.EVENT_COLLECTION);
    const q = query(eventsCollection, where('userid', '==', userId), orderBy('startDate'));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
      })
    );
  }
   //UPDATE
  async updateEvent(eventId: string, updatedEvent: Partial<Event>): Promise<void> {
    try {
      const eventDocRef = doc(this.firestore, this.EVENT_COLLECTION, eventId);
      await updateDoc(eventDocRef, updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  //DELETE
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const eventDocRef = doc(this.firestore, this.EVENT_COLLECTION, eventId);
      await deleteDoc(eventDocRef);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  
  getFilteredEvents(location: string): Observable<Event[]> {
    const eventsCollection = collection(this.firestore, 'events');
    const q = query(
      eventsCollection,
      where('startDate', '>=', new Date().toISOString()),
      where('location', '==', location)
    );

    return from(
      getDocs(q).then((querySnapshot: QuerySnapshot) =>
        querySnapshot.docs.map(doc => doc.data() as Event)
      )
    );
  }

  async addInterest(userId: string, eventId: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, this.USER_COLLECTION, userId);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        throw new Error(`User with ID ${userId} does not exist.`);
      }
  
      await updateDoc(userRef, {
        events: arrayUnion(eventId)
      });
      console.log(`Interest added for user ${userId} and event ${eventId}`);
    } catch (error) {
      console.error(`Error adding interest:`, error);
      throw error;
    }
    window.location.reload();
  }

async removeInterest(userId: string, eventId: string): Promise<void> {
  try {
    const userRef = doc(this.firestore, this.USER_COLLECTION, userId);
    await updateDoc(userRef, {
      events: arrayRemove(eventId)
    });
    console.log(`Interest removed for user ${userId} and event ${eventId}`);
  } catch (error) {
    console.error(`Error removing interest:`, error);
    throw error;
  }
  window.location.reload();
}

async isInterested(userId: string, eventId: string): Promise<boolean> {
  try {
    const userRef = doc(this.firestore, this.USER_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    return userData?.['events']?.includes(eventId) || false;
  } catch (error) {
    console.error(`Error checking interest:`, error);
    return false;
  }
}

  

}
