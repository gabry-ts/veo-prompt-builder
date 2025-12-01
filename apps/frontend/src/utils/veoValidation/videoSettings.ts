import type { VeoPromptStructure } from '../../data/veoTemplates';
import type { ValidationWarning } from './types';

export function validateVideoSettings(data: VeoPromptStructure): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (data.video_length === undefined || ![4, 6, 8].includes(data.video_length)) {
    warnings.push({
      field: 'video_length',
      message: 'Video length must be 4, 6, or 8 seconds (Veo 3.1 supported lengths)',
      severity: 'error',
    });
  }

  if (data.resolution === undefined || !['720p', '1080p'].includes(data.resolution)) {
    warnings.push({
      field: 'resolution',
      message: 'Resolution must be 720p or 1080p',
      severity: 'error',
    });
  }

  if (data.aspect_ratio === undefined || !['16:9', '9:16'].includes(data.aspect_ratio)) {
    warnings.push({
      field: 'aspect_ratio',
      message: 'Aspect ratio must be 16:9 or 9:16',
      severity: 'error',
    });
  }

  return warnings;
}
