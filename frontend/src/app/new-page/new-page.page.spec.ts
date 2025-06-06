import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPagePage } from './new-page.page';

describe('NewPagePage', () => {
  let component: NewPagePage;
  let fixture: ComponentFixture<NewPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
