import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useFocusIdx, useEditorProps, useEditorContext } from '@ivanholiak/easy-email-editor';
import { Field } from 'react-final-form';
import { Select, Form } from '@arco-design/web-react';
import { GOOGLE_FONTS, loadGoogleFont, loadGoogleFontsPreview } from '@extensions/constants/googleFonts';
import './FontFamily.scss';

export function FontFamily({ name }: { name?: string }) {
  const { focusIdx } = useFocusIdx();
  const { fontList: defaultFontList } = useEditorProps();
  const { pageData } = useEditorContext();
  const [searchValue, setSearchValue] = useState('');
  const loadedRef = useRef(new Set<string>());

  const addFonts = pageData.data.value.fonts;

  const allOptions = useMemo(() => {
    const options: Array<{ value: string; label: string }> = [];
    const seen = new Set<string>();

    if (addFonts) {
      for (const font of addFonts) {
        if (!seen.has(font.name)) {
          seen.add(font.name);
          options.push({ value: font.name, label: font.name });
        }
      }
    }

    if (defaultFontList) {
      for (const font of defaultFontList) {
        if (!seen.has(font.value)) {
          seen.add(font.value);
          options.push({ value: font.value, label: font.label });
        }
      }
    }

    for (const font of GOOGLE_FONTS) {
      if (!seen.has(font)) {
        seen.add(font);
        options.push({ value: font, label: font });
      }
    }

    return options;
  }, [addFonts, defaultFontList]);

  const filteredOptions = useMemo(() => {
    if (!searchValue) return allOptions;
    const search = searchValue.toLowerCase();
    return allOptions.filter(opt => opt.value.toLowerCase().includes(search));
  }, [searchValue, allOptions]);

  const loadFontsBatch = useCallback((fonts: Array<{ value: string }>) => {
    const toLoad = fonts
      .map(f => f.value)
      .filter(f => GOOGLE_FONTS.includes(f) && !loadedRef.current.has(f));

    if (toLoad.length > 0) {
      toLoad.forEach(f => loadedRef.current.add(f));
      loadGoogleFontsPreview(toLoad);
    }
  }, []);

  // Load initial batch of visible fonts
  useEffect(() => {
    loadFontsBatch(filteredOptions.slice(0, 20));
  }, [filteredOptions, loadFontsBatch]);

  const handleSearch = useCallback((val: string) => {
    setSearchValue(val);
  }, []);

  const handlePopupScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollRatio = (target.scrollTop + target.clientHeight) / target.scrollHeight;
    if (scrollRatio > 0.7) {
      // Estimate which fonts are visible based on scroll position
      const approxIndex = Math.floor((target.scrollTop / target.scrollHeight) * filteredOptions.length);
      loadFontsBatch(filteredOptions.slice(approxIndex, approxIndex + 20));
    }
  }, [filteredOptions, loadFontsBatch]);

  const fieldName = name || `${focusIdx}.attributes.font-family`;

  return (
    <Field name={fieldName}>
      {({ input: { onChange, onBlur, value } }) => (
        <Form.Item
          className='easy-email-font-family-field'
          label={t('Font family')}
          labelCol={{ span: 24, style: { paddingRight: 0 } }}
          wrapperCol={{ span: 24 }}
          labelAlign='left'
          style={{ margin: 0 }}
        >
          <Select
            showSearch
            allowCreate
            value={value || undefined}
            placeholder={t('Font family')}
            onSearch={handleSearch}
            onChange={(val: string) => {
              loadGoogleFont(val);
              onChange(val);
              onBlur();
              setSearchValue('');
            }}
            onVisibleChange={(visible) => {
              if (visible) {
                loadFontsBatch(filteredOptions.slice(0, 20));
              }
            }}
            filterOption={(inputValue, option) => {
              const optValue = ((option as any).props?.value || '').toLowerCase();
              return optValue.includes(inputValue.toLowerCase());
            }}
            virtualListProps={{
              height: 256,
              onScroll: handlePopupScroll as any,
            }}
            style={{ width: '100%' }}
            dropdownMenuClassName='easy-email-overlay'
            allowClear
          >
            {allOptions.map(font => (
              <Select.Option key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>{font.label}</span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </Field>
  );
}
