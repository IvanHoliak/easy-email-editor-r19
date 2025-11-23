import {
  IBlockData,
  BasicType,
  components,
  createCustomBlock,
  getPreviewClassName,
  AdvancedType,
  mergeBlock,
} from 'easy-email-core';

import { CustomBlocksType } from '../constants';
import React from 'react';

const { Column, Section, Wrapper, Text, Button } = components;

export type ICampaignBlock = IBlockData<
  {
    'background-color': string;
    'button-color': string;
    'button-text-color': string;
    'title-color': string;
  },
  {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  }
>;

export const CampaignBlock = createCustomBlock<ICampaignBlock>({
  name: 'Campaign Block',
  type: CustomBlocksType.CAMPAIGN_BLOCK,
  validParentType: [BasicType.PAGE, AdvancedType.WRAPPER, BasicType.WRAPPER],
  create: payload => {
    const defaultData: ICampaignBlock = {
      type: CustomBlocksType.CAMPAIGN_BLOCK,
      data: {
        value: {
          title: 'Campaign Title',
          description: 'Campaign description goes here',
          buttonText: 'Learn More',
          buttonUrl: 'https://example.com',
        },
      },
      attributes: {
        'background-color': '#ffffff',
        'button-text-color': '#ffffff',
        'button-color': '#007bff',
        'title-color': '#222222',
      },
      children: [],
    };
    return mergeBlock(defaultData, payload);
  },
  render: ({ data, idx, mode }) => {
    const { title, description, buttonText, buttonUrl } = data.data.value;
    const attributes = data.attributes;

    return (
      <Wrapper
        css-class={mode === 'testing' ? getPreviewClassName(idx, data.type) : ''}
        padding='20px 0px 20px 0px'
        border='none'
        direction='ltr'
        text-align='center'
        background-color={attributes['background-color']}
      >
        <Section padding='0px'>
          <Column
            padding='0px'
            border='none'
            vertical-align='top'
          >
            <Text
              font-size='24px'
              padding='10px 25px 10px 25px'
              line-height='1.5'
              align='center'
              font-weight='bold'
              color={attributes['title-color']}
            >
              {title}
            </Text>
            <Text
              font-size='16px'
              padding='10px 25px 10px 25px'
              line-height='1.6'
              align='center'
              color={attributes['title-color']}
            >
              {description}
            </Text>
            <Button
              align='center'
              padding='15px 30px'
              background-color={attributes['button-color']}
              color={attributes['button-text-color']}
              target='_blank'
              vertical-align='middle'
              border='none'
              text-align='center'
              href={buttonUrl}
            >
              {buttonText}
            </Button>
          </Column>
        </Section>
      </Wrapper>
    );
  },
});

export { Panel } from './Panel';

