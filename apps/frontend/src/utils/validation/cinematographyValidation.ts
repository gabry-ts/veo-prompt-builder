import type { VeoPromptStructure } from '../../data/veoTemplates';
import type { ValidationWarning } from '../veoValidation';

export function validateCinematography(data: VeoPromptStructure): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (data.prompt.cinematography !== undefined) {
    const hasCameraMovement = (data.prompt.cinematography.camera_movement?.trim() ?? '') !== '';
    const hasComposition = (data.prompt.cinematography.composition?.trim() ?? '') !== '';
    const hasLensAndFocus = (data.prompt.cinematography.lens_and_focus?.trim() ?? '') !== '';
    const hasAnyCinematography = hasCameraMovement || hasComposition || hasLensAndFocus;

    if (!hasAnyCinematography) {
      warnings.push({
        field: 'prompt.cinematography',
        message:
          'At least one cinematography element recommended (camera movement, composition, or lens & focus)',
        severity: 'warning',
      });
    }
  }

  return warnings;
}
