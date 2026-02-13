import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useFocusIdx, useEditorProps, useEditorContext } from '@ivanholiak/easy-email-editor';
import { Field } from 'react-final-form';
import { Select, Form } from '@arco-design/web-react';
import { GOOGLE_FONTS, loadGoogleFont, loadGoogleFontsPreview } from '@extensions/constants/googleFonts';

export function FontFamily({ name }: { name?: string }) {
  const { focusIdx } = useFocusIdx();
  const { fontList: defaultFontList } = useEditorProps();
  const { pageData } = useEditorContext();
  const [searchValue, setSearchValue] = useState('');

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

  // Load font previews for the first visible batch and on search
  useEffect(() => {
    const search = searchValue.toLowerCase();
    const visible = search
      ? allOptions.filter(opt => opt.value.toLowerCase().includes(search))
      : allOptions;

    const fontsToLoad = visible
      .slice(0, 15)
      .map(opt => opt.value)
      .filter(f => GOOGLE_FONTS.includes(f));

    if (fontsToLoad.length > 0) {
      loadGoogleFontsPreview(fontsToLoad);
    }
  }, [searchValue, allOptions]);

  const handleSearch = useCallback((val: string) => {
    setSearchValue(val);
  }, []);

  const fieldName = name || `${focusIdx}.attributes.font-family`;

  return (
    <Field name={fieldName}>
      {({ input: { onChange, onBlur, value } }) => (
        <Form.Item
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
            filterOption={(inputValue, option) => {
              const optValue = ((option as any).props?.value || '').toLowerCase();
              return optValue.includes(inputValue.toLowerCase());
            }}
            virtualListProps={{ height: 256 }}
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
