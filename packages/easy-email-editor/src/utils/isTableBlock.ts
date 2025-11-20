import { BasicType, AdvancedType } from '@ivanholiak/easy-email-core';

export function isTableBlock(blockType: any) {
  return blockType === AdvancedType.TABLE;
}
