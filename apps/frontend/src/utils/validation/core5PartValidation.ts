import type { VeoPromptStructure } from '../../data/veoTemplates';
import type { ValidationWarning } from '../veoValidation';

export function validateCore5Part(data: VeoPromptStructure): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  const hasSubject = (data.prompt.subject?.trim() ?? '') !== '';
  if (!hasSubject) {
    warnings.push({
      field: 'prompt.subject',
      message: 'Subject is required (main character or focal point)',
      severity: 'error',
    });
  }

  const hasAction = (data.prompt.action?.trim() ?? '') !== '';
  if (!hasAction) {
    warnings.push({
      field: 'prompt.action',
      message: 'Action is required (what the subject is doing)',
      severity: 'error',
    });
  }

  const hasContext = (data.prompt.context?.trim() ?? '') !== '';
  if (!hasContext) {
    warnings.push({
      field: 'prompt.context',
      message: 'Context is required (environment and background)',
      severity: 'error',
    });
  }

  const hasStyleAndAmbiance = (data.prompt.style_and_ambiance?.trim() ?? '') !== '';
  if (!hasStyleAndAmbiance) {
    warnings.push({
      field: 'prompt.style_and_ambiance',
      message: 'Style & Ambiance is required (aesthetic, mood, lighting)',
      severity: 'error',
    });
  }

  return warnings;
}
