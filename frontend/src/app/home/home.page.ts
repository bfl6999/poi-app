import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonIcon } from '@ionic/angular';
import { PoiService } from 'src/app/services/poi.service';
import { Poi } from '../models/poi.model';
import { RouterModule, Router } from '@angular/router';
import { Auth, onAuthStateChanged, User, signOut } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, search, navigate, person } from 'ionicons/icons';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,  
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
  searchType: 'name' | 'location' | 'date' | '' = '';

  searchForm: FormGroup = this.fb.group({
    name: [''],
    location: [''],
    date: ['']
  });


  constructor() {
    addIcons({ add, search, navigate, person });
  }

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
    this.router.navigate(['/add-poi']);
  }
  goToSearchPoi() {
    this.router.navigate(['/search-poi']);
  }

  
  isAuthenticated(): boolean {
    return this.user !== null;
  }
  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/home']);
    });
  }
}