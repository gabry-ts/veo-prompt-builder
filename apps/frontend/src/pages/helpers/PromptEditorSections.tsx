import VisualFormBuilderV2 from '../../components/PromptBuilder/VisualFormBuilderV2';
import ValidationPanel from '../../components/ValidationPanel';
import type { VeoPromptStructure, TemplateDomain } from '../../data/veoTemplates';
import type { PromptVersion } from '../../types/prompt';
import type { ValidationResult } from '../../utils/veoValidation';
import {
  EditorActions,
  JsonEditor,
  JsonPreview,
  ValidationCard,
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
  getValidationSummary: (result: ValidationResult) => string;
  onPromptChange: (data: VeoPromptStructure) => void;
  onJsonChange: (value: string) => void;
  onSave: () => void;
  onExport: () => void;
  isSaving: boolean;
  canSave: boolean;
  isEditMode: boolean;
  shareUrl: string | undefined;
  isPublic: boolean;
  lastSaved: Date | null;
  versions: PromptVersion[];
  isLoadingVersions: boolean;
  onRestoreVersion: (versionId: string) => void;
}

export function MainContentGrid({
  editorMode,
  promptData,
  jsonData,
  validationResult,
  getValidationSummary,
  onPromptChange,
  onJsonChange,
  onSave,
  onExport,
  isSaving,
  canSave,
  isEditMode,
  shareUrl,
  isPublic,
  lastSaved,
  versions,
  isLoadingVersions,
  onRestoreVersion,
}: MainContentGridProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Side - Form or JSON Editor (2 columns) */}
      <div className="xl:col-span-2 space-y-6">
        {editorMode === 'visual' ? (
          <VisualFormBuilderV2 initialData={promptData} onChange={onPromptChange} />
        ) : (
          <JsonEditor value={jsonData} onChange={onJsonChange} />
        )}
      </div>

      {/* Right Side - Validation & Actions (1 column) */}
      <div className="space-y-6">
        {/* Actions Card */}
        <EditorActions onSave={onSave} onExport={onExport} isSaving={isSaving} canSave={canSave} />

        {/* Share Section (only in edit mode) */}
        {isEditMode && (
          <ShareSection shareUrl={shareUrl} isPublic={isPublic} lastSaved={lastSaved} />
        )}

        <ValidationCard
          validationResult={validationResult}
          getValidationSummary={getValidationSummary}
        >
          <ValidationPanel result={validationResult} />
        </ValidationCard>

        {/* Version History (only in edit mode) */}
        {isEditMode && (
          <VersionHistory
            versions={versions}
            isLoading={isLoadingVersions}
            onRestore={onRestoreVersion}
          />
        )}

        {editorMode === 'visual' && <JsonPreview data={promptData} />}
      </div>
    </div>
  );
}
