import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PoiService } from 'src/app/services/poi.service';
import { RouterModule } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
//import { HttpClientModule } from '@angular/common/http';
//import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, HttpClient],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  private poiService = inject(PoiService);
  private auth = inject(Auth);

  pois: any[] = [];
  user: User | null = null;

  async ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      this.user = user;
    });

    this.poiService.getAllPOIs().subscribe({
      next: (data: any) => this.pois = data,
      error: err => console.error('Error cargando POIs', err)
    });
  }

  goToDetail(id: string) {
    location.href = `/detail/${id}`;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }
}