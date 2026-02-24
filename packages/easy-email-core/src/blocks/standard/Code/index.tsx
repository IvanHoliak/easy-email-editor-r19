import React from 'react';
import { IBlockData } from '@core/typings';
import { BasicType } from '@core/constants';
import { createBlock } from '@core/utils/createBlock';
import { merge } from 'lodash';
import { BasicBlock } from '@core/components/BasicBlock';
import { t } from '@core/utils';

export type ICode = IBlockData<
  {
    color?: string;
    'font-size'?: string;
    'line-height'?: string;
    'container-background-color'?: string;
    padding?: string;
    align?: string;
  },
  {
    content: string;
  }
>;

export const Code = createBlock<ICode>({
  get name() {
    return t('Code');
  },
  type: BasicType.CODE,
  create: payload => {
    const defaultData: ICode = {
      type: BasicType.CODE,
      data: {
        value: {
          content: "console.log('Hello, World!');",
        },
      },
      attributes: {
        padding: '10px 25px 10px 25px',
        align: 'left',
      },
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.COLUMN, BasicType.HERO],
  render(params) {
    const { data } = params;
    return (
      <BasicBlock
        params={params}
        tag='mj-text'
      >
        {`<pre style="font-family:'Courier New',Courier,monospace;background-color:#f4f4f4;border-radius:4px;padding:16px;white-space:pre-wrap;word-wrap:break-word;margin:0;font-size:13px;line-height:1.5">${data.data.value.content}</pre>`}
      </BasicBlock>
    );
  },
});
