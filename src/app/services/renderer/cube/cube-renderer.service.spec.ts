import { TestBed } from '@angular/core/testing';

import { CubeRendererService } from './cube-renderer.service';

describe('CubeRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CubeRendererService = TestBed.get(CubeRendererService);
    expect(service).toBeTruthy();
  });
});
