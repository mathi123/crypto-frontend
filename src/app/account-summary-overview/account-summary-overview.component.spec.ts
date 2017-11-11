import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSummaryOverviewComponent } from './account-summary-overview.component';

describe('AccountSummaryOverviewComponent', () => {
  let component: AccountSummaryOverviewComponent;
  let fixture: ComponentFixture<AccountSummaryOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSummaryOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSummaryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
