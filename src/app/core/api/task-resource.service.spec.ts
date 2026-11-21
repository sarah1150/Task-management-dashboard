/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TaskResourceService } from './task-resource.service';

describe('Service: TaskResource', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskResourceService]
    });
  });

  it('should ...', inject([TaskResourceService], (service: TaskResourceService) => {
    expect(service).toBeTruthy();
  }));
});
