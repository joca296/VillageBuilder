import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VillageNavComponent } from './village-nav.component';

describe('VillageNavComponent', () => {
  let component: VillageNavComponent;
  let fixture: ComponentFixture<VillageNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VillageNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VillageNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
