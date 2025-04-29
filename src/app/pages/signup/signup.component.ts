import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../shared/models/User';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [Validators.required]),
    name: new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2)])
    })
  });
  
  isLoading = false;
  showForm = true;
  signupError = '';

  constructor(private router: Router, private authService: AuthService ) {}
//elso merfoldko
  // signup(): void {
  //   if (this.signUpForm.invalid) {
  //     this.signupError = 'Kérlek ellenőrizd a megadott adatokat!';
  //     return;
  //   }

  //   const password = this.signUpForm.get('password');
  //   const rePassword = this.signUpForm.get('rePassword');

  //   if (password?.value !== rePassword?.value) {
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.showForm = false;

  //   const newUser: User = {
  //     id: Math.random().toString(36).substring(2, 15),
  //     name: {
  //       firstname: this.signUpForm.value.name?.firstname || '',
  //       lastname: this.signUpForm.value.name?.lastname || ''
  //     },
  //     email: this.signUpForm.value.email || '',
  //     password: this.signUpForm.value.password || '',
  //     ordersNumber: 0,
  //     eventsNumber: 0,

  //   };
  //   localStorage.setItem('isLoggedIn', 'true');
  //     localStorage.setItem('isAdmin', 'false');
  //     window.location.href = '/home';
  //   console.log('New user:', newUser);
  //   console.log('Form value:', this.signUpForm.value);

  //   // setTimeout(() => {
  //   //   this.router.navigateByUrl('/home');
  //   // }, 2000);
  // }
  signup(): void {
    if (this.signUpForm.invalid) {
      this.signupError = 'Kérlek ellenőrizd a megadott adatokat!';
      return;
    }

    const password = this.signUpForm.get('password');
    const rePassword = this.signUpForm.get('rePassword');

    if (password?.value !== rePassword?.value) {
      this.signupError = 'A jelszavak nem egyeznek!';
      return;
    }

    this.isLoading = true;
    this.showForm = false;

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      name: {
        firstname: this.signUpForm.value.name?.firstname || '',
        lastname: this.signUpForm.value.name?.lastname || ''
      },
      email: this.signUpForm.value.email || '',
      password: this.signUpForm.value.password || '',
      ordersNumber: 0,
      eventsNumber: 0,
    };

    this.authService.signup(newUser.email, newUser.password).then(() => {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigateByUrl('/home');
    }).catch((err) => {
      if (err.code === 'auth/email-already-in-use') {
        this.signupError = 'Ez az email cím már használatban van!';
      } else {
        this.signupError = 'Hiba történt a regisztráció során!';
      }
      console.error(err);
      this.isLoading = false;
      this.showForm = true;
    });
}
}