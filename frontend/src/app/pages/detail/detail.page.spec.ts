import { TestBed, waitForAsync } from '@angular/core/testing';
import { DetailPage } from './detail.page';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { PoiService } from 'src/app/services/poi.service';

describe('DetailPage', () => {
  let poiServiceSpy: jasmine.SpyObj<PoiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let authStub: any;
  let activatedRouteStub: any;

  beforeEach(waitForAsync(() => {
    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success: any) =>
          success({ coords: { latitude: 0, longitude: 0 } }),
      },
      writable: true,
    });

    poiServiceSpy = jasmine.createSpyObj('PoiService', ['getPOI', 'addComment', 'deletePOI', 'deleteComment']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateRoot']);
    
    authStub = {
      onAuthStateChanged: (callback: any) => callback({ uid: 'user123', displayName: 'Test User' }),
      currentUser: { uid: 'user123', displayName: 'Test User' },
    };


    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => '123'
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [DetailPage, IonicModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: PoiService, useValue: poiServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: Auth, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        FormBuilder
      ]
    }).compileComponents();
  }));

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(DetailPage);
    const component = fixture.componentInstance;
    spyOn(component as any, 'loadPOI').and.stub();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});