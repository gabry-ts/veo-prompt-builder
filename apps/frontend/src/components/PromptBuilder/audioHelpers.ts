import type { VeoPromptStructure } from '../../data/veoTemplates';

export function addDialogueToData(data: VeoPromptStructure): VeoPromptStructure {
  return {
    ...data,
    prompt: {
      ...data.prompt,
      audio: {
        ...data.prompt.audio,
        dialogue: [
          ...(data.prompt.audio?.dialogue || []),
          { character: '', speech: '', voice_description: '' },
        ],
      },
    },
  };
}

export function updateDialogueInData(
  data: VeoPromptStructure,
  index: number,
  field: string,
  value: string,
): VeoPromptStructure {
  const newDialogue = [...(data.prompt.audio?.dialogue || [])];
  newDialogue[index] = { ...newDialogue[index], [field]: value };
  return {
    ...data,
    prompt: {
      ...data.prompt,
      audio: {
        ...data.prompt.audio,
        dialogue: newDialogue,
      },
    },
  };
}

export function deleteDialogueFromData(
  data: VeoPromptStructure,
  index: number,
): VeoPromptStructure {
  return {
    ...data,
    prompt: {
      ...data.prompt,
      audio: {
        ...data.prompt.audio,
        dialogue: data.prompt.audio?.dialogue?.filter((_, i) => i !== index),
      },
    },
  };
}

export function addSFXToData(data: VeoPromptStructure): VeoPromptStructure {
  return {
    ...data,
    prompt: {
      ...data.prompt,
      audio: {
        ...data.prompt.audio,
        sound_effects: [...(data.prompt.audio?.sound_effects || []), ''],
      },
    },
  };
}

export function updateSFXInData(
  data: VeoPromptStructure,
  index: number,
  value: string,
): VeoPromptStructure {
  const newSFX = [...(data.prompt.audio?.sound_effects || [])];
  newSFX[index] = value;
  return {
    ...data,
    prompt: {
      ...data.prompt,
      audio: {
        ...data.prompt.audio,
        sound_effects: newSFX,
      },
    },
  };
}

export function deleteSFXFromData(data: VeoPromptStructure, index: number): VeoPromptStructure {
  return {
    ...data,
    prompt: {
      ...data.prompt,
      audio: {
        ...data.prompt.audio,
        sound_effects: data.prompt.audio?.sound_effects?.filter((_, i) => i !== index),
      },
    },
  };
}

export function updateAmbientInData(data: VeoPromptStructure, value: string): VeoPromptStructure {
  return {
    ...data,
    prompt: {
      ...data.prompt,
      audio: {
        ...data.prompt.audio,
        ambient_noise: value,
      },
    },
  };
}

export function getAudioCompletionStatus(data: VeoPromptStructure): 'complete' | 'empty' {
  const hasDialogue = (data.prompt.audio?.dialogue?.length ?? 0) > 0;
  const hasSoundEffects = (data.prompt.audio?.sound_effects?.length ?? 0) > 0;
  const hasAmbientNoise = (data.prompt.audio?.ambient_noise?.trim() ?? '') !== '';
  const hasAudio = hasDialogue || hasSoundEffects || hasAmbientNoise;
  return hasAudio ? 'complete' : 'empty';
}
