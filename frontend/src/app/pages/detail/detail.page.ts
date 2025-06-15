import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoiService } from 'src/app/services/poi.service';
import { Poi } from 'src/app/models/poi.model';
import { Auth, onAuthStateChanged, User, signOut, getIdToken } from '@angular/fire/auth';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule],
})
export class DetailPage implements OnInit {
  poi: Poi | null = null;
  poiId: string = '';
  commentForm!: FormGroup;
  user: User | null = null;
  canDeletePoi = false;

  private router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private poiService: PoiService,
    private fb: FormBuilder,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.commentForm = this.fb.group({
      username: [''],
      comment: ['', [Validators.required, Validators.maxLength(1000)]],
      stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
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
    console.log(this.poi?.comments); // Prueba error
    this.poiService.getPOI(this.poiId).subscribe({
      next: (data) => {
        this.poi = data;
        this.evaluateCanDelete();
      },
      
      error: (err) => console.error('Error cargando detalle', err),
    });
  }

  evaluateCanDelete() {
    if (!this.user || !this.poi || !this.poi.insertedBy) {
      this.canDeletePoi = false;
      return;
    }
    this.canDeletePoi = this.poi.insertedBy === this.user.uid;
  }

  get averageRating(): number {
    if (!this.poi?.comments || this.poi.comments.length === 0) return 0;
    const sum = this.poi.comments.reduce((acc, c) => acc + c.stars, 0);
    return sum / this.poi.comments.length;
  }

  submitComment() {
    if (this.commentForm.invalid || !this.user) return;

    navigator.geolocation.getCurrentPosition(pos => {
      const comment = {
        author: this.user?.displayName || this.commentForm.value.username?.trim() || 'Anónimo',
        userUid: this.user?.uid || null,
        comment: this.commentForm.value.comment,
        stars: this.commentForm.value.stars,
        location: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        },
        createdAt: new Date().toISOString()
      };

      this.poiService.addComment(this.poiId, comment).subscribe({
        next: () => {
          this.commentForm.reset({ comment: '', stars: 5 });
          this.loadPOI(); // recargar para reflejar el nuevo comentario
        },
        error: (err) => console.error('Error al comentar', err),
      });
    }, err => {
      alert('No se pudo obtener la ubicación');
    });
  }
  isAuthenticated(): boolean {
    return this.user !== null;
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/home']);
    });
  }

  async deletePoi() {
    if (!this.user || !this.poi?._id) return;

    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este POI?');
    if (!confirmDelete) return;

    try {
      const token = await getIdToken(this.user);
      this.poiService.deletePOI(this.poi._id, token).subscribe({
        next: () => {
          alert('POI eliminado correctamente');
          this.router.navigate(['/home']);
        },
        error: err => {
          console.error('Error al eliminar el POI:', err);
          alert('Error al eliminar el POI');
        }
      });
    } catch (error) {
      console.error('Error obteniendo token:', error);
      alert('Error de autenticación');
    }
  }

  async deleteComment(commentId: string) {
    if (!this.user || !this.poiId) return;

    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este comentario?');
    if (!confirmDelete) return;

    try {
      const token = await getIdToken(this.user);
      this.poiService.deleteComment(this.poiId, commentId, token).subscribe({
        next: () => {
          alert('Comentario eliminado');
          this.loadPOI();
        },
        error: err => {
          console.error('Error eliminando comentario:', err);
          alert('Error eliminando comentario');
        }
      });
    } catch (err) {
      console.error('Error autenticando usuario:', err);
    }
  }
}