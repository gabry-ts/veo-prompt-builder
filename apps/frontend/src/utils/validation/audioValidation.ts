import type { VeoPromptStructure } from '../../data/veoTemplates';
import type { ValidationWarning } from '../veoValidation';

function validateDialogueItem(
  dialogue: { character: string; speech: string; voice_description?: string },
  index: number,
  videoLength: number,
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!dialogue.character || dialogue.character.trim() === '') {
    warnings.push({
      field: `prompt.audio.dialogue[${index}].character`,
      message: `Dialogue line ${index + 1}: Character name is required`,
      severity: 'error',
    });
  }

  if (!dialogue.speech || dialogue.speech.trim() === '') {
    warnings.push({
      field: `prompt.audio.dialogue[${index}].speech`,
      message: `Dialogue line ${index + 1}: Speech text is required`,
      severity: 'error',
    });
  } else {
    if (dialogue.speech.includes('"') || dialogue.speech.includes("'")) {
      warnings.push({
        field: `prompt.audio.dialogue[${index}].speech`,
        message: `Dialogue line ${index + 1}: Don't include quotation marks - Veo will format them automatically`,
        severity: 'warning',
      });
    }

    const capsLockWords = dialogue.speech.match(/\b[A-Z]{2,}\b/g);
    if (capsLockWords && capsLockWords.length > 0) {
      warnings.push({
        field: `prompt.audio.dialogue[${index}].speech`,
        message: `Dialogue line ${index + 1}: Avoid caps lock words (${capsLockWords.join(', ')}) - may cause spelling issues`,
        severity: 'warning',
      });
    }

    const wordCount = dialogue.speech.split(/\s+/).length;
    const wordsPerSecond = 2.5;
    const estimatedSeconds = wordCount / wordsPerSecond;

    if (estimatedSeconds > videoLength) {
      warnings.push({
        field: `prompt.audio.dialogue[${index}].speech`,
        message: `Dialogue line ${index + 1}: Speech may be too long (${wordCount} words ≈ ${estimatedSeconds.toFixed(1)}s) for ${videoLength}s video`,
        severity: 'warning',
      });
    }
  }

  return warnings;
}

export function validateAudio(data: VeoPromptStructure): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!data.prompt.audio) {
    return warnings;
  }

  if (data.prompt.audio.dialogue && data.prompt.audio.dialogue.length > 0) {
    data.prompt.audio.dialogue.forEach((d, i) => {
      warnings.push(...validateDialogueItem(d, i, data.video_length));
    });
  }

  if (data.prompt.audio.sound_effects && data.prompt.audio.sound_effects.length > 0) {
    data.prompt.audio.sound_effects.forEach((sfx, i) => {
      if (!sfx || sfx.trim() === '') {
        warnings.push({
          field: `prompt.audio.sound_effects[${i}]`,
          message: `Sound effect ${i + 1} is empty`,
          severity: 'warning',
        });
      }
    });
  }

  return warnings;
}
