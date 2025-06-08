import { Component, OnInit } from '@angular/core';
import { PoiService } from 'src/app/services/poi.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Poi } from 'src/app/models/poi.model';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-add-poi',
  templateUrl: './add-poi.page.html',
  styleUrls: ['./add-poi.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
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
    onAuthStateChanged(this.auth, user => (this.user = user));

    this.poiForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      imageUrl: [''],
    });
  }

  submit() {
    if (this.poiForm.invalid || !this.user) return;

    const poi: Poi = {
      ...this.poiForm.value,
      insertedBy: this.user.uid,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        poi.coordinates!.lat = pos.coords.latitude; // Modificado por el tipo de respuesta de Fe... y el modelo del back
        poi.coordinates!.lng = pos.coords.longitude;

        this.poiService.addPOI(poi).subscribe({
          next: () => {
            this.poiForm.reset();
            alert('POI añadido con éxito');
          },
          error: (err) => console.error('Error al guardar POI', err),
        });
      },
      (err) => {
        console.error('Geolocalización no disponible', err);
      }
    );
  }
}