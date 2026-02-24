import React from 'react';
import { Stack } from '@ivanholiak/easy-email-editor';
import { AdvancedType } from '@ivanholiak/easy-email-core';
import { BlockMaskWrapper } from '@extensions/ShortcutToolbar/components/BlockMaskWrapper';

export function CodeBlockItem() {
  return (
    <Stack.Item fill>
      <Stack vertical>
        <Stack.Item fill>
          <BlockMaskWrapper
            type={AdvancedType.CODE}
            payload={{
              data: {
                value: {
                  content: "const greet = (name) => {\n  console.log(`Hello, ${name}!`);\n};\ngreet('World');",
                },
              },
            }}
          >
            <div
              style={{
                backgroundColor: '#f4f4f4',
                borderRadius: 4,
                padding: '12px 16px',
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: 12,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                color: '#333',
              }}
            >
              {'const greet = (name) => {\n  console.log(`Hello, ${name}!`);\n};'}
            </div>
          </BlockMaskWrapper>
        </Stack.Item>
      </Stack>
    </Stack.Item>
  );
}
