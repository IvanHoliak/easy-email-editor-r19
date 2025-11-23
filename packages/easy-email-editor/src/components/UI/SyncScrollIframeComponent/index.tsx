import { SYNC_SCROLL_ELEMENT_CLASS_NAME } from '@/constants';
import { useDomScrollHeight } from '@/hooks/useDomScrollHeight';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
  title?: string;
  windowRef?: (e: Window) => void;
  isActive?: boolean;
  style?: React.CSSProperties;
}

export const SyncScrollIframeComponent = ({
  children,
  title,
  windowRef,
  isActive,
  style,
}: Props) => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [contentWindow, setContentWindow] = useState<Window | null>(null);
  const { viewElementRef } = useDomScrollHeight();
  const [ref, setRef] = useState<null | HTMLDivElement>(null);

  const setFirstVisibleEle = useCallback(
    debounce((root: Document) => {
      if (!ref) return;

      const { top: containerTop } = ref.getBoundingClientRect();
      const ele = root.elementFromPoint(0, 10);

      const findSelectorNode = (ele: Element): Element | null => {
        if (ele.getAttribute('data-selector')) {
          return ele;
        }
        if (ele.parentNode instanceof Element) {
          return findSelectorNode(ele.parentNode);
        }
        return null;
      };
      const selectorNode = ele && findSelectorNode(ele);
      viewElementRef.current = null;
      if (selectorNode) {
        const { top: selectorEleTop } = selectorNode.getBoundingClientRect();
        let selectorDiffTop = selectorEleTop - containerTop;

        const selector = selectorNode.getAttribute('data-selector');

        if (selector) {
          viewElementRef.current = {
            selector: selector || '',
            top: selectorDiffTop,
          };
        }
      }
    }, 200),
    [viewElementRef, ref],
  );

  const onLoad: React.ReactEventHandler<HTMLIFrameElement> = useCallback(
    evt => {
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
      setContentWindow(contentWindow);
    },
    [windowRef, title],
  );

  useEffect(() => {
    if (!isActive || !mountNode) return;

    const viewElement = viewElementRef.current;

    const scrollEle = mountNode.querySelector(`.${SYNC_SCROLL_ELEMENT_CLASS_NAME}`);
    if (!scrollEle) return;

    if (viewElement) {
      const viewElementNode = mountNode.querySelector(
        `[data-selector="${viewElement?.selector}"]`,
      );

      if (viewElementNode && scrollEle) {
        viewElementNode.scrollIntoView();

        scrollEle.scrollTo(0, scrollEle.scrollTop - viewElement.top);
      }
    } else {
      scrollEle.scrollTo(0, 0);
    }
  }, [viewElementRef, mountNode, isActive]);

  useEffect(() => {
    if (!contentWindow?.document.documentElement) return;
    const onScroll = () => {
      if (!isActive) return;
      setFirstVisibleEle(contentWindow.document);
    };
    contentWindow.addEventListener('scroll', onScroll, true);
    return () => {
      contentWindow?.removeEventListener('scroll', onScroll, true);
    };
  }, [contentWindow, isActive, setFirstVisibleEle]);

  // Escape HTML to prevent XSS
  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const defaultTitle = title || 'Email Preview';
  const escapedTitle = escapeHtml(defaultTitle);
  const srcDoc = `<!doctype html> <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head><title>${escapedTitle}</title></head> <body> </body> </html>`;

  return useMemo(() => {
    return (
      <iframe
        ref={setRef}
        title={title}
        srcDoc={srcDoc}
        style={style}
        onLoad={onLoad}
      >
        <>{mountNode && createPortal(children, mountNode)}</>
      </iframe>
    );
  }, [title, style, onLoad, mountNode, children, srcDoc]);
};
