import type { VeoPromptStructure } from '../data/veoTemplates';
import { validateAudio } from './validation/audioValidation';
import { validateCinematography } from './validation/cinematographyValidation';
import { validateCore5Part } from './validation/core5PartValidation';
import { validateSequence } from './validation/sequenceValidation';
import { validateVideoSettings } from './validation/videoSettingsValidation';

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
}

export function validateVeoPrompt(
  jsonData: VeoPromptStructure | Record<string, unknown>,
): ValidationResult {
  const warnings: ValidationWarning[] = [];

  if ('video_length' in jsonData && 'aspect_ratio' in jsonData && 'prompt' in jsonData) {
    const data = jsonData as VeoPromptStructure;

    warnings.push(...validateVideoSettings(data));

    if (data.prompt === undefined) {
      warnings.push({
        field: 'prompt',
        message: 'Prompt object is required',
        severity: 'error',
      });
      return { isValid: false, warnings };
    }

    warnings.push(...validateCore5Part(data));
    warnings.push(...validateCinematography(data));
    warnings.push(...validateAudio(data));
    warnings.push(...validateSequence(data));

    if (data.prompt.negative_prompt && data.prompt.negative_prompt.trim() !== '') {
      const noPattern = /\bno\s+\w+/gi;
      const noMatches = data.prompt.negative_prompt.match(noPattern);
      if (noMatches && noMatches.length > 3) {
        warnings.push({
          field: 'prompt.negative_prompt',
          message:
            'Consider using descriptive language instead of multiple "no X" phrases (e.g., "desolate landscape" instead of "no buildings")',
          severity: 'info',
        });
      }
    }

    const totalWarnings = warnings.filter(
      (w) => w.severity === 'warning' || w.severity === 'error',
    ).length;

    if (totalWarnings === 0) {
      warnings.push({
        field: 'general',
        message: 'Prompt structure looks good! Ready for Veo 3.1 generation.',
        severity: 'info',
      });
    }

    return {
      isValid: warnings.filter((w) => w.severity === 'error').length === 0,
      warnings,
    };
  }

  warnings.push({
    field: 'general',
    message:
      'Unrecognized prompt structure. Please use the Veo 3.1 format with video_length, aspect_ratio, and prompt fields.',
    severity: 'error',
  });

  return {
    isValid: false,
    warnings,
  };
}

export function getValidationSummary(result: ValidationResult): string {
  const errors = result.warnings.filter((w) => w.severity === 'error').length;
  const warnings = result.warnings.filter((w) => w.severity === 'warning').length;
  const infos = result.warnings.filter((w) => w.severity === 'info').length;

  if (errors === 0 && warnings === 0 && infos <= 1) {
    return 'Ready';
  }

  const parts: string[] = [];
  if (errors > 0) {
    parts.push(`${errors} error${errors > 1 ? 's' : ''}`);
  }
  if (warnings > 0) {
    parts.push(`${warnings} warning${warnings > 1 ? 's' : ''}`);
  }

  return parts.join(', ') || `${infos} info`;
}
