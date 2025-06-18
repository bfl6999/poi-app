import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  it('debe crearse correctamente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});