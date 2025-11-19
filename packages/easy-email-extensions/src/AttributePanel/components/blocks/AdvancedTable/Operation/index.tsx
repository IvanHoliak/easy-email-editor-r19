import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import TableColumnTool from './tableTool';
import { getShadowRoot, useBlock, useFocusIdx } from 'easy-email-editor';

export function TableOperation() {
  const shadowRoot = getShadowRoot();
  const { focusIdx } = useFocusIdx();
  const { focusBlock, change } = useBlock();
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const tool = useRef<TableColumnTool>(undefined as unknown as TableColumnTool);
  const [bodyElement, setBodyElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (shadowRoot) {
      const body = shadowRoot.querySelector('body') as HTMLElement;
      setBodyElement(body);
    }
  }, [shadowRoot]);

  useEffect(() => {
    if (!bodyElement) return;

    const borderTool: any = {
      top: topRef.current,
      bottom: bottomRef.current,
      left: leftRef.current,
      right: rightRef.current,
    };
    tool.current = new TableColumnTool(borderTool, bodyElement);
    return () => {
      tool.current?.destroy();
    };
  }, [bodyElement]);

  useEffect(() => {
    if (tool.current) {
      tool.current.changeTableData = (data: any[][]) => {
        change(`${focusIdx}.data.value.tableSource`, cloneDeep(data));
      };
      tool.current.tableData = cloneDeep(focusBlock?.data?.value?.tableSource || []);
    }
  }, [focusIdx, focusBlock, change]);

  return (
    <>
      {bodyElement &&
        createPortal(
          <div>
            <div ref={topRef} />
            <div ref={bottomRef} />
            <div ref={leftRef} />
            <div ref={rightRef} />
          </div>,
          bodyElement,
        )}
    </>
  );
}
