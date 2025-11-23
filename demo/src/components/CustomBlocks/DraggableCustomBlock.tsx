import React from 'react';
import { BlockAvatarWrapper } from 'easy-email-editor';
import { CustomBlocksType } from './constants';
import { Typography } from '@arco-design/web-react';

/**
 * Example of a draggable custom block component
 * This component can be used in custom displayType sections
 */
export interface DraggableCustomBlockProps {
  type: string;
  payload?: any;
  title?: string;
  children: React.ReactNode;
  canDragAndDrop?: boolean;
}

/**
 * Wrapper component for creating draggable custom blocks
 * Use this in custom displayType sections to make components draggable
 */
export function DraggableCustomBlock({
  type,
  payload,
  title,
  children,
  canDragAndDrop = true,
}: DraggableCustomBlockProps) {
  const blockContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {children}
      {title && (
        <Typography.Text style={{ fontSize: '12px', textAlign: 'center' }}>
          {title}
        </Typography.Text>
      )}
    </div>
  );

  return (
    <div
      style={{
        padding: '10px',
        border: '1px solid rgb(229, 229, 229)',
        borderRadius: '4px',
        margin: '5px',
        cursor: canDragAndDrop ? 'grab' : 'not-allowed',
        minWidth: '100px',
        opacity: canDragAndDrop ? 1 : 0.6,
      }}
    >
      {canDragAndDrop ? (
        <BlockAvatarWrapper
          type={type}
          payload={payload}
        >
          {blockContent}
        </BlockAvatarWrapper>
      ) : (
        blockContent
      )}
    </div>
  );
}

/**
 * Example: Marketing Campaigns Panel with draggable campaign blocks
 */
export function MarketingCampaignsPanel({
  searchQuery,
  onSearchChange,
}: {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}) {
  const campaigns = [
    { id: '1', name: 'Summer Sale', type: CustomBlocksType.CAMPAIGN_BLOCK },
    { id: '2', name: 'New Arrivals', type: CustomBlocksType.CAMPAIGN_BLOCK },
    { id: '3', name: 'Limited Offer', type: CustomBlocksType.CAMPAIGN_BLOCK },
  ];

  const filteredCampaigns = campaigns.filter(
    campaign =>
      !searchQuery || campaign.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type='text'
          placeholder='Search campaigns...'
          value={searchQuery || ''}
          onChange={e => onSearchChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredCampaigns.map(campaign => (
          <DraggableCustomBlock
            key={campaign.id}
            type={campaign.type}
            payload={undefined}
            title={campaign.name}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fff3e0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              🎯
            </div>
          </DraggableCustomBlock>
        ))}
      </div>
    </div>
  );
}

/**
 * Example: Product Showcase Panel with draggable product blocks
 */
export function ProductShowcasePanel({
  searchQuery,
  onSearchChange,
}: {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}) {
  const products = [
    { id: '1', name: 'Featured Products', type: CustomBlocksType.PRODUCT_RECOMMENDATION },
    { id: '2', name: 'Best Sellers', type: CustomBlocksType.PRODUCT_RECOMMENDATION },
    { id: '3', name: 'New Releases', type: CustomBlocksType.PRODUCT_RECOMMENDATION },
  ];

  const filteredProducts = products.filter(
    product =>
      !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type='text'
          placeholder='Search products...'
          value={searchQuery || ''}
          onChange={e => onSearchChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredProducts.map(product => (
          <DraggableCustomBlock
            key={product.id}
            type={product.type}
            payload={undefined}
            title={product.name}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#e3f2fd',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              🛍️
            </div>
          </DraggableCustomBlock>
        ))}
      </div>
    </div>
  );
}
