import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';


interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          icon: 'text-amber-600',
          button: 'bg-amber-600 hover:bg-amber-700',
        };
      default:
        return {
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md">
        <Card className="p-6">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full bg-${type === 'danger' ? 'red' : type === 'warning' ? 'amber' : 'blue'}-100`}>
              <AlertTriangle className={`w-6 h-6 ${typeStyles.icon}`} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 ${typeStyles.button}`}
            >
              {confirmText}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};