import type { VeoPromptStructure } from '../../data/veoTemplates';
import type { ValidationWarning } from '../veoValidation';

export type TabValidationStatus = 'valid' | 'invalid' | 'incomplete';

export interface TabValidationResult {
  [key: string]: TabValidationStatus;
  settings: TabValidationStatus;
  cinematography: TabValidationStatus;
  core: TabValidationStatus;
  sequence: TabValidationStatus;
  audio: TabValidationStatus;
  advanced: TabValidationStatus;
}

/**
 * Validates individual sections/tabs of the prompt
 * Returns the validation status for each tab
 */
export function getTabValidationStatus(
  data: VeoPromptStructure,
  allWarnings: ValidationWarning[],
): TabValidationResult {
  const getStatusFromFields = (
    fieldPrefixes: string[],
    requiredFields: Array<() => boolean>,
  ): TabValidationStatus => {
    // Check if there are any errors/warnings for this section
    const hasErrors = allWarnings.some(
      (w) =>
        (w.severity === 'error' || w.severity === 'warning') &&
        fieldPrefixes.some((prefix) => w.field.startsWith(prefix)),
    );

    if (hasErrors) return 'invalid';

    // Check if required fields are filled
    const allRequiredFilled = requiredFields.every((check) => check());

    return allRequiredFilled ? 'valid' : 'incomplete';
  };

  return {
    settings: getStatusFromFields(
      ['video_length', 'resolution', 'aspect_ratio'],
      [
        () => data.video_length > 0,
        () => Boolean(data.resolution),
        () => Boolean(data.aspect_ratio),
      ],
    ),

    cinematography: getStatusFromFields(
      ['prompt.cinematography'],
      [
        () =>
          Boolean(data.prompt.cinematography?.camera_movement?.trim()) ||
          Boolean(data.prompt.cinematography?.composition?.trim()) ||
          Boolean(data.prompt.cinematography?.lens_and_focus?.trim()),
      ],
    ),

    core: getStatusFromFields(
      ['prompt.subject', 'prompt.action', 'prompt.context', 'prompt.style_and_ambiance'],
      [
        () => Boolean(data.prompt.subject?.trim()),
        () => Boolean(data.prompt.action?.trim()),
        () => Boolean(data.prompt.context?.trim()),
        () => Boolean(data.prompt.style_and_ambiance?.trim()),
      ],
    ),

    sequence: getStatusFromFields(
      ['prompt.sequence'],
      [
        () =>
          data.prompt.sequence.length === 0 ||
          data.prompt.sequence.some((s) => s.shot_description?.trim()),
      ],
    ),

    audio: getStatusFromFields(
      ['prompt.audio'],
      [
        () =>
          !data.prompt.audio ||
          Boolean(data.prompt.audio.ambient_noise?.trim()) ||
          (data.prompt.audio.dialogue?.length ?? 0) > 0 ||
          (data.prompt.audio.sound_effects?.length ?? 0) > 0,
      ],
    ),

    advanced: getStatusFromFields(
      ['prompt.creative_controls', 'prompt.negative_prompt'],
      [
        // Advanced is always optional, so it's valid if there are no errors
        () => true,
      ],
    ),
  };
}
