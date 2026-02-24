import { useEffect, useMemo, useState, useRef } from 'react';

import { getNodeIdxFromClassName } from '@ivanholiak/easy-email-core';
import { getBlockNodeByChildEle } from '@/utils/getBlockNodeByChildEle';
import { useBlock } from '@/hooks/useBlock';
import { getDirectionPosition } from '@/utils/getDirectionPosition';
import { useFocusIdx } from './useFocusIdx';
import { useDataTransfer } from './useDataTransfer';
import { useHoverIdx } from './useHoverIdx';
import { getInsertPosition } from '@/utils/getInsertPosition';
import { useEditorProps } from './useEditorProps';
import { DATA_ATTRIBUTE_DROP_CONTAINER } from '@/constants';
import { getShadowRoot } from '@/utils/getShadowRoot';

const MERGE_TAG_MIME = 'text/merge-tag';

function isMergeTagDrag(ev: DragEvent): boolean {
  return ev.dataTransfer?.types
    ? Array.from(ev.dataTransfer.types).includes(MERGE_TAG_MIME)
    : false;
}

/**
 * Insert merge-tag text into a contenteditable element at the drop coordinates.
 * Tries caretRangeFromPoint first; falls back to appending at the end.
 */
function insertMergeTagAtPoint(x: number, y: number, text: string): void {
  const shadowRoot = getShadowRoot();
  if (!shadowRoot) return;

  // Try to get a caret range at the drop coordinates
  let range: Range | null = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
    // Verify it's inside the shadow DOM
    if (range && !shadowRoot.contains(range.startContainer)) {
      range = null;
    }
  }

  // Find the contenteditable element
  let editableEl: Element | null = null;
  if (range) {
    const node = range.startContainer;
    editableEl = node instanceof Element
      ? node.closest('[contenteditable]')
      : node.parentElement?.closest('[contenteditable]') || null;
  }

  // Fallback: use elementFromPoint on the shadow root
  if (!editableEl) {
    const target = shadowRoot.elementFromPoint(x, y);
    if (target) {
      editableEl = target.closest('[contenteditable]')
        || (target.getAttribute('contenteditable') ? target : null);
    }
    // No valid range for this element, so append at the end
    if (editableEl) {
      range = document.createRange();
      range.selectNodeContents(editableEl);
      range.collapse(false);
    }
  }

  if (!editableEl || !range) return;

  // Insert a text node at the caret position
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  // Normalize adjacent text nodes
  if (textNode.parentNode) {
    textNode.parentNode.normalize();
  }

  // Move cursor after the inserted text
  const sel = (shadowRoot as any).getSelection?.() || window.getSelection();
  if (sel) {
    const newRange = document.createRange();
    // After normalize, textNode may have been merged. Find position by searching
    // for the inserted text within the editable.
    // Simpler: set cursor at the end of the editable's content.
    newRange.selectNodeContents(editableEl);
    newRange.collapse(false);
    sel.removeAllRanges();
    sel.addRange(newRange);
  }

  // Trigger input event so InlineTextField picks up the change
  editableEl.dispatchEvent(new Event('input', { bubbles: true }));
}

