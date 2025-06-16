import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PoiService } from 'src/app/services/poi.service';
import { Auth, onAuthStateChanged, User, getIdToken } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-pois',
  templateUrl: './user-pois.page.html',
  styleUrls: ['./user-pois.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class UserPoisPage implements OnInit {

  pois: any[] = [];
  user: User | null = null;

  constructor(private poiService: PoiService, private auth: Auth) {}

ngOnInit() {
  onAuthStateChanged(this.auth, async user => {
    this.user = user;
    if (user) {
      const token = await getIdToken(user);

      this.poiService.getUserPOIs(user.uid, token).subscribe({
        next: pois => {
          console.log('[DEBUG] Respuesta recibida:', pois);
          this.pois = pois;
        },
        error: err => console.error('Error cargando mis POIs', err)
      });
    }
  });
  }

}
