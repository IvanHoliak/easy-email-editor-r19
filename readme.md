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