export function useDropBlock() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const { values } = useBlock();
  const { autoComplete } = useEditorProps();
  const { dataTransfer, setDataTransfer } = useDataTransfer();
  const cacheValues = useRef(values);
  const cacheDataTransfer = useRef(dataTransfer);

  useEffect(() => {
    cacheValues.current = values;
  }, [values]);

  useEffect(() => {
    cacheDataTransfer.current = dataTransfer;
  }, [dataTransfer]);
  const { setFocusIdx, focusIdx } = useFocusIdx();
  const { setHoverIdx, setDirection, isDragging, hoverIdx, direction } =
    useHoverIdx();

  useEffect(() => {
    if (ref) {
      let target: EventTarget | null = null;
      const onMouseDown = (ev: MouseEvent) => {
        target = ev.target;
      };

      const onClick = (ev: MouseEvent) => {
        ev.preventDefault(); // prevent link
        if (target !== ev.target) return;
        if (ev.target instanceof Element) {
          const target = getBlockNodeByChildEle(ev.target);
          if (!target) return;
          const idx = getNodeIdxFromClassName(target.classList)!;
          setFocusIdx(idx);
          // scrollBlockEleIntoView({ idx });
        }
      };

      ref.addEventListener('mousedown', onMouseDown);
      ref.addEventListener('click', onClick);
      return () => {
        ref.removeEventListener('mousedown', onMouseDown);
        ref.removeEventListener('click', onClick);
      };
    }
  }, [ref, setFocusIdx]);

  useEffect(() => {
    if (ref) {
      let lastHoverTarget: EventTarget | null = null;

      let lastDragover: {
        target: EventTarget | null;
        valid: boolean;
      } = {
        target: null,
        valid: false,
      };

      const onMouseover = (ev: MouseEvent) => {
        if (lastHoverTarget === ev.target) return;
        lastHoverTarget = ev.target;
        const blockNode = getBlockNodeByChildEle(ev.target as HTMLElement);

        if (blockNode) {
          const idx = getNodeIdxFromClassName(blockNode.classList)!;
          setHoverIdx(idx);
        }
      };

      const onDrop = (ev: DragEvent) => {
        // Handle merge tag drop: insert text into contenteditable
        if (isMergeTagDrag(ev)) {
          ev.preventDefault();
          ev.stopPropagation();
          const mergeTagText =
            ev.dataTransfer?.getData(MERGE_TAG_MIME) ||
            ev.dataTransfer?.getData('text/plain') ||
            '';
          if (mergeTagText) {
            insertMergeTagAtPoint(ev.clientX, ev.clientY, mergeTagText);
          }
          return;
        }
        lastDragover.target = null;
      };

      const onDragOver = (ev: DragEvent) => {
        // Allow merge tag drops on contenteditable elements inside the shadow DOM
        if (isMergeTagDrag(ev)) {
          ev.preventDefault();
          if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'copy';
          return;
        }

        if (!cacheDataTransfer.current) return;

        lastDragover.target = ev.target;
        lastDragover.valid = false;

        const blockNode = getBlockNodeByChildEle(ev.target as HTMLDivElement);

        if (blockNode) {
          const directionPosition = getDirectionPosition(ev);
          const idx = getNodeIdxFromClassName(blockNode.classList)!;
          const positionData = getInsertPosition({
            context: cacheValues.current,
            idx,
            directionPosition,
            dragType: cacheDataTransfer.current.type,
          });

          if (positionData) {
            ev.preventDefault();
            lastDragover.valid = true;
            setDataTransfer((dataTransfer: any) => {
              return {
                ...dataTransfer,
                parentIdx: positionData.parentIdx,
                positionIndex: positionData.insertIndex,
              };
            });
            setDirection(positionData.endDirection);
            setHoverIdx(positionData.hoverIdx);
          }
        }
        if (!lastDragover.valid) {
          setDirection('');
          setHoverIdx('');
          setDataTransfer((dataTransfer: any) => {
            return {
              ...dataTransfer,
              parentIdx: undefined,
            };
          });
        }
      };

      const onCheckDragLeave = (ev: DragEvent) => {
        const dropEleList = [
          ...document.querySelectorAll(
            `[${DATA_ATTRIBUTE_DROP_CONTAINER}="true"]`
          ),
        ];
        const target = ev.target as HTMLElement;
        const isDropContainer = dropEleList.some((ele) => ele.contains(target));

        if (!isDropContainer) {
          setDirection('');
          setHoverIdx('');
          setDataTransfer((dataTransfer: any) => {
            return {
              ...dataTransfer,
              parentIdx: undefined,
            };
          });
        }
      };

      ref.addEventListener('mouseover', onMouseover);
      // ref.addEventListener('mouseout', onMouseOut);
      ref.addEventListener('drop', onDrop);
      ref.addEventListener('dragover', onDragOver);
      window.addEventListener('dragover', onCheckDragLeave);

      return () => {
        ref.removeEventListener('mouseover', onMouseover);
        // ref.removeEventListener('mouseout', onMouseOut);
        ref.removeEventListener('drop', onDrop);
        ref.removeEventListener('dragover', onDragOver);
        window.removeEventListener('dragover', onCheckDragLeave);
      };
    }
  }, [
    autoComplete,
    cacheDataTransfer,
    ref,
    setDataTransfer,
    setDirection,
    setHoverIdx,
  ]);

  useEffect(() => {
    if (!ref) return;

    const onMouseOut = (ev: MouseEvent) => {
      if (!isDragging) {
        ev.stopPropagation();
        setHoverIdx('');
      }
    };
    ref.addEventListener('mouseout', onMouseOut);
    return () => {
      ref.removeEventListener('mouseout', onMouseOut);
    };
  }, [isDragging, ref, setHoverIdx]);

  useEffect(() => {
    if (ref) {
      ref.setAttribute('data-dragging', String(isDragging));
      ref.setAttribute('data-direction', direction || 'none');
    }
  }, [direction, isDragging, ref]);

  useEffect(() => {
    if (ref) {
      ref.setAttribute('data-hoverIdx', hoverIdx);
    }
  }, [hoverIdx, ref]);

  useEffect(() => {
    if (ref) {
      ref.setAttribute('data-focusIdx', focusIdx);
    }
  }, [focusIdx, ref]);

  return useMemo(
    () => ({
      setRef,
    }),
    [setRef]
  );
}
