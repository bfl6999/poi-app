import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, getIdToken, onAuthStateChanged, User } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-generate-route',
  templateUrl: './generate-route.page.html',
  styleUrls: ['./generate-route.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class GenerateRoutePage implements OnInit {
  form!: FormGroup;
  user: User | null = null;
  routeResult: { city: string; ruta: { hora: string; lugar: string; descripcion: string }[] } | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      city: ['', Validators.required]
    });

    onAuthStateChanged(this.auth, user => {
      this.user = user;
    });
  }

  async generate() {
    if (!this.form.valid || !this.user) return;

    this.loading = true;
    this.routeResult = null;
    this.errorMessage = '';

    try {
      const token = await getIdToken(this.user);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      const res: any = await firstValueFrom(
        this.http.post(
          'http://localhost:3000/api/pois/generate-route',
          { city: this.form.value.city },
          { headers }
        )
      );

      const rawPlan = res.routePlan;

      try {
        const parsed = typeof rawPlan === 'string' ? JSON.parse(rawPlan) : rawPlan;
        this.routeResult = parsed;
      } catch {
        this.routeResult = null;
        this.errorMessage = 'La respuesta del servidor no tiene un formato válido.';
        this.showErrorAlert(this.errorMessage);
      }
    } catch (err: any) {
      console.error('Error generando ruta', err);
      this.errorMessage =
        err?.error?.error || 'Ocurrió un error generando la ruta.';
      this.showErrorAlert(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  clearRoute() {
  this.form.reset();
  this.routeResult = null;
  this.errorMessage = '';
}
}