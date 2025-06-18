import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoginPage } from './login.page';

import type { UserCredential } from '@angular/fire/auth';

describe('LoginPage', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let toastSpy: jasmine.SpyObj<ToastController>;
  let loadingSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(waitForAsync(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    loadingSpy = jasmine.createSpyObj('LoadingController', ['create']);

    TestBed.configureTestingModule({
      imports: [LoginPage],
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
    const fixture = TestBed.createComponent(LoginPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
  it('debe llamar a login con los valores del formulario', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    const component = fixture.componentInstance;
    // mocks para loading y toast
    loadingSpy.create.and.resolveTo({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve()
    } as any);

    toastSpy.create.and.resolveTo({
      present: () => Promise.resolve()
    } as any);

    // simular credenciales
    const fakeCred = { user: {} } as UserCredential;
    authSpy.login.and.returnValue(Promise.resolve(fakeCred));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123456'
    });

    await component.login();

    expect(authSpy.login).toHaveBeenCalledWith('test@example.com', '123456');
  });
});
