import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPoiPage } from './edit-poi.page';

describe('EditPoiPage', () => {
  let component: EditPoiPage;
  let fixture: ComponentFixture<EditPoiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPoiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
