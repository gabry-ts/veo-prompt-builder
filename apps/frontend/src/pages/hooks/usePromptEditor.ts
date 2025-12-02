import {
  useMutation,
  useQueryClient,
  useQuery,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useState, useEffect, useMemo, useRef } from 'react';
import type { VeoPromptStructure, TemplateDomain } from '../../data/veoTemplates';
import { emptyTemplate } from '../../data/veoTemplates';
import { promptService } from '../../services/promptService';
import type { Prompt, PromptVersion } from '../../types/prompt';
import { isPromptDataPristine } from '../../utils/formHelpers';
import { validateVeoPrompt } from '../../utils/veoValidation';
import type { ValidationResult } from '../../utils/veoValidation/types';

type EditorMode = 'visual' | 'json';

interface PromptMutationData {
  name: string;
  description?: string;
  jsonData: Record<string, unknown>;
  tags?: string[];
  isFavorite?: boolean;
  rating?: number;
  isPublic?: boolean;
}

interface UsePromptEditorProps {
  id?: string;
  onNavigate: (path: string) => void;
}

interface UsePromptEditorReturn {
  isEditMode: boolean;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  handleTagsChange: (tags: string[]) => void;
  isFavorite: boolean;
  setIsFavorite: (favorite: boolean) => void;
  rating: number | undefined;
  setRating: (rating: number | undefined) => void;
  isPublic: boolean;
  handlePublicChange: (isPublic: boolean) => void;
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
  showTemplateSelector: boolean;
  setShowTemplateSelector: (show: boolean) => void;
  promptData: VeoPromptStructure;
  jsonData: string;
  setJsonData: (json: string) => void;
  validationResult: ValidationResult;
  handlePromptChange: (data: VeoPromptStructure) => void;
  handleTemplateSelect: (template: TemplateDomain) => void;
  handleImportJson: () => void;
  handleSave: () => void;
  handleSilentSave: () => void;
  handleExport: () => void;
  isSaving: boolean;
  shareToken: string | null | undefined;
  shareUrl: string | undefined;
  versions: PromptVersion[];
  isLoadingVersions: boolean;
  handleRestoreVersion: (versionId: string) => void;
  lastSaved: Date | null;
  markdownPreview: string | null;
  showMarkdownModal: boolean;
  handleMarkdownPreview: () => void;
  handleMarkdownDownload: () => void;
  handleCloseMarkdownModal: () => void;
  jsonPreview: string | null;
  showJsonModal: boolean;
  handleJsonDownload: () => void;
  handleCloseJsonModal: () => void;
}

const getJsonFromEditor = (
  mode: EditorMode,
  data: VeoPromptStructure,
  json: string,
): VeoPromptStructure => (mode === 'visual' ? data : (JSON.parse(json) as VeoPromptStructure));

const importJsonFile = (setPromptData: (data: VeoPromptStructure) => void): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setPromptData(JSON.parse(event.target?.result as string) as VeoPromptStructure);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

const createSaveData = (
  name: string,
  description: string,
  tags: string[],
  isFavorite: boolean,
  rating: number | undefined,
  isPublic: boolean,
  editorMode: EditorMode,
  promptData: VeoPromptStructure,
  jsonData: string,
): PromptMutationData => ({
  name,
  description: description || undefined,
  jsonData: getJsonFromEditor(editorMode, promptData, jsonData) as unknown as Record<
    string,
    unknown
  >,
  tags,
  isFavorite,
  rating,
  isPublic,
});

const useCreatePromptMutation = (
  queryClient: ReturnType<typeof useQueryClient>,
  onNavigate: (path: string) => void,
): UseMutationResult<Prompt, unknown, PromptMutationData, unknown> => {
  return useMutation({
    mutationFn: (data: PromptMutationData) => promptService.create(data),
    onSuccess: (newPrompt) => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
      onNavigate(`/prompts/${newPrompt.id}`);
    },
  });
};

const useUpdatePromptMutation = (
  id: string,
  queryClient: ReturnType<typeof useQueryClient>,
): UseMutationResult<Prompt, unknown, PromptMutationData, unknown> => {
  return useMutation({
    mutationFn: (data: PromptMutationData) => promptService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
      void queryClient.invalidateQueries({ queryKey: ['prompt', id] });
    },
  });
};

