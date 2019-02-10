import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PontosPage } from './pontos.page';

describe('PontosPage', () => {
  let component: PontosPage;
  let fixture: ComponentFixture<PontosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PontosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PontosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
