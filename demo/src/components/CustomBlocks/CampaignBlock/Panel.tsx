import { Stack } from '@demo/components/Stack';
import { useFocusIdx } from 'easy-email-editor';
import {
  AttributesPanelWrapper,
  ColorPickerField,
  TextField,
} from 'easy-email-extensions';
import React from 'react';

export function Panel() {
  const { focusIdx } = useFocusIdx();
  return (
    <AttributesPanelWrapper style={{ padding: '20px' }}>
      <Stack vertical>
        <TextField
          label='Title'
          name={`${focusIdx}.data.value.title`}
          inline
        />
        <TextField
          label='Description'
          name={`${focusIdx}.data.value.description`}
          inline
        />
        <TextField
          label='Button text'
          name={`${focusIdx}.data.value.buttonText`}
          inline
        />
        <TextField
          label='Button URL'
          name={`${focusIdx}.data.value.buttonUrl`}
          inline
        />
        <ColorPickerField
          label='Background color'
          name={`${focusIdx}.attributes.background-color`}
          inline
        />
        <ColorPickerField
          label='Title color'
          name={`${focusIdx}.attributes.title-color`}
          inline
        />
        <ColorPickerField
          label='Button color'
          name={`${focusIdx}.attributes.button-color`}
          inline
        />
        <ColorPickerField
          label='Button text color'
          name={`${focusIdx}.attributes.button-text-color`}
          inline
        />
      </Stack>
    </AttributesPanelWrapper>
  );
}

