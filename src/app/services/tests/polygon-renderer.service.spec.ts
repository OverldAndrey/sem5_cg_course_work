import { TestBed } from '@angular/core/testing';

import { PolygonRendererService } from '../renderer/polygon-renderer.service';

describe('PolygonRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolygonRendererService = TestBed.get(PolygonRendererService);
    expect(service).toBeTruthy();
  });
});
