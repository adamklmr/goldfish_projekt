import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '../../shared/models/User'; // Importáljuk a ProfileObject-et
import { Product } from '../../shared/models/Product';
import { Subscription } from 'rxjs';
import { Event } from '../../shared/models/Event';
import { UserService } from '../../shared/services/user.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
  
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit,OnDestroy {
  user: User | null = null;
  products: Product[] = [];
  events: Event[] = [];
  stats = {
    products: 0,
    events: 0,
  };
  isLoading = true;
  
  private subscription: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.subscription = this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.products = data.products;
        this.events = data.events;
        this.stats = data.stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Hiba a felhasználói profil betöltésekor:', error);
        this.isLoading = false;
      }
    });
  }

  getUserInitials(): string {
    if (!this.user || !this.user.name) return '?';
    
    const firstInitial = this.user.name.firstname ? this.user.name.firstname.charAt(0).toUpperCase() : '';
    const lastInitial = this.user.name.lastname ? this.user.name.lastname.charAt(0).toUpperCase() : '';
    
    return firstInitial + (lastInitial ? lastInitial : '');
  }
}