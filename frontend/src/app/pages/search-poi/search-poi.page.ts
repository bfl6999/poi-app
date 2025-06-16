import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { FoursquareService } from 'src/app/services/foursquare.service';
import { PoiService } from 'src/app/services/poi.service';
import { Auth, User, onAuthStateChanged, getIdToken } from '@angular/fire/auth';
import { Poi } from 'src/app/models/poi.model';

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
  selectedPOIs: any[] = [];
  user: User | null = null;
  loading = false;

  constructor(
    private fsService: FoursquareService,
    private poiService: PoiService,
    private auth: Auth,
    private toastCtrl: ToastController
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
      this.loading = true;

      this.fsService.search(this.query, this.city, token).subscribe({
        next: res => this.results = res,
        error: err => {
          console.error('Error buscando en Foursquare', err);
          alert('Error al buscar en Foursquare.');
        },
        complete: () => this.loading = false
      });
    } catch (error) {
      console.error('Error obteniendo token:', error);
      alert('Error al autenticar usuario.');
    }
  }

  toggleSelection(poi: any) {
    const index = this.selectedPOIs.findIndex(p => p.fsq_id === poi.fsq_id);
    if (index >= 0) {
      this.selectedPOIs.splice(index, 1);
    } else {
      this.selectedPOIs.push(poi);
    }
  }

async saveSelectedPOIs() {
  if (!this.user || this.selectedPOIs.length === 0) return;

  try {
    const token = await getIdToken(this.user);

    const fsqIds = this.selectedPOIs.map(poi => poi.fsq_id);

    this.poiService.addMultiplePOIsFromFsqIds(fsqIds, token).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'POIs guardados correctamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.selectedPOIs = [];
      },
      error: err => {
        console.error('Error guardando POIs:', err);
        alert('Error al guardar los POIs.');
      }
    });
  } catch (error) {
    console.error('Error obteniendo token:', error);
  }
}

}