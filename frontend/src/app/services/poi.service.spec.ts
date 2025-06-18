import { TestBed } from '@angular/core/testing';
import { PoiService } from './poi.service';
import { HttpClient } from '@angular/common/http';

describe('PoiService', () => {
  let service: PoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PoiService,
        {
          provide: HttpClient,
          useValue: {
            get: () => ({}),
            post: () => ({}),
            put: () => ({}),
            delete: () => ({})
          }
        }
      ]
    });

    service = TestBed.inject(PoiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});