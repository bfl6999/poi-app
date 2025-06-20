import { Component, inject, OnInit } from '@angular/core';   // ← usa “inject”
import { Auth, onAuthStateChanged, getIdToken, User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PoiService } from 'src/app/services/poi.service';

@Component({
  selector: 'app-user-pois',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './user-pois.page.html',
  styleUrls: ['./user-pois.page.scss'],
})
export class UserPoisPage implements OnInit {

  pois: any[] = [];
  user: User | null = null;

  private auth = inject(Auth);
  private poiService = inject(PoiService);

  ngOnInit() {
    onAuthStateChanged(this.auth, async user => {
      if (!user) return;

      const token = await getIdToken(user);
      this.poiService.getUserPOIs(user.uid, token).subscribe({
        next: pois => (this.pois = pois),
        error: err  => console.error('Error cargando mis POIs', err),
      });
    });
  }
}