/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { FormValidatorService } from './form-validator.service';

describe('FormValidatorService', () => {
  let service: FormValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidatorService);
  });

  describe('nonBlank', () => {
    it('should return null for a valid text value', () => {
      const control = new FormControl('Task title');

      expect(service.nonBlank(control)).toBeNull();
    });

    it('should return blank error for an empty value', () => {
      const control = new FormControl('');

      expect(service.nonBlank(control)).toEqual({ blank: true });
    });

    it('should return blank error for whitespace-only value', () => {
      const control = new FormControl('   ');

      expect(service.nonBlank(control)).toEqual({ blank: true });
    });
  });

  describe('validDate', () => {
    it('should return null for a valid date', () => {
      const control = new FormControl('2026-11-23');

      expect(service.validDate(control)).toBeNull();
    });

    it('should return invalidDate error for an invalid date', () => {
      const control = new FormControl('invalid-date');

      expect(service.validDate(control)).toEqual({
        invalidDate: true,
      });
    });

    it('should return null for an empty value', () => {
      const control = new FormControl('');

      expect(service.validDate(control)).toBeNull();
    });

    it('should return null for a null value', () => {
      const control = new FormControl(null);

      expect(service.validDate(control)).toBeNull();
    });
  });

  describe('futureDate', () => {
    it('should return null for a future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const date = futureDate.toISOString().slice(0, 10);
      const control = new FormControl(date);

      expect(service.futureDate(control)).toBeNull();
    });

    it('should return null for today', () => {
      const today = service.todayInput();
      const control = new FormControl(today);

      expect(service.futureDate(control)).toBeNull();
    });

    it('should return pastDate error for a past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      const date = pastDate.toISOString().slice(0, 10);
      const control = new FormControl(date);

      expect(service.futureDate(control)).toEqual({
        pastDate: true,
      });
    });

    it('should return null for an empty value', () => {
      const control = new FormControl('');

      expect(service.futureDate(control)).toBeNull();
    });

    it('should return null for an invalid date', () => {
      const control = new FormControl('invalid-date');

      expect(service.futureDate(control)).toBeNull();
    });
  });

  describe('todayInput', () => {
    it('should return today in YYYY-MM-DD format', () => {
      const result = service.todayInput();

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return the current date', () => {
      const expected = new Date().toISOString().slice(0, 10);

      expect(service.todayInput()).toBe(expected);
    });
  });
});
