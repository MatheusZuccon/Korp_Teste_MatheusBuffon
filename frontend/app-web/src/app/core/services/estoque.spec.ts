import { TestBed } from '@angular/core/testing';

import { Estoque } from './estoque';

describe('Estoque', () => {
  let service: Estoque;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Estoque);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
