import { useParams, useNavigate } from 'react-router-dom';
import {
  PageHeader,
  BasicInfoForm,
  MetadataForm,
  MarkdownPreviewModal,
  JsonPreviewModal,
} from './helpers/PromptEditorHelpers';
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
    tags,
    setTags,
    isFavorite,
    setIsFavorite,
    rating,
    setRating,
    isPublic,
    setIsPublic,
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
    shareUrl,
    versions,
    isLoadingVersions,
    handleRestoreVersion,
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
      <MetadataForm
        tags={tags}
        onTagsChange={setTags}
        rating={rating}
        onRatingChange={setRating}
        isFavorite={isFavorite}
        onFavoriteChange={setIsFavorite}
        isPublic={isPublic}
        onPublicChange={setIsPublic}
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
        onPromptChange={handlePromptChange}
        onJsonChange={setJsonData}
        onSave={handleSave}
        onExport={handleExport}
        onMarkdownPreview={handleMarkdownPreview}
        isSaving={isSaving}
        canSave={!!name}
        isEditMode={isEditMode}
        shareUrl={shareUrl}
        isPublic={isPublic}
        lastSaved={lastSaved}
        versions={versions}
        isLoadingVersions={isLoadingVersions}
        onRestoreVersion={handleRestoreVersion}
      />
      {showMarkdownModal && markdownPreview !== null && (
        <MarkdownPreviewModal
          markdown={markdownPreview}
          onClose={handleCloseMarkdownModal}
          onDownload={handleMarkdownDownload}
        />
      )}
      {showJsonModal && jsonPreview !== null && (
        <JsonPreviewModal
          json={jsonPreview}
          onClose={handleCloseJsonModal}
          onDownload={handleJsonDownload}
        />
      )}
    </div>
  );
}

export default PromptEditorPage;
