import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBarModule,MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    MatIcon,
    MatSnackBarModule

    
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  userId: any = null; // Az aktuális felhasználó azonosítója
  oldPass: string = '';
  newPass: string = '';
  jelszoFrissites = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar // Assuming you have an AuthService to get the current user ID
  ) {
    this.userForm = this.fb.group({
      name: this.fb.group({
        lastname: ['', Validators.required], // Nested under 'name'
        firstname: ['', Validators.required],
      }),
    });
  }

  async ngOnInit(): Promise<void> {
    this.userId = this.authService.getCurrentUserId();
    if (!this.userId) {
      console.error('User ID is missing');
      return;
    }
  
    try {
      const user = await this.userService.getUserById(this.userId);
      if (user) {
        this.userForm.patchValue(user);
      } else {
        console.warn('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }


  async saveUser(): Promise<void> {
    if (this.userForm.valid) {
      await this.userService.updateUser(this.userId, this.userForm.value);
      this.showNotification('Felhasználónév sikeresen módosítva!', 'success');
    }
  }
  private showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`]
    });
  }
}