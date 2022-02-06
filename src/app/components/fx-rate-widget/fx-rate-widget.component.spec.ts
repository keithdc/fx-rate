import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxRateWidgetComponent } from './fx-rate-widget.component';

describe('FxRateWidgetComponent', () => {
  let component: FxRateWidgetComponent;
  let fixture: ComponentFixture<FxRateWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxRateWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxRateWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
