# Easy Email Editor - React 19

<br>
<p align="center">
  <a aria-label="Easy email logo" href="https://github.com/IvanHoliak/easy-email-editor-r19">
    <img src="./logo_text.svg" width="300">
  </a>
</p>
<br>

<p align="center">

  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
  <a aria-label="React version" href="https://react.js">
    <img alt="" src="https://img.shields.io/badge/React-19+-blue.svg">
  </a>
  <a aria-label="MJML" href="https://mjml.io/">
    <img src="https://img.shields.io/badge/MJML-awesome-rgb(120 33 117).svg">
  </a>
  <a aria-label="Package size" href="https://www.typescriptlang.org/">
    <img alt="Using TypeScript" src="https://img.shields.io/badge/%3C/%3E-TypeScript-brightgreenred.svg">
  </a>
</p>

---

## ⚡ React 19 Support

This fork is fully migrated to **React 19** with full compatibility and all features working, including preview functionality.

## Original Project

Based on the original [Easy Email](https://github.com/zalify/easy-email) project by [@m-Ryan](https://github.com/m-Ryan).

## Free email templates for MJML and HTML

<a href="https://github.com/Easy-Email-Pro/email-templates" target="_blank">Check it out here</a>.

## Introduction

Easy Email Editor is developed based on [MJML](https://mjml.io/) and has excellent compatibility. It allows you to generate responsive email code through drag-and-drop editing.

**This version includes:**

- ✅ Full React 19 support
- ✅ Updated dependencies and peer dependencies
- ✅ All features working including preview
- ✅ Fixed hydration issues
- ✅ Modern React patterns (createRoot, etc.)

|                  Video Overview                  |
| :----------------------------------------------: |
| <img src="./StandardLayout.png" alt="Overview" > |

## Getting started

### Installation

```sh
npm install --save @ivanholiak/easy-email-core @ivanholiak/easy-email-editor @ivanholiak/easy-email-extensions react-final-form
```

**Requirements:**

- React 19+ (^19.0.0)
- React DOM 19+ (^19.0.0)

### Usage

```js
import React from 'react';
import { BlockManager, BasicType, AdvancedType } from '@ivanholiak/easy-email-core';
import { EmailEditor, EmailEditorProvider } from '@ivanholiak/easy-email-editor';
import { ExtensionProps, StandardLayout } from '@ivanholiak/easy-email-extensions';

import '@ivanholiak/easy-email-editor/lib/style.css';
import '@ivanholiak/easy-email-extensions/lib/style.css';
import '@arco-themes/react-easy-email-theme/css/arco.css';

const initialValues = {
  subject: 'Welcome to Easy-email',
  subTitle: 'Nice to meet you!',
  content: BlockManager.getBlockByType(BasicType.PAGE)!.create({}),
};

export default function App() {

  return (
    <EmailEditorProvider
      data={initialValues}
      height={'calc(100vh - 72px)'}
      autoComplete
      dashed={false}
    >
      {({ values }) => {
        return (
          <StandardLayout
            showSourceCode={true}
          >
            <EmailEditor />
          </StandardLayout>
        );
      }}
    </EmailEditorProvider>
  );
}


```

</br>

## Configuration

| property      | Type                                                                                               | Description                                   |
| ------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| height        | string / number                                                                                    | Set the height of the container               |
| data          | interface IEmailTemplate { content: IPage; subject: string; subTitle: string; }                    | Source data                                   |
| children      | ( props: FormState<T>,helper: FormApi<IEmailTemplate, Partial<IEmailTemplate>>) => React.ReactNode | ReactNode                                     |
| onSubmit      | Config<IEmailTemplate, Partial<IEmailTemplate>>['onSubmit'];                                       | Called when the commit is triggered manually  |
| fontList      | { value: string; label: string; }[];                                                               | Default font list.                            |
| onUploadImage | (data: Blob) => Promise<string>;                                                                   | Triggered when an image is pasted or uploaded |

</br>

## Custom Draggable Blocks

You can add custom draggable components to the editor sidebar using the `displayType: 'custom'` option in categories. This allows you to create your own draggable blocks that can be dropped into the email editor.

> **Note:** The examples in the `demo/src/components/CustomBlocks` folder are just demonstration examples. You should create your own custom blocks based on your specific needs.

### Basic Usage

There are two ways to create draggable custom blocks:

#### Method 1: Using a draggable block object

```js
import { ExtensionProps } from '@ivanholiak/easy-email-extensions';
import { BlockAvatarWrapper } from '@ivanholiak/easy-email-editor';

const categories: ExtensionProps['categories'] = [
  {
    label: 'Opportunities',
    active: true,
    displayType: 'custom',
    blocks: [
      {
        type: 'your-custom-block-type',
        payload: {
          /* optional payload */
        },
        title: 'Custom Block',
        canDragAndDrop: true, // Optional: defaults to true
        children: (
          <div style={{ padding: '10px', textAlign: 'center' }}>
            <div>📦</div>
            <div>Custom Block</div>
          </div>
        ),
      },
    ],
  },
];
```

#### Method 2: Using React components with BlockAvatarWrapper

```js
import { BlockAvatarWrapper } from '@ivanholiak/easy-email-editor';
import React from 'react';

function CustomDraggableBlock({ type, payload, title }) {
  return (
    <BlockAvatarWrapper
      type={type}
      payload={payload}
    >
      <div style={{ padding: '10px', textAlign: 'center' }}>
        <div>📦</div>
        <div>{title}</div>
      </div>
    </BlockAvatarWrapper>
  );
}

const categories: ExtensionProps['categories'] = [
  {
    label: 'Marketing Campaigns',
    active: true,
    displayType: 'custom',
    blocks: [
      <CustomDraggableBlock
        key='block-1'
        type='your-custom-block-type'
        payload={undefined}
        title='Campaign Block'
      />,
    ],
  },
  {
    label: 'Product Showcase',
    active: true,
    displayType: 'custom',
    blocks: [
      {
        type: 'product-recommendation',
        payload: undefined,
        title: 'Product Grid',
        canDragAndDrop: true, // Optional: defaults to true
        children: (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div>🛍️</div>
            <div>Product Grid</div>
          </div>
        ),
      },
      {
        type: 'read-only-block',
        payload: undefined,
        title: 'Read Only Block',
        canDragAndDrop: false, // This block cannot be dragged
        children: (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div>🔒</div>
            <div>Read Only</div>
          </div>
        ),
      },
    ],
  },
];
```

### Complete Example

Here's a complete example with separate marketing campaigns and product showcase panels:

```js
import React, { useState } from 'react';
import { BlockAvatarWrapper } from '@ivanholiak/easy-email-editor';
import { ExtensionProps, StandardLayout } from '@ivanholiak/easy-email-extensions';

function MarketingCampaignsPanel({ searchQuery, onSearchChange }) {
  const campaigns = [
    { id: '1', name: 'Summer Sale', type: 'campaign-block' },
    { id: '2', name: 'New Arrivals', type: 'campaign-block' },
    { id: '3', name: 'Limited Offer', type: 'campaign-block' },
  ];

  const filtered = campaigns.filter(
    campaign =>
      !searchQuery || campaign.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={{ padding: '10px' }}>
      <input
        type='text'
        placeholder='Search campaigns...'
        value={searchQuery || ''}
        onChange={e => onSearchChange?.(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(campaign => (
          <div
            key={campaign.id}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'grab',
            }}
          >
            <BlockAvatarWrapper
              type={campaign.type}
              payload={undefined}
            >
              <div style={{ textAlign: 'center' }}>
                <div>🎯</div>
                <div>{campaign.name}</div>
              </div>
            </BlockAvatarWrapper>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductShowcasePanel({ searchQuery, onSearchChange }) {
  const products = [
    { id: '1', name: 'Featured Products', type: 'product-recommendation' },
    { id: '2', name: 'Best Sellers', type: 'product-recommendation' },
    { id: '3', name: 'New Releases', type: 'product-recommendation' },
  ];

  const filtered = products.filter(
    product =>
      !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={{ padding: '10px' }}>
      <input
        type='text'
        placeholder='Search products...'
        value={searchQuery || ''}
        onChange={e => onSearchChange?.(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(product => (
          <div
            key={product.id}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'grab',
            }}
          >
            <BlockAvatarWrapper
              type={product.type}
              payload={undefined}
            >
              <div style={{ textAlign: 'center' }}>
                <div>🛍️</div>
                <div>{product.name}</div>
              </div>
            </BlockAvatarWrapper>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [campaignSearchQuery, setCampaignSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  const categories: ExtensionProps['categories'] = [
    // ... other categories
    {
      label: 'Marketing Campaigns',
      active: true,
      displayType: 'custom',
      blocks: [
        <MarketingCampaignsPanel
          key='marketing-campaigns-panel'
          searchQuery={campaignSearchQuery}
          onSearchChange={setCampaignSearchQuery}
        />,
      ],
    },
    {
      label: 'Product Showcase',
      active: true,
      displayType: 'custom',
      blocks: [
        <ProductShowcasePanel
          key='product-showcase-panel'
          searchQuery={productSearchQuery}
          onSearchChange={setProductSearchQuery}
        />,
        // You can also add direct draggable block objects
        {
          type: 'product-recommendation',
          payload: undefined,
          title: 'Product Grid',
          canDragAndDrop: true, // Optional: defaults to true
          children: (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div>📦</div>
              <div>Product Grid</div>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <EmailEditorProvider data={initialValues}>
      {({ values }) => (
        <StandardLayout categories={categories}>
          <EmailEditor />
        </StandardLayout>
      )}
    </EmailEditorProvider>
  );
}
```

### Important Notes

1. **Create Your Own Blocks**: The `CustomBlocks` folder in the demo is just an example. You need to create your own custom blocks based on your requirements. Each custom block should:

   - Be defined using `createCustomBlock()` from `@ivanholiak/easy-email-core`
   - Have a unique `type` identifier
   - Define `validParentType` to specify where it can be inserted
   - Implement `create()` method to generate default block data
   - Optionally implement `render()` method for custom rendering

2. **Block Registration**: The `type` property must match a registered block type in `BlockManager`. **You must register your custom blocks BEFORE using them in categories.** Import the registration file at the top of your component:

   ```js
   // Import custom blocks to register them
   import './components/CustomBlocks';

   // Then use them in categories
   const categories = [
     /* ... */
   ];
   ```

3. **validParentType**: Custom blocks must have a `validParentType` array that specifies where they can be inserted. For example:

   ```js
   validParentType: [BasicType.PAGE, AdvancedType.WRAPPER, BasicType.WRAPPER];
   ```

4. **canDragAndDrop**: The `canDragAndDrop` property is optional and defaults to `true`. Set it to `false` to disable drag-and-drop for a specific block. When `false`, the block will be displayed with reduced opacity and a "not-allowed" cursor.

   ```js
   {
     type: 'my-block',
     canDragAndDrop: false, // This block cannot be dragged
     children: <MyComponent />
   }
   ```

5. **Payload**: The `payload` property is optional and will be passed to the block's `create` method when the block is dropped. You can use this to pass initial data to your custom block.

6. **Safe Data Access**: Always use safe data access in your `render` method to prevent errors when data is incomplete:

   ```js
   render: ({ data, idx, mode }) => {
     // Safe data access with fallbacks
     const value = data?.data?.value || {};
     const attributes = data?.attributes || {};

     const title = value.title || 'Default Title';
     const description = value.description || 'Default Description';

     // Your render logic here
   };
   ```

7. **Ensure Data Structure in create()**: Always ensure your `create` method returns a complete data structure:

   ```js
   create: payload => {
     const defaultData = {
       type: 'my-block',
       data: {
         value: {
           // your default values
         },
       },
       attributes: {
         // your default attributes
       },
       children: [],
     };
     const merged = mergeBlock(defaultData, payload);
     // Ensure all required fields exist
     if (!merged.data?.value) {
       merged.data = merged.data || {};
       merged.data.value = merged.data.value || defaultData.data.value;
     }
     if (!merged.attributes) {
       merged.attributes = defaultData.attributes;
     }
     if (!Array.isArray(merged.children)) {
       merged.children = [];
     }
     return merged;
   };
   ```

8. **Children**: For draggable block objects, the `children` property should be a React node that will be displayed in the sidebar.

9. **Mixed Usage**: You can mix React components and draggable block objects in the same custom section.

10. **Drop Zones**: Drop zones will only appear if:

- The block is registered in `BlockManager`
- The block has valid `validParentType` configuration
- The block type matches a valid parent in the email structure

## Development

```sh
# Clone the repository
git clone https://github.com/IvanHoliak/easy-email-editor-r19.git
cd easy-email-editor-r19

# Install dependencies
pnpm install
pnpm run install-all

# Build packages
pnpm run build

# Run development server
pnpm run dev
```

## Migration from original Easy Email

If you're migrating from the original `easy-email` packages:

1. Update package names:

   - `easy-email-core` → `@ivanholiak/easy-email-core`
   - `easy-email-editor` → `@ivanholiak/easy-email-editor`
   - `easy-email-extensions` → `@ivanholiak/easy-email-extensions`

2. Update React to version 19+:

   ```sh
   npm install react@^19.0.0 react-dom@^19.0.0
   ```

3. Update your imports in your code

## Contributing

If you need new features or find bugs, we welcome you to submit a PR or open an issue!

## License

The MIT License

## Credits

Original project by [@m-Ryan](https://github.com/m-Ryan) - [Easy Email](https://github.com/zalify/easy-email)
