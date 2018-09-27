import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineModalComponent } from './line-modal.component';

describe('LineModalComponent', () => {
  let component: LineModalComponent;
  let fixture: ComponentFixture<LineModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
