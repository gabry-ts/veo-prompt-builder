import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onCancel: () => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedCount, onDelete, onCancel }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white rounded-lg shadow-2xl px-6 py-4 flex items-center gap-4 z-50 animate-slide-up">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? 'prompt' : 'prompts'} selected
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedCount}{' '}
              {selectedCount === 1 ? 'prompt' : 'prompts'}? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionBar;
