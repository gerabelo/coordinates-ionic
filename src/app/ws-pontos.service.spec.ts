import { TestBed } from '@angular/core/testing';

import { WsPontosService } from './ws-pontos.service';

describe('WsPontosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsPontosService = TestBed.get(WsPontosService);
    expect(service).toBeTruthy();
  });
});
