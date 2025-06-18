import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UserPoisPage } from './user-pois.page';
import { PoiService } from 'src/app/services/poi.service';
import { Auth } from '@angular/fire/auth';

describe('UserPoisPage', () => {
  let poiServiceSpy: jasmine.SpyObj<PoiService>;

  beforeEach(waitForAsync(() => {
    poiServiceSpy = jasmine.createSpyObj('PoiService', ['getUserPOIs']);
    
    TestBed.configureTestingModule({
      imports: [UserPoisPage],
      providers: [
        provideRouter([]),
        { provide: PoiService, useValue: poiServiceSpy },
        { provide: Auth, useValue: {} }
      ]
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(UserPoisPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});