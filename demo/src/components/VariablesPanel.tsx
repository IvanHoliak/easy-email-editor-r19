import React from 'react';
import { MergeTagDraggable } from 'easy-email-editor';

const EMAIL_VARIABLES = [
  { variable: '{{companyName}}', label: 'Company Name' },
  { variable: '{{recipientFirstName}}', label: 'First Name' },
  { variable: '{{recipientLastName}}', label: 'Last Name' },
];

export const VariablesPanel: React.FC = () => {
  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Variables</div>
      {EMAIL_VARIABLES.map(v => (
        <MergeTagDraggable key={v.variable} mergeTag={v.variable}>
          <div
            style={{
              padding: '6px 10px',
              marginBottom: 4,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 12,
              fontFamily: 'monospace',
              background: '#f5f5f5',
            }}
          >
            {v.variable}
          </div>
        </MergeTagDraggable>
      ))}
    </div>
  );
};
