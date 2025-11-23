import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface Props
  extends React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > {
  children: React.ReactNode;
  title?: string;
  windowRef?: (e: Window) => void;
}

// Escape HTML to prevent XSS
const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const IframeComponent = ({ children, title, windowRef, ...props }: Props) => {
  const [mountNode, setMountNode] = useState(null);

  const onLoad: React.ReactEventHandler<HTMLIFrameElement> = evt => {
    const contentWindow = (evt.target as any)?.contentWindow;
    if (!contentWindow) return;
    windowRef?.(contentWindow);
    const innerBody = contentWindow.document.body;
    innerBody.style.backgroundColor = 'transparent';
    // Set document title if provided
    if (title) {
      contentWindow.document.title = title;
    }
    setMountNode(innerBody);
  };

  const defaultTitle = title || 'Email Preview';
  const escapedTitle = escapeHtml(defaultTitle);
  const srcDoc = `<!doctype html> <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head><title>${escapedTitle}</title></head> <body> </body> </html>`;

  return (
    <iframe
      title={title}
      srcDoc={srcDoc}
      {...(props as any)}
      onLoad={onLoad}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};
