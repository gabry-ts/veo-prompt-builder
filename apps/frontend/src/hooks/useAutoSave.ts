import { useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>): {
  isSaving: boolean;
  lastSaved: Date | null;
} {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isSavingRef = useRef(false);
  const lastSavedRef = useRef<Date | null>(null);

  const save = useCallback(async () => {
    if (!enabled || isSavingRef.current) return;

    isSavingRef.current = true;
    try {
      await onSave(data);
      lastSavedRef.current = new Date();
      toast.success('Auto-saved successfully', {
        duration: 2000,
        icon: '💾',
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast.error('Auto-save failed. Please save manually.');
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      void save();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  return {
    isSaving: isSavingRef.current,
    lastSaved: lastSavedRef.current,
  };
}
