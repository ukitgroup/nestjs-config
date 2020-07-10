import { validateSync, ValidationError } from '../validator';

export class ConfigValidator {
  public validate(config: {}): void {
    const validationErrors: ValidationError[] = validateSync(config);
    if (validationErrors.length > 0) {
      // Error: [ModuleNameConfig.variable received `value` errors: {"rule": "description"}]
      throw new Error(
        validationErrors
          .map(
            (validationError: ValidationError) =>
              `${config.constructor.name}.${
                validationError.property
              } received \`${validationError.value}\` errors: ${JSON.stringify(
                validationError.constraints,
              )}`,
          )
          .join('\n'),
      );
    }
  }
}