const useSilentUpdatePromptMutation = (
  id: string,
  queryClient: ReturnType<typeof useQueryClient>,
): UseMutationResult<Prompt, unknown, PromptMutationData, unknown> => {
  return useMutation({
    mutationFn: (data: PromptMutationData) => promptService.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['prompts'] });
      await queryClient.invalidateQueries({ queryKey: ['prompt', id] });
      await queryClient.refetchQueries({ queryKey: ['prompt', id] });
    },
  });
};

interface AutosaveParams {
  isEditMode: boolean;
  promptDataForSave: PromptMutationData;
  editorMode: EditorMode;
  promptData: VeoPromptStructure;
  jsonData: string;
  updateMutation: UseMutationResult<Prompt, unknown, PromptMutationData, unknown>;
  setLastSaved: (date: Date) => void;
}

const useAutosave = (params: AutosaveParams): void => {
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!params.isEditMode || !params.promptDataForSave.name) return;

    if (autosaveTimerRef.current !== null) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      try {
        const finalJson = getJsonFromEditor(params.editorMode, params.promptData, params.jsonData);
        const data = {
          ...params.promptDataForSave,
          jsonData: finalJson as unknown as Record<string, unknown>,
        };
        params.updateMutation.mutate(data, {
          onSuccess: () => {
            params.setLastSaved(new Date());
          },
        });
      } catch {
        // Silent fail for autosave
      }
    }, 30000);

    return () => {
      if (autosaveTimerRef.current !== null) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [
    params.isEditMode,
    params.promptDataForSave,
    params.editorMode,
    params.promptData,
    params.jsonData,
  ]);
};

const useRestoreVersionMutation = (
  id: string,
  queryClient: ReturnType<typeof useQueryClient>,
  setPromptData: (data: VeoPromptStructure) => void,
  setJsonData: (json: string) => void,
): UseMutationResult<Prompt, unknown, string, unknown> => {
  return useMutation({
    mutationFn: (versionId: string) => promptService.restoreVersion(id, versionId),
    onSuccess: (restoredPrompt) => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
      void queryClient.invalidateQueries({ queryKey: ['prompt', id] });
      void queryClient.invalidateQueries({ queryKey: ['prompt-versions', id] });
      setPromptData(restoredPrompt.jsonData as unknown as VeoPromptStructure);
      setJsonData(JSON.stringify(restoredPrompt.jsonData, null, 2));
    },
  });
};

