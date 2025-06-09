import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth, onAuthStateChanged, User, getIdToken } from '@angular/fire/auth';
import { PoiService } from 'src/app/services/poi.service';
import { Poi } from 'src/app/models/poi.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-poi',
  templateUrl: './add-poi.page.html',
  styleUrls: ['./add-poi.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule]
})
export class AddPoiPage implements OnInit {
  poiForm!: FormGroup;
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private poiService: PoiService,
    private auth: Auth
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      this.user = user;
    });

    this.poiForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      imageUrl: ['']
    });
  }

  submit() {
    if (this.poiForm.invalid || !this.user) return;

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const token = await getIdToken(this.user!);

          const poi: Poi = {
            ...this.poiForm.value,
            insertedBy: this.user!.uid,
            coordinates: { lat, lng },
            geo: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            source: 'form',
            dateAdded: new Date().toISOString()
          };

          this.poiService.addPOI(poi, token).subscribe({
            next: () => {
              this.poiForm.reset();
              alert('POI añadido con éxito');
            },
            error: err => {
              console.error('Error al guardar el POI:', err);
              alert('Error al guardar el POI');
            }
          });
        } catch (error) {
          console.error('Error obteniendo token:', error);
        }
      },
      err => {
        console.error('No se pudo obtener geolocalización:', err);
      }
    );
  }
}