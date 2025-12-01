import { useParams, useNavigate } from 'react-router-dom';
import { getValidationSummary } from '../utils/veoValidation';
import { PageHeader, BasicInfoForm } from './helpers/PromptEditorHelpers';
import {
  TemplatesSection,
  MainContentGrid,
  EditorModeToggleSection,
} from './helpers/PromptEditorSections';
import { usePromptEditor } from './hooks/usePromptEditor';

function PromptEditorPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
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
    handlePromptChange,
    handleTemplateSelect,
    handleImportJson,
    handleSave,
    handleExport,
    isSaving,
  } = usePromptEditor({ id, onNavigate: navigate });

  return (
    <div className="pb-8">
      <PageHeader isEditMode={isEditMode} onBack={() => navigate('/dashboard')} />
      <BasicInfoForm
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
      />
      <TemplatesSection
        isEditMode={isEditMode}
        name={name}
        showTemplateSelector={showTemplateSelector}
        editorMode={editorMode}
        onSelectTemplate={handleTemplateSelect}
        onSkip={() => setShowTemplateSelector(false)}
        onShowTemplates={() => setShowTemplateSelector(!showTemplateSelector)}
      />
      <EditorModeToggleSection
        editorMode={editorMode}
        onModeChange={setEditorMode}
        onShowTemplates={() => setShowTemplateSelector(!showTemplateSelector)}
        onImportJson={handleImportJson}
      />
      <MainContentGrid
        editorMode={editorMode}
        promptData={promptData}
        jsonData={jsonData}
        validationResult={validationResult}
        getValidationSummary={getValidationSummary}
        onPromptChange={handlePromptChange}
        onJsonChange={setJsonData}
        onSave={handleSave}
        onExport={handleExport}
        isSaving={isSaving}
        canSave={!!name}
      />
    </div>
  );
}

export default PromptEditorPage;
