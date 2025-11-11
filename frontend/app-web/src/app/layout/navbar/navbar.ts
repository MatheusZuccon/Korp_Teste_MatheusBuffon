import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'], 
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterModule,      
    MatToolbarModule,
    MatButtonModule,
    MatIconModule     
  ]
})
export class NavbarComponent {}
