import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';

describe('AuthService', () => {
  let service: AuthService;

  const mockAuth: Partial<Auth> = {
    currentUser: null
    // Añadir más mocks si son necesarios
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});