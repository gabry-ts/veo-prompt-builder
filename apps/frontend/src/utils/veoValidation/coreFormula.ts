import type { VeoPromptStructure } from '../../data/veoTemplates';
import type { ValidationWarning } from './types';

export function validateCoreFormula(data: VeoPromptStructure): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if ((data.prompt.subject?.trim() ?? '') === '') {
    warnings.push({
      field: 'prompt.subject',
      message: 'Subject is required (main character or focal point)',
      severity: 'error',
    });
  }

  if ((data.prompt.action?.trim() ?? '') === '') {
    warnings.push({
      field: 'prompt.action',
      message: 'Action is required (what the subject is doing)',
      severity: 'error',
    });
  }

  if ((data.prompt.context?.trim() ?? '') === '') {
    warnings.push({
      field: 'prompt.context',
      message: 'Context is required (environment and background)',
      severity: 'error',
    });
  }

  if ((data.prompt.style_and_ambiance?.trim() ?? '') === '') {
    warnings.push({
      field: 'prompt.style_and_ambiance',
      message: 'Style & Ambiance is required (aesthetic, mood, lighting)',
      severity: 'error',
    });
  }

  return warnings;
}

export function validateCinematography(data: VeoPromptStructure): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (data.prompt.cinematography !== undefined) {
    const hasAnyCinematography =
      (data.prompt.cinematography.camera_movement !== undefined &&
        data.prompt.cinematography.camera_movement !== '') ||
      (data.prompt.cinematography.composition !== undefined &&
        data.prompt.cinematography.composition !== '') ||
      (data.prompt.cinematography.lens_and_focus !== undefined &&
        data.prompt.cinematography.lens_and_focus !== '');

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
