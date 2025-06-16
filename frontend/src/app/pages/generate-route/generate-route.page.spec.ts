import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateRoutePage } from './generate-route.page';

describe('GenerateRoutePage', () => {
  let component: GenerateRoutePage;
  let fixture: ComponentFixture<GenerateRoutePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
