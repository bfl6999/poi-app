import { TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterPage', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let toastSpy: jasmine.SpyObj<ToastController>;
  let loadingSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(waitForAsync(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['register']);
    toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    loadingSpy = jasmine.createSpyObj('LoadingController', ['create']);

    TestBed.configureTestingModule({
      imports: [RegisterPage, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
        { provide: ToastController, useValue: toastSpy },
        { provide: LoadingController, useValue: loadingSpy }
      ]
    }).compileComponents();
  }));

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(RegisterPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});