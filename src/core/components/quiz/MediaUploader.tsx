import React, { useRef } from 'react';
import { Image, Music, Video, X, Check, Upload, Trash2 } from 'lucide-react';
import type { MediaAttachment } from '../../types/quiz.types';
import { cn } from '../../utils/cn';


interface MediaUploaderProps {
  media: MediaAttachment[];
  questionId: string;
  expandedMediaFor: { questionId: string; type: string } | null;
  onToggleMedia: (questionId: string, type: MediaAttachment['type'], mediaItem?: MediaAttachment) => void;
  onFileUpload: (questionId: string, type: MediaAttachment['type'], file: File) => void;
  onRemoveMedia: (questionId: string, type: MediaAttachment['type'], mediaItem?: MediaAttachment) => void;
  onSetExpanded: (value: { questionId: string; type: string } | null) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  media,
  questionId,
  expandedMediaFor,
  onToggleMedia,
  onFileUpload,
  onRemoveMedia,
  onSetExpanded,
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const mediaTypes = [
    { type: 'image' as const, icon: Image, label: 'Image', color: 'purple', accept: 'image/*' },
    { type: 'audio' as const, icon: Music, label: 'Audio', color: 'orange', accept: 'audio/*' },
    { type: 'video' as const, icon: Video, label: 'Video', color: 'red', accept: 'video/*' }
  ];

  const getValidTypes = (type: string) => {
    const validTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
      video: ['video/mp4', 'video/webm', 'video/ogg']
    };
    return validTypes[type as keyof typeof validTypes];
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { active: string; inactive: string; hover: string }> = {
      purple: {
        active: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
        inactive: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
        hover: 'hover:bg-gray-200 dark:hover:bg-gray-700',
      },
      orange: {
        active: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
        inactive: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
        hover: 'hover:bg-gray-200 dark:hover:bg-gray-700',
      },
      red: {
        active: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
        inactive: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
        hover: 'hover:bg-gray-200 dark:hover:bg-gray-700',
      },
    };
    return colorMap[color] || colorMap.purple;
  };

  const validateFile = (type: string, file: File): boolean => {
    const validTypes = getValidTypes(type);
    if (!validTypes.includes(file.type)) {
      alert(`Please upload a valid ${type} file (${validTypes.map(t => t.split('/')[1]).join(', ')})`);
      return false;
    }

    const maxSize = type === 'image' ? 10 : 20;
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size should be less than ${maxSize}MB`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (type: string, file: File) => {
    if (validateFile(type, file)) {
      onFileUpload(questionId, type as MediaAttachment['type'], file);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {mediaTypes.map(({ type, icon: Icon, label, color, accept }) => {
        const mediaItem = media.find(m => m.type === type);
        const isActive = !!mediaItem;
        const isExpanded = expandedMediaFor?.questionId === questionId && expandedMediaFor?.type === type;
        const colorClasses = getColorClasses(color);
        
        return (
          <div key={type} className="relative">
            <button
              type="button"
              onClick={() => {
                if (isActive) {
                  onSetExpanded(isExpanded ? null : { questionId, type });
                } else {
                  onToggleMedia(questionId, type);
                  onSetExpanded({ questionId, type });
                }
              }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all border',
                isActive ? colorClasses.active : colorClasses.inactive,
                !isActive && colorClasses.hover
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {isActive && <Check className="w-3 h-3" />}
            </button>
            
            {isExpanded && isActive && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">{label} Attachment</h4>
                    <button
                      type="button"
                      onClick={() => onSetExpanded(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {mediaItem?.url ? (
                    <div className="space-y-3">
                      {type === 'image' && (
                        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                          <img src={mediaItem.url} alt="Preview" className="w-full h-auto max-h-40 object-contain" />
                        </div>
                      )}
                      {type === 'audio' && (
                        <audio controls src={mediaItem.url} className="w-full">
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      {type === 'video' && (
                        <video controls src={mediaItem.url} className="w-full rounded-lg max-h-40">
                          Your browser does not support the video element.
                        </video>
                      )}
                      
                      {mediaItem.fileName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{mediaItem.fileName}</p>
                      )}
                      
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            accept={accept}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileSelect(type, file);
                            }}
                          />
                          <span className="flex items-center justify-center gap-1 w-full px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                            <Upload className="w-3 h-3" />
                            Replace
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            onRemoveMedia(questionId, type, mediaItem);
                            onSetExpanded(null);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload {label}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {type === 'image' && 'JPEG, PNG, GIF, WEBP up to 10MB'}
                            {type === 'audio' && 'MP3, WAV, OGG up to 20MB'}
                            {type === 'video' && 'MP4, WebM, OGG up to 20MB'}
                          </p>
                        </div>
                        <input
                          ref={(el) => {
                            if (el) fileInputRefs.current[`${questionId}-${type}`] = el;
                          }}
                          type="file"
                          accept={accept}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(type, file);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MediaUploader;