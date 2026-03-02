import React from 'react';
import { LinkDraggable } from 'easy-email-editor';

const OPPORTUNITIES = [
  { text: 'View Opportunity', url: 'https://example.com/opportunities/1', label: 'Opportunity #1' },
  { text: 'View Opportunity', url: 'https://example.com/opportunities/2', label: 'Opportunity #2' },
  { text: 'View Opportunity', url: 'https://example.com/opportunities/3', label: 'Opportunity #3' },
];

export const OpportunitiesPanel: React.FC = () => {
  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Opportunities</div>
      {OPPORTUNITIES.map(opp => (
        <LinkDraggable key={opp.url} text={opp.text} url={opp.url}>
          <div
            style={{
              padding: '6px 10px',
              marginBottom: 4,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 12,
              background: '#f5f5f5',
            }}
          >
            <div style={{ fontWeight: 500 }}>{opp.label}</div>
            <div style={{ color: '#0068A5', textDecoration: 'underline', marginTop: 2 }}>
              {opp.text}
            </div>
          </div>
        </LinkDraggable>
      ))}
    </div>
  );
};
