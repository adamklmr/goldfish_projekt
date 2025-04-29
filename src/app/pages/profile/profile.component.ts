import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProfileObject } from '../../shared/models/User'; // Importáljuk a ProfileObject-et


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
export class ProfileComponent implements OnInit {
  ProfileObject = ProfileObject;
  
  selectedIndex: number = 0;

  ngOnInit(): void {
    if (localStorage.getItem('isAdmin') === 'true') {
      this.selectedIndex = 1;
    } else {
      this.selectedIndex = 0;
    }
  }
    reload(index: number): void {
      this.selectedIndex = index;
    }
}