import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, User, user, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private user$ = new BehaviorSubject<User | null>(null);
  constructor() {
    user(this.auth).subscribe((firebaseUser) => {
      this.user$.next(firebaseUser);
    });
  }
  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email,
      password);
    this.user$.next(userCredential.user);
    return userCredential;
  }
  async register(name: string, email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    // Aquí se actualiza el perfil con el nombre introducido
    await updateProfile(user, {
      displayName: name
    });

    this.user$.next(user);
    return user;
  }

  async logout() {
    await this.auth.signOut();
    this.user$.next(null);
  }
  async getCurrentUser(): Promise<User | null> {
    return firstValueFrom(this.user$);
  }
}