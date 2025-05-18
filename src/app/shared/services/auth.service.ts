import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  signOut,
  authState,
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import { 
  Firestore, 
  collection, 
  doc, 
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { privateDecrypt } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<FirebaseUser | null>;
  
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
    
  ) {
    this.currentUser = authState(this.auth);
  }
  isAdmin(): boolean {
    const user = this.auth.currentUser;
    console.log('Current user:', user);
    return user?.email === 'admin@gmail.com';
  }
  
  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  signOut(): Promise<void> {
    localStorage.setItem('isLoggedIn', 'false');
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    });
  }
  
  async signUp(email: string, password: string, userData: Partial<User>): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        email, 
        password
      );
      
      await this.createUserData(userCredential.user.uid, {
        ...userData,
        id: userCredential.user.uid,
        email: email,
        products: [],
        events: []
      });

      return userCredential;
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      throw error;
    }
  }

  private async createUserData(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(collection(this.firestore, 'users'), userId);
    
    return setDoc(userRef, userData);
  }
  
  isLoggedIn(): Observable<FirebaseUser | null> {
    return this.currentUser;
  }
  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }

  getCurrentUserId(): string | null {
  return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }



  async getUserData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userDocRef = doc(this.firestore, 'Users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            resolve(userDocSnap.data());
          } else {
            console.error("No such user document!");
            resolve(null);
          }
        } else {
          // Don't log error, just resolve null
          resolve(null);
        }
      }, reject);
    });
  }
  onAuthStateChanged(callback: (user: any) => void): void {
    this.auth.onAuthStateChanged(callback);
  }

  async updateUserData(updatedData: Partial<User>): Promise<void> {
    const user = this.auth.currentUser;
    if(user) {
      const userDocRef = doc(this.firestore, 'Users', user.uid);
      await updateDoc(userDocRef, updatedData);
      console.log("User data updated successfully");
    } else {
      console.error("No user is currently signed in.");
      throw new Error("No user is currently signed in.");
    }
  }
  async deleteUser(userid:string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(this.firestore, `users/${userid}`);
        await this.auth.currentUser?.delete();
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          throw new Error(`User with ID ${userid} does not exist.`);
        }
        await deleteDoc(userDocRef);
        console.log("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    } else {
      console.error("No user is currently signed in.");
      throw new Error("No user is currently signed in.");
    }
  }
  getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userDocRef = doc(this.firestore, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              resolve({ id: user.uid, ...userDocSnap.data() });
            } else {
              reject('User document does not exist');
            }
          } catch (error: unknown) {
            reject(error);
          }
        } else {
          reject('No user signed in');
        }
      });
    });
  }
}