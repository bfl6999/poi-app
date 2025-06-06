import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, User, user, createUserWithEmailAndPassword  } from '@angular/fire/auth';
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
  async register(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  }
  async logout() {
    await this.auth.signOut();
    this.user$.next(null);
  }
  async getCurrentUser(): Promise<User | null> {
    return firstValueFrom(this.user$);
  }
}