// eslint-disable-next-line max-lines-per-function -- Complex editor hook with state, queries, mutations, and handlers
export function usePromptEditor({ id, onNavigate }: UsePromptEditorProps): UsePromptEditorReturn {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [promptData, setPromptData] = useState<VeoPromptStructure>(emptyTemplate);
  const [jsonData, setJsonData] = useState('{}');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [markdownPreview, setMarkdownPreview] = useState<string | null>(null);
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const [jsonPreview, setJsonPreview] = useState<string | null>(null);
  const [showJsonModal, setShowJsonModal] = useState(false);

  const { data: prompt } = useQuery({
    queryKey: ['prompt', id],
    queryFn: () => promptService.getById(id!),
    enabled: isEditMode,
  });

  const { data: versions = [], isLoading: isLoadingVersions } = useQuery({
    queryKey: ['prompt-versions', id],
    queryFn: () => promptService.getVersions(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (prompt) {
      setName(prompt.name);
      setDescription(prompt.description ?? '');
      setTags(prompt.tags);
      setIsFavorite(prompt.isFavorite);
      setRating(prompt.rating);
      setIsPublic(prompt.isPublic);
      setPromptData(prompt.jsonData as unknown as VeoPromptStructure);
      setJsonData(JSON.stringify(prompt.jsonData, null, 2));
    }
  }, [prompt]);

  useEffect(() => {
    if (editorMode === 'visual') setJsonData(JSON.stringify(promptData, null, 2));
  }, [promptData, editorMode]);

  const createMutation = useCreatePromptMutation(queryClient, onNavigate);
  const updateMutation = useUpdatePromptMutation(id!, queryClient);
  const silentUpdateMutation = useSilentUpdatePromptMutation(id!, queryClient);
  const restoreMutation = useRestoreVersionMutation(id!, queryClient, setPromptData, setJsonData);

  useAutosave({
    isEditMode,
    promptDataForSave: {
      name,
      description: description || undefined,
      jsonData: {} as Record<string, unknown>,
      tags,
      isFavorite,
      rating,
      isPublic,
    },
    editorMode,
    promptData,
    jsonData,
    updateMutation,
    setLastSaved,
  });

  const handleSave = (): void => {
    try {
      (isEditMode ? updateMutation : createMutation).mutate(
        createSaveData(
          name,
          description,
          tags,
          isFavorite,
          rating,
          isPublic,
          editorMode,
          promptData,
          jsonData,
        ),
      );
    } catch {
      alert('Invalid JSON format');
    }
  };

  const handleSilentSave = (): void => {
    if (!isEditMode) return;
    try {
      silentUpdateMutation.mutate(
        createSaveData(
          name,
          description,
          tags,
          isFavorite,
          rating,
          isPublic,
          editorMode,
          promptData,
          jsonData,
        ),
      );
    } catch {
      // Silent fail
    }
  };

  const handleExport = (): void => {
    try {
      const json = getJsonFromEditor(editorMode, promptData, jsonData);
      setJsonPreview(JSON.stringify(json, null, 2));
      setShowJsonModal(true);
    } catch {
      alert('Invalid JSON format');
    }
  };

  const handleJsonDownload = (): void => {
    if (!jsonPreview) return;
    const blob = new Blob([jsonPreview], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name || 'prompt'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseJsonModal = (): void => {
    setShowJsonModal(false);
    setJsonPreview(null);
  };

  const handleMarkdownPreview = (): void => {
    if (!id) return;
    promptService
      .exportMarkdown(id)
      .then((markdown) => {
        setMarkdownPreview(markdown);
        setShowMarkdownModal(true);
      })
      .catch(() => alert('Failed to generate markdown'));
  };

  const handleMarkdownDownload = (): void => {
    if (!markdownPreview) return;
    const blob = new Blob([markdownPreview], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name || 'prompt'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCloseMarkdownModal = (): void => {
    setShowMarkdownModal(false);
    setMarkdownPreview(null);
  };

  const handleTagsChange = (newTags: string[]): void => {
    setTags(newTags);
    if (isEditMode) {
      // Silent save to backend with new tags
      try {
        silentUpdateMutation.mutate(
          createSaveData(
            name,
            description,
            newTags,
            isFavorite,
            rating,
            isPublic,
            editorMode,
            promptData,
            jsonData,
          ),
        );
      } catch (error) {
        console.error('Failed to auto-save tags:', error);
      }
    }
  };

  const handlePublicChange = (newIsPublic: boolean): void => {
    setIsPublic(newIsPublic);
    if (isEditMode) {
      // Silent save to backend with new public state
      try {
        silentUpdateMutation.mutate(
          createSaveData(
            name,
            description,
            tags,
            isFavorite,
            rating,
            newIsPublic, // Use the new value directly
            editorMode,
            promptData,
            jsonData,
          ),
        );
      } catch {
        // Silent fail
      }
    }
  };

  const validationResult = useMemo(() => {
    try {
      const json = getJsonFromEditor(editorMode, promptData, jsonData);
      return !isEditMode && isPromptDataPristine(json)
        ? { isValid: true, warnings: [] }
        : validateVeoPrompt(json);
    } catch {
      return { isValid: false, warnings: [] };
    }
  }, [editorMode, promptData, jsonData, isEditMode]);

  const shareUrl = prompt?.shareToken
    ? `${window.location.origin}/shared/${prompt.shareToken}`
    : undefined;

  return {
    isEditMode,
    name,
    setName,
    description,
    setDescription,
    tags,
    setTags,
    handleTagsChange,
    isFavorite,
    setIsFavorite,
    rating,
    setRating,
    isPublic,
    handlePublicChange,
    editorMode,
    setEditorMode,
    showTemplateSelector,
    setShowTemplateSelector,
    promptData,
    jsonData,
    setJsonData,
    validationResult,
    handlePromptChange: setPromptData,
    handleTemplateSelect: (template) => {
      setPromptData(template.template);
      setShowTemplateSelector(false);
    },
    handleImportJson: () => importJsonFile(setPromptData),
    handleSave,
    handleSilentSave,
    handleExport,
    isSaving: createMutation.isPending || updateMutation.isPending,
    shareToken: prompt?.shareToken,
    shareUrl,
    versions,
    isLoadingVersions,
    handleRestoreVersion: (versionId: string) => restoreMutation.mutate(versionId),
    lastSaved,
    markdownPreview,
    showMarkdownModal,
    handleMarkdownPreview,
    handleMarkdownDownload,
    handleCloseMarkdownModal,
    jsonPreview,
    showJsonModal,
    handleJsonDownload,
    handleCloseJsonModal,
  };
}
