import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoiService } from 'src/app/services/poi.service';
import { Poi } from 'src/app/models/poi.model';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})
export class DetailPage implements OnInit {
  poi: Poi | null = null;
  poiId: string = '';
  commentForm!: FormGroup;
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private poiService: PoiService,
    private fb: FormBuilder,
    private auth: Auth
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, user => (this.user = user));
    this.poiId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPoi();

    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  loadPoi() {
    this.poiService.getPOI(this.poiId).subscribe({
      next: (data) => (this.poi = data),
      error: (err) => console.error('Error cargando detalle', err),
    });
  }

  get averageRating(): number {
    if (!this.poi?.comments || this.poi.comments.length === 0) return 0;
    const sum = this.poi.comments.reduce((acc, c) => acc + c.stars, 0);
    return sum / this.poi.comments.length;
  }

  submitComment() {
    if (this.commentForm.invalid || !this.user) return;

    const comment = {
      author: this.user.displayName || 'Anónimo',
      comment: this.commentForm.value.comment,
      stars: this.commentForm.value.stars,
    };

    this.poiService.addComment(this.poiId, comment).subscribe({
      next: () => {
        this.commentForm.reset({ comment: '', stars: 5 });
        this.loadPoi();
      },
      error: (err) => console.error('Error al comentar', err),
    });
  }
}