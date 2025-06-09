import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FoursquareService } from 'src/app/services/foursquare.service';
import { PoiService } from 'src/app/services/poi.service';
import { Auth, User, onAuthStateChanged, getIdToken } from '@angular/fire/auth';

@Component({
  selector: 'app-search-poi',
  templateUrl: './search-poi.page.html',
  styleUrls: ['./search-poi.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SearchPoiPage implements OnInit {
  query = '';
  city = '';
  results: any[] = [];
  user: User | null = null;

  constructor(
    private fsService: FoursquareService,
    private poiService: PoiService,
    private auth: Auth
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      this.user = user;
    });
  }

  async search() {
    if (!this.query || !this.city) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (!this.user) {
      alert('Usuario no autenticado.');
      return;
    }

    try {
      const token = await getIdToken(this.user);

      this.fsService.search(this.query, this.city, token).subscribe({
        next: res => this.results = res,
        error: err => {
          console.error('Error buscando en Foursquare', err);
          alert('Error al buscar en Foursquare.');
        }
      });
    } catch (error) {
      console.error('Error obteniendo token:', error);
      alert('Error al autenticar usuario.');
    }
  }

  async addPOIFromFS(poi: any) {
    if (!this.user) return;

    try {
      const token = await getIdToken(this.user);

      const newPoi = {
        name: poi.name,
        location: poi.location?.address || this.city,
        latitude: poi.geocodes?.main?.latitude,
        longitude: poi.geocodes?.main?.longitude,
        dateAdded: new Date().toISOString()
      };

      this.poiService.addPOI(newPoi, token).subscribe({
        next: () => alert('POI insertado desde Foursquare'),
        error: err => {
          console.error('Error insertando POI', err);
          alert('Error al insertar el POI.');
        }
      });
    } catch (error) {
      console.error('Error obteniendo token para insertar POI:', error);
    }
  }
}