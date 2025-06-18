import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchPoiPage } from './search-poi.page';
import { FoursquareService } from 'src/app/services/foursquare.service';
import { PoiService } from 'src/app/services/poi.service';
import { ToastController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';

describe('SearchPoiPage', () => {
  let fsServiceSpy: jasmine.SpyObj<FoursquareService>;
  let poiServiceSpy: jasmine.SpyObj<PoiService>;
  let toastSpy: jasmine.SpyObj<ToastController>;
  let authSpy: any;

  beforeEach(waitForAsync(() => {
    fsServiceSpy = jasmine.createSpyObj('FoursquareService', ['search']);
    poiServiceSpy = jasmine.createSpyObj('PoiService', ['']);
    toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    authSpy = {
      currentUser: {},
      onAuthStateChanged: jasmine.createSpy('onAuthStateChanged').and.callFake((cb: any) => cb({ uid: 'mockUser' })),
      getIdToken: jasmine.createSpy().and.returnValue(Promise.resolve('mock-token'))
    };

    TestBed.configureTestingModule({
      imports: [SearchPoiPage],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: FoursquareService, useValue: fsServiceSpy },
        { provide: PoiService, useValue: poiServiceSpy },
        { provide: ToastController, useValue: toastSpy },
        { provide: Auth, useValue: authSpy }
      ]
    }).compileComponents();
  }));

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(SearchPoiPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});