import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PoiService } from 'src/app/services/poi.service';
import { Poi } from '../models/poi.model';
import { RouterModule, Router } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  private poiService = inject(PoiService);
  private auth = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  pois: Poi[] = [];
  user: User | null = null;

  searchForm: FormGroup = this.fb.group({
    name: [''],
    location: [''],
    date: ['']
  });

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      this.user = user;
    });

    this.loadAllPois();
  }

  loadAllPois() {
    this.poiService.getAllPOIs().subscribe({
      next: data => this.pois = data,
      error: err => console.error('Error cargando POIs', err)
    });
  }
  onSearch() {
    const filters = this.searchForm.value;
    this.poiService.getAllPOIs(filters).subscribe({
      next: data => this.pois = data,
      error: err => console.error('Error en búsqueda', err)
    });
  }
  goToDetail(id: string | undefined) {
    if (!id) return;
    this.router.navigate(['/poi', id]);
  }
  goToAddPoi() {
    this.router.navigate(['/pages/add-poi']);
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }
}