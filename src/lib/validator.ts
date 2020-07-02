import { validateSync, ValidationError } from '../validator';

export class ConfigValidator {
  public validate(config: {}): void {
    const validationErrors: ValidationError[] = validateSync(config);
    if (validationErrors.length > 0) {
      throw new Error(JSON.stringify(validationErrors));
    }
  }
}
