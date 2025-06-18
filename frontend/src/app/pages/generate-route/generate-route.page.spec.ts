import { TestBed, waitForAsync } from '@angular/core/testing';
import { GenerateRoutePage } from './generate-route.page';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { Auth } from '@angular/fire/auth';

describe('GenerateRoutePage', () => {
  let authStub: any;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;

  beforeEach(waitForAsync(() => {
    authStub = {
      onAuthStateChanged: (callback: any) => callback({ uid: 'user123', displayName: 'Test User' }),
      currentUser: { uid: 'user123', displayName: 'Test User' },
    };


    alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);

    TestBed.configureTestingModule({
      imports: [GenerateRoutePage],
      providers: [
        provideHttpClientTesting(),
        importProvidersFrom(HttpClientModule),
        { provide: Auth, useValue: authStub },
        { provide: AlertController, useValue: alertCtrlSpy },
        FormBuilder
      ]
    }).compileComponents();
  }));

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(GenerateRoutePage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});