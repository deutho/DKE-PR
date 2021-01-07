import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendspageComponent } from './friendspage.component';

describe('FriendspageComponent', () => {
  let component: FriendspageComponent;
  let fixture: ComponentFixture<FriendspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
