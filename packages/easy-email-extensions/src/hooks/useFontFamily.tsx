import { useEditorContext, useEditorProps } from '@ivanholiak/easy-email-editor';
import React, { useMemo } from 'react';
import { GOOGLE_FONTS } from '@extensions/constants/googleFonts';

export function useFontFamily() {
  const { fontList: defaultFontList } = useEditorProps();
  const { pageData } = useEditorContext();

  const addFonts = pageData.data.value.fonts;

  const fontList = useMemo(() => {
    const fonts: Array<{
      value: string;
      label: React.ReactNode;
    }> = [];
    const seen = new Set<string>();

    if (addFonts) {
      for (const item of addFonts) {
        if (!seen.has(item.name)) {
          seen.add(item.name);
          fonts.push({ value: item.name, label: item.name });
        }
      }
    }

    if (defaultFontList) {
      for (const item of defaultFontList) {
        if (!seen.has(item.value)) {
          seen.add(item.value);
          fonts.push({ value: item.value, label: item.label });
        }
      }
    }

    for (const font of GOOGLE_FONTS) {
      if (!seen.has(font)) {
        seen.add(font);
        fonts.push({ value: font, label: font });
      }
    }

    return fonts.map(item => ({ value: item.value, label: <span style={{ fontFamily: item.value }}>{item.label}</span> }));
  }, [addFonts, defaultFontList]);

  return {
    fontList
  };
}
