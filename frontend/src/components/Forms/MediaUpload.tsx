import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Button from '../UI/Button';
import { useTranslation } from 'react-i18next';

interface MediaUploadProps {
  onUpload: (file: File) => void;
  onClose: () => void;
  loading?: boolean;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onUpload, onClose, loading = false }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Crear preview para imágenes
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(droppedFile);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-48 rounded-lg"
            />
            <p className="text-sm text-gray-600">{file?.name}</p>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              <X className="w-4 h-4 inline mr-1" />
              {t('media.remove')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
              >
                <span>{t('media.uploadFile')}</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </label>
              <p className="pl-1">{t('media.dragDrop')}</p>
            </div>
            <p className="text-xs text-gray-500">
              {t('media.supportedFormats')}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!file || loading}
          loading={loading}
        >
          {t('media.upload')}
        </Button>
      </div>
    </div>
  );
};

export default MediaUpload;