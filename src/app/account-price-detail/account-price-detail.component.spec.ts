import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPriceDetailComponent } from './account-price-detail.component';

describe('AccountPriceDetailComponent', () => {
  let component: AccountPriceDetailComponent;
  let fixture: ComponentFixture<AccountPriceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPriceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPriceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
