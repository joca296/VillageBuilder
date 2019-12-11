import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VillageBarracksModalComponent } from './village-barracks-modal.component';

describe('VillageBarracksModalComponent', () => {
  let component: VillageBarracksModalComponent;
  let fixture: ComponentFixture<VillageBarracksModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VillageBarracksModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VillageBarracksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
