import type { VeoPromptStructure } from '../../data/veoTemplates';

export function parseTimestamp(ts: string): number {
  const secondsMatch = ts.match(/^(\d+(?:\.\d+)?)s-(\d+(?:\.\d+)?)s$/);
  const bracketMatch = ts.match(/^\[?(\d+):(\d+)-(\d+):(\d+)\]?$/);
  if (secondsMatch) return parseFloat(secondsMatch[2]);
  if (bracketMatch) return parseInt(bracketMatch[3]) * 60 + parseInt(bracketMatch[4]);
  return 0;
}

export function getCompletionStatus(
  sequence: Array<{ shot_description: string }>,
): 'complete' | 'partial' | 'empty' {
  if (sequence.every((s) => s.shot_description.trim() !== '')) {
    return 'complete';
  } else if (sequence.some((s) => s.shot_description.trim() !== '')) {
    return 'partial';
  } else {
    return 'empty';
  }
}

export function updateShotInData(
  data: VeoPromptStructure,
  index: number,
  field: string,
  value: string,
): VeoPromptStructure {
  const newSequence = [...data.prompt.sequence];
  newSequence[index] = { ...newSequence[index], [field]: value };
  return {
    ...data,
    prompt: {
      ...data.prompt,
      sequence: newSequence,
    },
  };
}

export function deleteShotFromData(data: VeoPromptStructure, index: number): VeoPromptStructure {
  return {
    ...data,
    prompt: {
      ...data.prompt,
      sequence: data.prompt.sequence.filter((_, i) => i !== index),
    },
  };
}

export function reorderShotInData(
  data: VeoPromptStructure,
  fromIndex: number,
  toIndex: number,
): VeoPromptStructure {
  const newSequence = [...data.prompt.sequence];
  const [movedShot] = newSequence.splice(fromIndex, 1);
  newSequence.splice(toIndex, 0, movedShot);
  return {
    ...data,
    prompt: {
      ...data.prompt,
      sequence: newSequence,
    },
  };
}
