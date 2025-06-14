import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, onAuthStateChanged, User, getIdToken } from '@angular/fire/auth';
import { PoiService } from 'src/app/services/poi.service';
import { Poi } from 'src/app/models/poi.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-poi',
  templateUrl: './add-poi.page.html',
  styleUrls: ['./add-poi.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddPoiPage implements OnInit {
  poiForm!: FormGroup;
  user: User | null = null;
  imagePreview?: SafeResourceUrl;

  private sanitizer = inject(DomSanitizer);

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
      imageUrl: [''],
      lat: ['', Validators.required],
      lng: ['', Validators.required]
    });

    navigator.geolocation.getCurrentPosition(pos => {
      this.poiForm.patchValue({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (image.webPath) {
        this.imagePreview = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
        this.poiForm.patchValue({ imageUrl: image.webPath });
      }
    } catch (error) {
      console.error('Error al capturar la foto:', error);
    }
  }

  async submit() {
    if (this.poiForm.invalid || !this.user) return;

    const lat = parseFloat(this.poiForm.value.lat);
    const lng = parseFloat(this.poiForm.value.lng);

    try {
      const token = await getIdToken(this.user!);

      const poi: Poi = {
        name: this.poiForm.value.name,
        location: this.poiForm.value.location,
        description: this.poiForm.value.description,
        imageUrl: this.poiForm.value.imageUrl,
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
          this.imagePreview = undefined;
          alert('POI añadido con éxito');
        },
        error: err => {
          console.error('Error al guardar el POI:', err);
        }
      });
    } catch (err) {
      console.error('Error al obtener el token:', err);
    }
  }
}