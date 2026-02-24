import React, { useCallback } from 'react';

export interface MergeTagDraggableProps {
  mergeTag: string;
  children: React.ReactNode;
}

export const MergeTagDraggable: React.FC<MergeTagDraggableProps> = ({ mergeTag, children }) => {
  const value = mergeTag.includes('{{') ? mergeTag : `{{${mergeTag}}}`;

  const onDragStart = useCallback((ev: React.DragEvent) => {
    console.log('[MergeTag] dragStart, value:', value);
    ev.dataTransfer.setData('text/merge-tag', value);
    ev.dataTransfer.setData('text/plain', value);
    ev.dataTransfer.effectAllowed = 'copy';
  }, [value]);

  return (
    <div draggable onDragStart={onDragStart} style={{ cursor: 'grab' }}>
      {children}
    </div>
  );
};
