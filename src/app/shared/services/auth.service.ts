import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
  UserCredential
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<User | null>;
  
  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.currentUser = authState(this.auth);
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
  
  isLoggedIn(): Observable<User | null> {
    return this.currentUser;
  }
  
  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }

  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // async checkAdminStatus(): Promise<boolean> {
  //   const user: User | null = this.auth.currentUser;
  //   if (user) {
  //     await user.getIdToken(true); // Force refresh the token
  //     const idTokenResult = await getIdTokenResult(user);

  //     console.log('checkAdminStatus: role =', idTokenResult.claims['role']);
  //     return idTokenResult.claims['role'] === 'admin'; // Assuming 'role' is stored in custom claims
  //   }
  //   return false;
  // }

  // isLoggedIn(): boolean {
  //   const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  //   console.log(localStorage.getItem('isLoggedIn')); // Should be 'true'
  //   return isBrowser ? localStorage.getItem('isLoggedIn') === 'true' : false;
  // }

  // isAdmin(): boolean {
  //   const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  //   console.log(localStorage.getItem('isAdmin')); // Should be 'true'
  //   return isBrowser ? localStorage.getItem('isAdmin') === 'true' : false;
  // }
}