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
      comment: ['', Validators.required],
      stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    });

    this.poiId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUserAndPoi();
  }

  loadUserAndPoi() {
    onAuthStateChanged(this.auth, user => {
      this.user = user;

      this.poiService.getPOI(this.poiId).subscribe({
        next: (data) => {
          this.poi = data;
          this.evaluateCanDelete();
        },
        error: (err) => console.error('Error cargando detalle', err),
      });
    });
  }

  evaluateCanDelete() {
    if (!this.user || !this.poi) {
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
    if (this.commentForm.invalid) return;

    const author = this.user?.displayName || this.commentForm.value.username?.trim() || 'Anónimo';

    const comment = {
      author: author,
      comment: this.commentForm.value.comment,
      stars: this.commentForm.value.stars,
    };

    this.poiService.addComment(this.poiId, comment).subscribe({
      next: () => {
        this.commentForm.reset({ comment: '', stars: 5 });
        this.loadUserAndPoi();
      },
      error: (err) => console.error('Error al comentar', err),
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
}