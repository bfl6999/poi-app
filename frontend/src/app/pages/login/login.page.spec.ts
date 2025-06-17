import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginPage } from './login.page';               // componente stand-alone
import { Auth } from '@angular/fire/auth';

describe('LoginPage', () => {
  const authSpy = jasmine.createSpyObj('Auth', ['signInWithEmailAndPassword']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],                     // ¡stand-alone!
      providers: [
        provideRouter([]),                      // router fake
        provideHttpClientTesting(),             // HTTP fake
        { provide: Auth, useValue: authSpy }    // stub Firebase
      ]
    }).compileComponents();
  });

  it('debe crearse', () => {
    const fixture = TestBed.createComponent(LoginPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe llamar a Auth al hacer login', () => {
    const fixture = TestBed.createComponent(LoginPage);
    const page    = fixture.componentInstance;

    // Ajusta a tu FormGroup real
    (page as any).credentials.setValue({           // <- si tu form se llama distinto, cámbialo
      email: 'a@b.com',
      password: '123456'
    });
    page.login();                                  // método del componente

    expect(authSpy.signInWithEmailAndPassword)
      .toHaveBeenCalledWith(jasmine.anything(), 'a@b.com', '123456');
  });
});