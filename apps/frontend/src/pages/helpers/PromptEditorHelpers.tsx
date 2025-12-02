import { useState } from 'react';
import {
  BookOpen,
  X,
  Clapperboard,
  Palette,
  FileText,
  Download,
  Save,
  Clock,
  Check,
  Clipboard,
  Globe,
  Link,
  Scroll,
  Package,
  ArrowDown,
  Edit,
  Sparkles,
} from 'lucide-react';
import TemplateCarousel from '../../components/PromptBuilder/TemplateCarousel';
import type { TemplateDomain } from '../../data/veoTemplates';
import type { PromptVersion } from '../../types/prompt';
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6" /> Choose a Template
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
        >
          <X className="w-4 h-4" /> Close
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Clapperboard className="w-6 h-6" /> Start from a Template
      </h2>
      <TemplateCarousel onSelectTemplate={onSelectTemplate} />
      <div className="mt-4 text-center">
        <button
          onClick={onSkip}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 mx-auto"
        >
          Or start from scratch <ArrowDown className="w-3 h-3" />
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
          className={`px-4 py-2 rounded-lg transition-all font-semibold flex items-center gap-2 ${
            editorMode === 'visual'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" /> Visual Builder
        </button>
        <button
          onClick={() => onModeChange('json')}
          className={`px-4 py-2 rounded-lg transition-all font-semibold flex items-center gap-2 ${
            editorMode === 'json'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> JSON Editor
        </button>
      </div>

      {editorMode === 'visual' && (
        <>
          <button
            onClick={onShowTemplates}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Templates
          </button>
          <button
            onClick={onImportJson}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Import JSON
          </button>
        </>
      )}
    </div>
  );
}

interface EditorActionsProps {
  onSave: () => void;
  onExport: () => void;
  onMarkdownPreview?: () => void;
  isSaving: boolean;
  canSave: boolean;
  isEditMode: boolean;
}

export function EditorActions({
  onSave,
  onExport,
  onMarkdownPreview,
  isSaving,
  canSave,
  isEditMode,
}: EditorActionsProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 sticky top-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Save className="w-5 h-5" /> Save & Export
      </h2>
      <div className="flex flex-col gap-3">
        <button
          onClick={onSave}
          disabled={!canSave || isSaving}
          className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Clock className="w-4 h-4" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Prompt
            </>
          )}
        </button>
        <button
          onClick={onExport}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Export JSON
        </button>
        {isEditMode && onMarkdownPreview !== undefined && (
          <button
            onClick={onMarkdownPreview}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Export Markdown
          </button>
        )}
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          {isEditMode ? (
            <>
              <Edit className="w-9 h-9" /> Edit Prompt
            </>
          ) : (
            <>
              <Sparkles className="w-9 h-9" /> Create New Prompt
            </>
          )}
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
        className="block text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
      >
        <FileText className="w-5 h-5" /> JSON Data *
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
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" /> JSON Preview
      </h2>
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
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Check className="w-5 h-5" /> Validation
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

interface ShareSectionProps {
  shareUrl: string | undefined;
  isPublic: boolean;
  onPublicChange: (isPublic: boolean) => void;
  lastSaved: Date | null;
}

export function ShareSection({
  shareUrl,
  isPublic,
  onPublicChange,
  lastSaved,
}: ShareSectionProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    if (shareUrl !== undefined) {
      void navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Link className="w-5 h-5" /> Share
      </h2>
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => onPublicChange(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-primary-600 transition-all duration-200"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-md"></div>
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            <Globe className="w-4 h-4" /> Public
          </span>
        </label>
      </div>
      {isPublic && shareUrl !== undefined ? (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Public share link:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4" /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      ) : isPublic ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Save the prompt to generate a share link
        </p>
      ) : null}
      {lastSaved !== null && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
          Last autosaved: {lastSaved.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

interface VersionHistoryProps {
  versions: PromptVersion[];
  isLoading: boolean;
  onRestore: (versionId: string) => void;
}

export function VersionHistory({
  versions,
  isLoading,
  onRestore,
}: VersionHistoryProps): JSX.Element {
  const renderContent = (): JSX.Element => {
    if (isLoading) {
      return <p className="text-sm text-gray-600 dark:text-gray-400">Loading versions...</p>;
    }

    if (versions.length === 0) {
      return (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No previous versions yet. Versions are created automatically when you edit the prompt.
        </p>
      );
    }

    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {versions.map((version) => (
          <div
            key={version.id}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Version {version.version}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{version.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(version.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => onRestore(version.id)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Scroll className="w-5 h-5" /> Version History
      </h2>
      {renderContent()}
    </div>
  );
}

interface MarkdownPreviewModalProps {
  markdown: string;
  onClose: () => void;
  onDownload: () => void;
}

export function MarkdownPreviewModal({
  markdown,
  onClose,
  onDownload,
}: MarkdownPreviewModalProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    void navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6" /> Markdown Preview
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-gray-900 dark:text-white">
            {markdown}
          </pre>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
          <button
            onClick={handleCopy}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" /> Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={onDownload}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Markdown
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface JsonPreviewModalProps {
  json: string;
  onClose: () => void;
  onDownload: () => void;
}

export function JsonPreviewModal({
  json,
  onClose,
  onDownload,
}: JsonPreviewModalProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    void navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6" /> JSON Preview
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-gray-900 dark:text-white">
            {json}
          </pre>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
          <button
            onClick={handleCopy}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" /> Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={onDownload}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download JSON
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
