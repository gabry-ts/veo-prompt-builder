import { useState } from 'react';
import VisualFormBuilderV2 from '../../components/PromptBuilder/VisualFormBuilderV2';
import ValidationPanel from '../../components/ValidationPanel';
import type { VeoPromptStructure, TemplateDomain } from '../../data/veoTemplates';
import type { PromptVersion } from '../../types/prompt';
import type { ValidationResult } from '../../utils/veoValidation';
import {
  JsonEditor,
  TemplateSelector,
  WelcomeTemplate,
  ShareSection,
  VersionHistory,
} from './PromptEditorHelpers';

interface TemplatesSectionProps {
  isEditMode: boolean;
  name: string;
  showTemplateSelector: boolean;
  editorMode: 'visual' | 'json';
  onSelectTemplate: (template: TemplateDomain) => void;
  onSkip: () => void;
  onShowTemplates: () => void;
}

export function TemplatesSection({
  isEditMode,
  name,
  showTemplateSelector,
  editorMode,
  onSelectTemplate,
  onSkip,
  onShowTemplates,
}: TemplatesSectionProps): JSX.Element {
  return (
    <>
      {!isEditMode && !name && (
        <WelcomeTemplate onSelectTemplate={onSelectTemplate} onSkip={onSkip} />
      )}
      {showTemplateSelector && editorMode === 'visual' && (
        <TemplateSelector onSelectTemplate={onSelectTemplate} onClose={onShowTemplates} />
      )}
    </>
  );
}

interface EditorModeToggleSectionProps {
  editorMode: 'visual' | 'json';
  onModeChange: (mode: 'visual' | 'json') => void;
  onShowTemplates: () => void;
  onImportJson: () => void;
}

export function EditorModeToggleSection({
  editorMode,
  onModeChange,
  onShowTemplates,
  onImportJson,
}: EditorModeToggleSectionProps): JSX.Element {
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

interface MainContentGridProps {
  editorMode: 'visual' | 'json';
  promptData: VeoPromptStructure;
  jsonData: string;
  validationResult: ValidationResult;
  onPromptChange: (data: VeoPromptStructure) => void;
  onJsonChange: (value: string) => void;
  onSave: () => void;
  onExport: () => void;
  onMarkdownPreview?: () => void;
  isSaving: boolean;
  canSave: boolean;
  isEditMode: boolean;
  shareUrl: string | undefined;
  isPublic: boolean;
  isFavorite: boolean;
  onPublicChange: (isPublic: boolean) => void;
  onFavoriteChange: (isFavorite: boolean) => void;
  lastSaved: Date | null;
  versions: PromptVersion[];
  isLoadingVersions: boolean;
  onRestoreVersion: (versionId: string) => void;
}

/* eslint-disable max-lines-per-function */
export function MainContentGrid({
  editorMode,
  promptData,
  jsonData,
  validationResult,
  onPromptChange,
  onJsonChange,
  onSave,
  onExport,
  onMarkdownPreview,
  isSaving,
  canSave,
  isEditMode,
  shareUrl,
  isPublic,
  isFavorite,
  onPublicChange,
  onFavoriteChange,
  lastSaved,
  versions,
  isLoadingVersions,
  onRestoreVersion,
}: MainContentGridProps): JSX.Element {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  return (
    <>
      {/* Sticky Actions Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 mb-6 -mx-6 px-6 py-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onSave}
              disabled={!canSave || isSaving}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md hover:shadow-lg"
            >
              {isSaving ? '⏳ Saving...' : '💾 Save'}
            </button>
            <button
              onClick={onExport}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              📥 Export JSON
            </button>
            {isEditMode && onMarkdownPreview !== undefined && (
              <button
                onClick={onMarkdownPreview}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                📄 Markdown
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onFavoriteChange(!isFavorite)}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md ${
                isFavorite
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
              }`}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>

            <button
              onClick={() => onPublicChange(!isPublic)}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md ${
                isPublic
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
              }`}
            >
              {isPublic ? '🌐' : '🔒'}
            </button>

            {editorMode === 'visual' && (
              <button
                onClick={() => setShowJsonPreview(!showJsonPreview)}
                className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold shadow-md"
              >
                {showJsonPreview ? '👁️ Hide JSON' : '👁️ View JSON'}
              </button>
            )}
            {isEditMode && (
              <>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-md"
                >
                  🔗 Share
                </button>
                <button
                  onClick={() => setShowVersionsModal(true)}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-md"
                >
                  📜 Versions
                </button>
              </>
            )}
          </div>
        </div>

        {/* Inline Validation Summary */}
        <div className="mt-3">
          <ValidationPanel result={validationResult} compact={true} />
        </div>
      </div>

      {/* Full Width Editor */}
      <div className="space-y-6">
        {editorMode === 'visual' ? (
          <VisualFormBuilderV2 initialData={promptData} onChange={onPromptChange} />
        ) : (
          <JsonEditor value={jsonData} onChange={onJsonChange} />
        )}

        {/* JSON Preview (collapsible) */}
        {editorMode === 'visual' && showJsonPreview && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">📄 JSON Preview</h2>
              <button
                onClick={() => setShowJsonPreview(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-auto bg-gray-50 dark:bg-gray-900 p-4 rounded-lg whitespace-pre-wrap break-words max-h-96 border border-gray-200 dark:border-gray-700">
              {JSON.stringify(promptData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔗 Share</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>
            <ShareSection shareUrl={shareUrl} isPublic={isPublic} lastSaved={lastSaved} />
          </div>
        </div>
      )}

      {/* Versions Modal */}
      {showVersionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📜 Version History
              </h2>
              <button
                onClick={() => setShowVersionsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>
            <VersionHistory
              versions={versions}
              isLoading={isLoadingVersions}
              onRestore={(versionId) => {
                onRestoreVersion(versionId);
                setShowVersionsModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
