import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoiService } from 'src/app/services/poi.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Poi } from 'src/app/models/poi.model';
import { Auth, getIdToken, onAuthStateChanged, User } from '@angular/fire/auth';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-poi',
  templateUrl: './edit-poi.page.html',
  styleUrls: ['./edit-poi.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class EditPoiPage implements OnInit {
  poiForm!: FormGroup;
  poiId!: string;
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private poiService: PoiService,
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.poiForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      imageUrl: [''],
      lat: ['', Validators.required],
      lng: ['', Validators.required]
    });

    this.poiId = this.route.snapshot.paramMap.get('id') || '';

    onAuthStateChanged(this.auth, user => {
      this.user = user;
      if (this.poiId) {
        this.loadPOI();
      }
    });
  }

  loadPOI() {
    this.poiService.getPOI(this.poiId).subscribe({
      next: poi => {
        this.poiForm.patchValue({
          name: poi.name,
          location: poi.location,
          description: poi.description,
          imageUrl: poi.imageUrl,
          lat: poi.coordinates?.lat,
          lng: poi.coordinates?.lng
        });
      },
      error: err => console.error('Error al cargar el POI para editar', err)
    });
  }

  async updatePOI() {
    if (this.poiForm.invalid || !this.user) return;

    const lat = parseFloat(this.poiForm.value.lat);
    const lng = parseFloat(this.poiForm.value.lng);

    const updatedPoi: Poi = {
      name: this.poiForm.value.name,
      location: this.poiForm.value.location,
      description: this.poiForm.value.description,
      imageUrl: this.poiForm.value.imageUrl,
      coordinates: { lat, lng },
      geo: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    };

    try {
      const token = await getIdToken(this.user);
      this.poiService.updatePOI(this.poiId, updatedPoi, token).subscribe({
        next: () => {
          alert('POI actualizado con éxito');
          this.router.navigate(['/poi', this.poiId]);
        },
        error: err => {
          console.error('Error al actualizar POI:', err);
          alert('Error al actualizar el POI');
        }
      });
    } catch (error) {
      console.error('Error autenticando usuario:', error);
    }
  }
}