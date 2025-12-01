import type { VeoPromptStructure } from '../data/veoTemplates';

/**
 * Checks if the prompt data is essentially empty/untouched by the user
 * Used to avoid showing validation errors on a fresh form
 */
export function isPromptDataPristine(data: VeoPromptStructure): boolean {
  const { prompt } = data;

  // Check if core fields are empty
  const coreFieldsEmpty =
    !prompt.subject?.trim() &&
    !prompt.action?.trim() &&
    !prompt.context?.trim() &&
    !prompt.style_and_ambiance?.trim();

  // Check if cinematography fields are empty
  const cinematographyEmpty =
    !prompt.cinematography?.camera_movement?.trim() &&
    !prompt.cinematography?.composition?.trim() &&
    !prompt.cinematography?.lens_and_focus?.trim();

  // Check if audio fields are empty
  const audioEmpty =
    (!prompt.audio?.dialogue || prompt.audio.dialogue.length === 0) &&
    (!prompt.audio?.sound_effects || prompt.audio.sound_effects.length === 0) &&
    !prompt.audio?.ambient_noise?.trim();

  // Check if sequence fields are empty (all shot_description are empty)
  const sequenceEmpty = prompt.sequence.every(
    (shot) => !shot.shot_description?.trim() && !shot.emotion?.trim() && !shot.sfx?.trim(),
  );

  // Check if negative prompt is empty
  const negativePromptEmpty = !prompt.negative_prompt?.trim();

  return (
    coreFieldsEmpty && cinematographyEmpty && audioEmpty && sequenceEmpty && negativePromptEmpty
  );
}
