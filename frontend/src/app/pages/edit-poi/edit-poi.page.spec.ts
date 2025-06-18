import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EditPoiPage } from './edit-poi.page';
import { Auth } from '@angular/fire/auth';
import { PoiService } from 'src/app/services/poi.service';
import { FormBuilder } from '@angular/forms';

describe('EditPoiPage', () => {
  const mockPoiService = {
    getPOI: jasmine.createSpy('getPOI').and.returnValue({ subscribe: () => {} }),
    updatePOI: jasmine.createSpy('updatePOI').and.returnValue({ subscribe: () => {} }),
    deletePOI: jasmine.createSpy('deletePOI').and.returnValue({ subscribe: () => {} })
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EditPoiPage],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: {} },
        { provide: PoiService, useValue: mockPoiService },
        FormBuilder
      ]
    }).compileComponents();
  }));

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(EditPoiPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});