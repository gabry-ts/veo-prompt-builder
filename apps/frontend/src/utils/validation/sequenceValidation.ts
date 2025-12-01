import type { VeoPromptStructure } from '../../data/veoTemplates';
import type { ValidationWarning } from '../veoValidation';

interface ParsedSegment {
  index: number;
  start: number;
  end: number;
}

function parseTimestamp(timestamp: string): { start: number; end: number } | null {
  const bracketMatch = timestamp.match(/^\[?(\d+):(\d+)-(\d+):(\d+)\]?$/);
  const secondsMatch = timestamp.match(/^(\d+(?:\.\d+)?)s-(\d+(?:\.\d+)?)s$/);

  if (bracketMatch) {
    const startMin = parseInt(bracketMatch[1]);
    const startSec = parseInt(bracketMatch[2]);
    const endMin = parseInt(bracketMatch[3]);
    const endSec = parseInt(bracketMatch[4]);
    return {
      start: startMin * 60 + startSec,
      end: endMin * 60 + endSec,
    };
  } else if (secondsMatch) {
    return {
      start: parseFloat(secondsMatch[1]),
      end: parseFloat(secondsMatch[2]),
    };
  }
  return null;
}

function validateTimestamp(
  segment: { timestamp: string; shot_description: string },
  index: number,
  videoLength: number,
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!segment.timestamp || segment.timestamp.trim() === '') {
    warnings.push({
      field: `prompt.sequence[${index}].timestamp`,
      message: `Shot ${index + 1}: Timestamp is required`,
      severity: 'error',
    });
    return warnings;
  }

  const timestampRegex = /^\[?(\d+):(\d+)-(\d+):(\d+)\]?$|^(\d+(?:\.\d+)?)s-(\d+(?:\.\d+)?)s$/;
  if (!timestampRegex.test(segment.timestamp)) {
    warnings.push({
      field: `prompt.sequence[${index}].timestamp`,
      message: `Shot ${index + 1}: Invalid timestamp format. Use [00:00-00:02] or 0.0s-2.0s`,
      severity: 'error',
    });
    return warnings;
  }

  const parsed = parseTimestamp(segment.timestamp);
  if (parsed) {
    if (parsed.start >= parsed.end) {
      warnings.push({
        field: `prompt.sequence[${index}].timestamp`,
        message: `Shot ${index + 1}: Start time must be before end time`,
        severity: 'error',
      });
    }

    if (parsed.end > videoLength) {
      warnings.push({
        field: `prompt.sequence[${index}].timestamp`,
        message: `Shot ${index + 1}: End time (${parsed.end}s) exceeds video length (${videoLength}s)`,
        severity: 'warning',
      });
    }

    const shotDuration = parsed.end - parsed.start;
    if (shotDuration < 0.5) {
      warnings.push({
        field: `prompt.sequence[${index}].timestamp`,
        message: `Shot ${index + 1}: Shot duration (${shotDuration.toFixed(1)}s) is very short - may not render well`,
        severity: 'warning',
      });
    }
  }

  return warnings;
}

function validateShotDescription(
  segment: { shot_description: string },
  index: number,
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!segment.shot_description || segment.shot_description.trim() === '') {
    warnings.push({
      field: `prompt.sequence[${index}].shot_description`,
      message: `Shot ${index + 1}: Shot description is required`,
      severity: 'error',
    });
    return warnings;
  }

  if (segment.shot_description.length < 30) {
    warnings.push({
      field: `prompt.sequence[${index}].shot_description`,
      message: `Shot ${index + 1}: Description is too short. Be more detailed and specific.`,
      severity: 'warning',
    });
  }

  const capsLockWords = segment.shot_description.match(/\b[A-Z]{2,}\b/g);
  if (capsLockWords && capsLockWords.length > 0) {
    warnings.push({
      field: `prompt.sequence[${index}].shot_description`,
      message: `Shot ${index + 1}: Avoid caps lock words (${capsLockWords.join(', ')})`,
      severity: 'info',
    });
  }

  return warnings;
}

function checkTimelineGapsAndOverlaps(parsedSegments: ParsedSegment[]): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  for (let i = 0; i < parsedSegments.length - 1; i++) {
    const current = parsedSegments[i];
    const next = parsedSegments[i + 1];
    if (current === undefined || next === undefined) continue;

    if (current.end > next.start) {
      warnings.push({
        field: `prompt.sequence[${current.index}] and sequence[${next.index}]`,
        message: `Timeline overlap: Shot ${current.index + 1} (ends ${current.end}s) overlaps with Shot ${next.index + 1} (starts ${next.start}s)`,
        severity: 'warning',
      });
    } else if (current.end < next.start) {
      const gap = next.start - current.end;
      if (gap > 0.5) {
        warnings.push({
          field: `prompt.sequence[${current.index}] and sequence[${next.index}]`,
          message: `Timeline gap: ${gap.toFixed(1)}s gap between Shot ${current.index + 1} and Shot ${next.index + 1}`,
          severity: 'info',
        });
      }
    }
  }

  return warnings;
}

export function validateSequence(data: VeoPromptStructure): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (data.prompt.sequence === undefined || data.prompt.sequence.length === 0) {
    warnings.push({
      field: 'prompt.sequence',
      message: 'At least one sequence shot is required',
      severity: 'error',
    });
    return warnings;
  }

  data.prompt.sequence.forEach((segment, index) => {
    warnings.push(...validateTimestamp(segment, index, data.video_length));
    warnings.push(...validateShotDescription(segment, index));
  });

  const parsedSegments: ParsedSegment[] = data.prompt.sequence
    .map((seg, idx) => {
      const parsed = parseTimestamp(seg.timestamp);
      return parsed ? { index: idx, start: parsed.start, end: parsed.end } : null;
    })
    .filter((s): s is ParsedSegment => s !== null)
    .sort((a, b) => a.start - b.start);

  warnings.push(...checkTimelineGapsAndOverlaps(parsedSegments));

  return warnings;
}
