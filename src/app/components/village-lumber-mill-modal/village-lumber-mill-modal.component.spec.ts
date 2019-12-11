import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VillageLumberMillModalComponent } from './village-lumber-mill-modal.component';

describe('VillageLumberMillModalComponent', () => {
  let component: VillageLumberMillModalComponent;
  let fixture: ComponentFixture<VillageLumberMillModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VillageLumberMillModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VillageLumberMillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
