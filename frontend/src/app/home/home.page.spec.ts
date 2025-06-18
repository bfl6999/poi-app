import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HomePage } from './home.page';
import { PoiService } from 'src/app/services/poi.service';
import { Auth } from '@angular/fire/auth';

describe('HomePage', () => {
  let poiServiceSpy: jasmine.SpyObj<PoiService>;
  let authSpy: any;

  beforeEach(waitForAsync(() => {
    poiServiceSpy = jasmine.createSpyObj('PoiService', ['']);
    authSpy = {
      currentUser: {},
      onAuthStateChanged: jasmine.createSpy('onAuthStateChanged').and.returnValue(() => {})
    };

    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: PoiService, useValue: poiServiceSpy },
        { provide: Auth, useValue: authSpy }
      ]
    }).compileComponents();
  }));

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(HomePage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});