import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import type { VeoPromptStructure, TemplateDomain } from '../../data/veoTemplates';
import { emptyTemplate } from '../../data/veoTemplates';
import { promptService } from '../../services/promptService';
import { isPromptDataPristine } from '../../utils/formHelpers';
import { validateVeoPrompt } from '../../utils/veoValidation';
import type { ValidationResult } from '../../utils/veoValidation/types';

type EditorMode = 'visual' | 'json';

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
  handleExport: () => void;
  isSaving: boolean;
}

const getJsonFromEditor = (
  mode: EditorMode,
  data: VeoPromptStructure,
  json: string,
): VeoPromptStructure => (mode === 'visual' ? data : (JSON.parse(json) as VeoPromptStructure));

const downloadJsonFile = (data: VeoPromptStructure, name: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name || 'prompt'}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export function usePromptEditor({ id, onNavigate }: UsePromptEditorProps): UsePromptEditorReturn {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [promptData, setPromptData] = useState<VeoPromptStructure>(emptyTemplate);
  const [jsonData, setJsonData] = useState('{}');

  const { data: prompt } = useQuery({
    queryKey: ['prompt', id],
    queryFn: () => promptService.getById(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (prompt) {
      setName(prompt.name);
      setDescription(prompt.description || '');
      setPromptData(prompt.jsonData as unknown as VeoPromptStructure);
      setJsonData(JSON.stringify(prompt.jsonData, null, 2));
    }
  }, [prompt]);

  useEffect(() => {
    if (editorMode === 'visual') {
      setJsonData(JSON.stringify(promptData, null, 2));
    }
  }, [promptData, editorMode]);

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; jsonData: Record<string, unknown> }) =>
      promptService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
      onNavigate('/dashboard');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; jsonData: Record<string, unknown> }) =>
      promptService.update(id!, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
      void queryClient.invalidateQueries({ queryKey: ['prompt', id] });
      onNavigate('/dashboard');
    },
  });

  const handleImportJson = (): void => {
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

  const handleSave = (): void => {
    try {
      const finalJson = getJsonFromEditor(editorMode, promptData, jsonData);
      const data = {
        name,
        description: description || undefined,
        jsonData: finalJson as unknown as Record<string, unknown>,
      };
      (isEditMode ? updateMutation : createMutation).mutate(data);
    } catch {
      alert('Invalid JSON format');
    }
  };
  const handleExport = (): void => {
    try {
      downloadJsonFile(getJsonFromEditor(editorMode, promptData, jsonData), name);
    } catch {
      alert('Invalid JSON format');
    }
  };

  const validationResult = useMemo(() => {
    try {
      const jsonToValidate = getJsonFromEditor(editorMode, promptData, jsonData);

      // Don't show validation errors if the form is pristine (untouched)
      if (!isEditMode && isPromptDataPristine(jsonToValidate)) {
        return { isValid: true, warnings: [] };
      }

      return validateVeoPrompt(jsonToValidate);
    } catch {
      return { isValid: false, warnings: [] };
    }
  }, [editorMode, promptData, jsonData, isEditMode]);

  return {
    isEditMode,
    name,
    setName,
    description,
    setDescription,
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
    handleImportJson,
    handleSave,
    handleExport,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
