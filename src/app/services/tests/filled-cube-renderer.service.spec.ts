import { TestBed } from '@angular/core/testing';

import { TrianglePolygonModelRendererService } from '../renderer/trianglePoly/triangle-polygon-model-renderer.service';

describe('FilledCubeRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrianglePolygonModelRendererService = TestBed.get(TrianglePolygonModelRendererService);
    expect(service).toBeTruthy();
  });
});
