import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogOverviewComponent } from './log-overview.component';

describe('LogOverviewComponent', () => {
  let component: LogOverviewComponent;
  let fixture: ComponentFixture<LogOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
