import React, { useCallback } from 'react';

export interface LinkDraggableProps {
  text: string;
  url: string;
  color?: string;
  underline?: boolean;
  target?: string;
  children: React.ReactNode;
}

export const LinkDraggable: React.FC<LinkDraggableProps> = ({
  text,
  url,
  color = '#0068A5',
  underline = true,
  target = '_blank',
  children,
}) => {
  const onDragStart = useCallback((ev: React.DragEvent) => {
    const payload = JSON.stringify({ text, url, color, underline, target });
    ev.dataTransfer.setData('text/link', payload);
    ev.dataTransfer.setData('text/plain', text);
    ev.dataTransfer.effectAllowed = 'copy';
  }, [text, url, color, underline, target]);

  return (
    <div draggable onDragStart={onDragStart} style={{ cursor: 'grab' }}>
      {children}
    </div>
  );
};
