import React, { Suspense } from 'react';
import { Padding } from '@extensions/AttributePanel/components/attributes/Padding';
import { ContainerBackgroundColor } from '@extensions/AttributePanel/components/attributes/ContainerBackgroundColor';
import { Color } from '@extensions/AttributePanel/components/attributes/Color';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { useBlock, useFocusIdx } from '@ivanholiak/easy-email-editor';

const CodeMirrorEditorPromise = import(
  '../../../../components/Form/CodemirrorEditor'
);
const CodeMirrorEditor = React.lazy(() => CodeMirrorEditorPromise);

export function Code() {
  const { focusBlock, setValueByIdx } = useBlock();
  const { focusIdx } = useFocusIdx();

  const content = focusBlock?.data.value.content || '';

  const onChangeContent = (val: string) => {
    if (!focusBlock) return;
    focusBlock.data.value.content = val;
    setValueByIdx(focusIdx, { ...focusBlock });
  };

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Item
          name='0'
          header={t('Code content')}
        >
          <Suspense fallback={<div>{t('Loading...')}</div>}>
            <CodeMirrorEditor value={content} onChange={onChangeContent} />
          </Suspense>
        </Collapse.Item>
        <Collapse.Item
          name='1'
          header={t('Dimension')}
        >
          <Space direction='vertical'>
            <Padding showResetAll />
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='2'
          header={t('Color')}
        >
          <Grid.Row>
            <Grid.Col span={11}>
              <Color />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            >
              <ContainerBackgroundColor title={t('Background color')} />
            </Grid.Col>
          </Grid.Row>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
