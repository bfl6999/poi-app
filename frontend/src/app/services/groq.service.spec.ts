import { TestBed } from '@angular/core/testing';
import { GroqService } from './groq.service';
import { HttpClient } from '@angular/common/http';

describe('GroqService', () => {
  let service: GroqService;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        GroqService
      ]
    });

    service = TestBed.inject(GroqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});