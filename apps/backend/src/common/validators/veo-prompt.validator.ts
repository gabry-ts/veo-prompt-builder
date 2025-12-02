import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsVeoPromptDataConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const data = value as Record<string, unknown>;

    // Check if at least one scene exists
    const sceneKeys = Object.keys(data);
    if (sceneKeys.length === 0) {
      return false;
    }

    // Validate each scene
    for (const key of sceneKeys) {
      const sceneData = data[key];

      if (!sceneData || typeof sceneData !== 'object') {
        return false;
      }

      const scene = sceneData as Record<string, unknown>;

      // Check if scene property exists
      if (!scene['scene'] || typeof scene['scene'] !== 'object') {
        return false;
      }

      // Optionally validate metadata if present
      if (scene['metadata'] && typeof scene['metadata'] !== 'object') {
        return false;
      }
    }

    return true;
  }

  defaultMessage(): string {
    return 'jsonData must be a valid Veo prompt structure with at least one scene';
  }
}

export function IsVeoPromptData(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsVeoPromptDataConstraint,
    });
  };
}
