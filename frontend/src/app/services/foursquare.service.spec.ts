import { TestBed } from '@angular/core/testing';
import { FoursquareService } from './foursquare.service';
import { HttpClient } from '@angular/common/http';

describe('FoursquareService', () => {
  let service: FoursquareService;

  const httpClientMock = {
    get: jasmine.createSpy('get'),
    post: jasmine.createSpy('post'),
    put: jasmine.createSpy('put'),
    delete: jasmine.createSpy('delete')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FoursquareService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });
    service = TestBed.inject(FoursquareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});