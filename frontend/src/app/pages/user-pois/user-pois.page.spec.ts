import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPoisPage } from './user-pois.page';

describe('UserPoisPage', () => {
  let component: UserPoisPage;
  let fixture: ComponentFixture<UserPoisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPoisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
