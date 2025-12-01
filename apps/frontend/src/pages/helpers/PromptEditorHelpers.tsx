import TemplateCarousel from '../../components/PromptBuilder/TemplateCarousel';
import type { TemplateDomain } from '../../data/veoTemplates';
import type { ValidationResult } from '../../utils/veoValidation';

interface TemplateSelectorProps {
  onSelectTemplate: (template: TemplateDomain) => void;
  onClose: () => void;
}

export function TemplateSelector({
  onSelectTemplate,
  onClose,
}: TemplateSelectorProps): JSX.Element {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-300 dark:border-purple-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📚 Choose a Template</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕ Close
        </button>
      </div>
      <TemplateCarousel onSelectTemplate={onSelectTemplate} />
    </div>
  );
}

interface WelcomeTemplateProps {
  onSelectTemplate: (template: TemplateDomain) => void;
  onSkip: () => void;
}

export function WelcomeTemplate({ onSelectTemplate, onSkip }: WelcomeTemplateProps): JSX.Element {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        🎬 Start from a Template
      </h2>
      <TemplateCarousel onSelectTemplate={onSelectTemplate} />
      <div className="mt-4 text-center">
        <button
          onClick={onSkip}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          Or start from scratch ↓
        </button>
      </div>
    </div>
  );
}

interface EditorModeToggleProps {
  editorMode: 'visual' | 'json';
  onModeChange: (mode: 'visual' | 'json') => void;
  onShowTemplates: () => void;
  onImportJson: () => void;
}

export function EditorModeToggle({
  editorMode,
  onModeChange,
  onShowTemplates,
  onImportJson,
}: EditorModeToggleProps): JSX.Element {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => onModeChange('visual')}
          className={`px-4 py-2 rounded-lg transition-all font-semibold ${
            editorMode === 'visual'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          🎨 Visual Builder
        </button>
        <button
          onClick={() => onModeChange('json')}
          className={`px-4 py-2 rounded-lg transition-all font-semibold ${
            editorMode === 'json'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📝 JSON Editor
        </button>
      </div>

      {editorMode === 'visual' && (
        <>
          <button
            onClick={onShowTemplates}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            📚 Templates
          </button>
          <button
            onClick={onImportJson}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            📥 Import JSON
          </button>
        </>
      )}
    </div>
  );
}

interface EditorActionsProps {
  onSave: () => void;
  onExport: () => void;
  isSaving: boolean;
  canSave: boolean;
}

export function EditorActions({
  onSave,
  onExport,
  isSaving,
  canSave,
}: EditorActionsProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 sticky top-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💾 Save & Export</h2>
      <div className="flex flex-col gap-3">
        <button
          onClick={onSave}
          disabled={!canSave || isSaving}
          className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl"
        >
          {isSaving ? '⏳ Saving...' : '💾 Save Prompt'}
        </button>
        <button
          onClick={onExport}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold"
        >
          📥 Export JSON
        </button>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  isEditMode: boolean;
  onBack: () => void;
}

export function PageHeader({ isEditMode, onBack }: PageHeaderProps): JSX.Element {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditMode ? '✏️ Edit Prompt' : '✨ Create New Prompt'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Build professional Veo 3.1 video prompts with ease
        </p>
      </div>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}

interface BasicInfoFormProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function BasicInfoForm({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: BasicInfoFormProps): JSX.Element {
  return (
    <div className="mb-6 space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Prompt Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Luxury Brand Reveal"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Cinematic brand reveal with chrome effects"
        />
      </div>
    </div>
  );
}

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function JsonEditor({ value, onChange }: JsonEditorProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
      <label
        htmlFor="json"
        className="block text-lg font-semibold text-gray-900 dark:text-white mb-4"
      >
        📝 JSON Data *
      </label>
      <textarea
        id="json"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={35}
        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
        placeholder='{"video_length": 8, "resolution": "1080p", ...}'
      />
    </div>
  );
}

interface JsonPreviewProps {
  data: unknown;
}

export function JsonPreview({ data }: JsonPreviewProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📄 JSON Preview</h2>
      <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-auto bg-gray-50 dark:bg-gray-900 p-4 rounded-lg whitespace-pre-wrap break-words max-h-96 border border-gray-200 dark:border-gray-700">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

interface ValidationCardProps {
  validationResult: ValidationResult;
  getValidationSummary: (result: ValidationResult) => string;
  children: React.ReactNode;
}

export function ValidationCard({
  validationResult,
  getValidationSummary,
  children,
}: ValidationCardProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        ✅ Validation
        {validationResult.warnings.length > 0 && (
          <span className="text-sm font-normal ml-2 text-gray-600 dark:text-gray-400">
            ({getValidationSummary(validationResult)})
          </span>
        )}
      </h2>
      {children}
    </div>
  );
}
