import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PontoPage } from './ponto.page';

describe('PontoPage', () => {
  let component: PontoPage;
  let fixture: ComponentFixture<PontoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PontoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PontoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
