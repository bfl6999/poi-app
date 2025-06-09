import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPoiPage } from './search-poi.page';

describe('SearchPoiPage', () => {
  let component: SearchPoiPage;
  let fixture: ComponentFixture<SearchPoiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPoiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
