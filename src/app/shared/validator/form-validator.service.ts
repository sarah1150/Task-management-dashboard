import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorService {
  nonBlank = (control: AbstractControl<string | null>) => {
    return control.value?.trim() ? null : { blank: true };
  };

  validDate = (control: AbstractControl<string | null>) => {
    if (!control.value) return null;
    const parsed = new Date(`${control.value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? { invalidDate: true } : null;
  };

  futureDate = (control: AbstractControl<string | null>) => {
    if (!control.value || this.validDate(control)) return null;
    const today = new Date().toISOString().slice(0, 10);
    return control.value < today ? { pastDate: true } : null;
  };

  todayInput(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
