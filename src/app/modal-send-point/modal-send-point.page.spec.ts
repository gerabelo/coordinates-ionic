import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendPointPage } from './modal-send-point.page';

describe('ModalSendPointPage', () => {
  let component: ModalSendPointPage;
  let fixture: ComponentFixture<ModalSendPointPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSendPointPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSendPointPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
