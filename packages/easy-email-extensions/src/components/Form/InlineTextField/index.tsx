import React, { useEffect } from 'react';
import { ContentEditableType, DATA_CONTENT_EDITABLE_TYPE, getShadowRoot, useEditorProps } from '@ivanholiak/easy-email-editor';
import { useField, useForm } from 'react-final-form';
import { MergeTagBadge } from '@ivanholiak/easy-email-editor';

export interface InlineTextProps {
  idx: string;
  children?: React.ReactNode;
  onChange: (content: string) => void;
}

export function InlineText({ idx, onChange, children }: InlineTextProps) {
  const {
    mutators: { setFieldTouched },
  } = useForm();
  const { enabledMergeTagsBadge, mergeTagGenerate } = useEditorProps();

  useField(idx); // setFieldTouched will be work while register field,

  useEffect(() => {
    const shadowRoot = getShadowRoot();

    const onPaste = (e: ClipboardEvent) => {
      if (!(e.target instanceof Element) || !e.target.getAttribute('contenteditable')) return;
      e.preventDefault();

      const text = e.clipboardData?.getData('text/plain') || '';
      document.execCommand('insertHTML', false, text);
      const contentEditableType = e.target.getAttribute(DATA_CONTENT_EDITABLE_TYPE);
      if (contentEditableType === ContentEditableType.RichText) {
        onChange(e.target.innerHTML || '');
      } else if (contentEditableType === ContentEditableType.Text) {
        onChange(e.target.textContent?.trim() || '');
      }
    };

    const onInput = (e: Event) => {
      if (e.target instanceof Element && e.target.getAttribute('contenteditable')) {

        const contentEditableType = e.target.getAttribute(DATA_CONTENT_EDITABLE_TYPE);
        if (contentEditableType === ContentEditableType.RichText) {
          onChange(e.target.innerHTML || '');
        } else if (contentEditableType === ContentEditableType.Text) {
          onChange(e.target.textContent?.trim() || '');
        }
      }
    };

    const onDrop = (e: DragEvent) => {
      const target = e.target as Element;
      if (!target || !target.getAttribute('contenteditable')) return;

      // Check if this is a merge tag drop
      const mergeTagText = e.dataTransfer?.getData('text/merge-tag') || e.dataTransfer?.getData('text/plain');

      if (mergeTagText && (mergeTagText.startsWith('{{') || mergeTagText.includes('{{'))) {
        e.preventDefault();
        e.stopPropagation();

        const contentEditableType = target.getAttribute(DATA_CONTENT_EDITABLE_TYPE);
        let insertText = mergeTagText;

        // If enabledMergeTagsBadge, transform the merge tag
        if (enabledMergeTagsBadge && mergeTagGenerate) {
          // Extract merge tag key from {{key}} format
          const match = mergeTagText.match(/{{([^}]+)}}/);
          if (match && match[1]) {
            const mergeTagKey = match[1].trim();
            const generatedTag = mergeTagGenerate(mergeTagKey);
            insertText = MergeTagBadge.transform(generatedTag);
          } else {
            insertText = MergeTagBadge.transform(mergeTagText);
          }
        }

        // Insert the merge tag at cursor position
        document.execCommand('insertHTML', false, insertText);

        // Update the content
        if (contentEditableType === ContentEditableType.RichText) {
          onChange(target.innerHTML || '');
        } else if (contentEditableType === ContentEditableType.Text) {
          onChange(target.textContent?.trim() || '');
        }
      }
    };

    const onDragOver = (e: DragEvent) => {
      const target = e.target as Element;
      if (target && target.getAttribute('contenteditable')) {
        // Check if this is a merge tag drag
        const mergeTagText = e.dataTransfer?.getData('text/merge-tag') || e.dataTransfer?.getData('text/plain');
        if (mergeTagText && (mergeTagText.startsWith('{{') || mergeTagText.includes('{{'))) {
          e.preventDefault();
          e.dataTransfer!.dropEffect = 'copy';
        }
      }
    };

    shadowRoot.addEventListener('paste', onPaste as any, true);
    shadowRoot.addEventListener('input', onInput);
    shadowRoot.addEventListener('drop', onDrop as any, true);
    shadowRoot.addEventListener('dragover', onDragOver as any, true);

    return () => {
      shadowRoot.removeEventListener('paste', onPaste as any, true);
      shadowRoot.removeEventListener('input', onInput);
      shadowRoot.removeEventListener('drop', onDrop as any, true);
      shadowRoot.removeEventListener('dragover', onDragOver as any, true);
    };
  }, [onChange, setFieldTouched, enabledMergeTagsBadge, mergeTagGenerate]);

  return <>{children}</>;
}
