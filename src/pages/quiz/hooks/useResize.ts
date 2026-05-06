import { useState, useEffect, useCallback } from 'react';

export const useResize = () => {
  const [previewWidth, setPreviewWidth] = useState(40); // 40% width for preview
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const container = document.getElementById('main-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const newWidth = ((rect.right - e.clientX) / rect.width) * 100;
        setPreviewWidth(Math.min(Math.max(newWidth, 20), 60));
      }
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return { previewWidth, isResizing, setIsResizing };
};