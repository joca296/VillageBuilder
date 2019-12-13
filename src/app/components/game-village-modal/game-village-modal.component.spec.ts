import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameVillageModalComponent } from './game-village-modal.component';

describe('GameVillageModalComponent', () => {
  let component: GameVillageModalComponent;
  let fixture: ComponentFixture<GameVillageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameVillageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameVillageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
