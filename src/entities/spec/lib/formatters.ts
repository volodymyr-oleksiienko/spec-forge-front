import type { SpecType } from '../model/types';

export const renderTypeMetadata = (type: SpecType): string => {
  const isValidNum = (val: any): boolean => typeof val === 'number' && !Number.isNaN(val);

  const getRange = (
    min?: number,
    max?: number,
    minSymbol: string = '0',
    maxSymbol: string = '∞',
  ) => {
    const hasMin = isValidNum(min);
    const hasMax = isValidNum(max);

    if (!hasMin && !hasMax) return '';
    return ` [${hasMin ? min : minSymbol}..${hasMax ? max : maxSymbol}]`;
  };

  const getInnerTypeDesc = (innerType: SpecType): string => {
    const meta = renderTypeMetadata(innerType);
    const typeName = innerType.type.toLowerCase();
    return meta ? `${typeName} ${meta}` : typeName;
  };

  switch (type.type) {
    case 'STRING': {
      const format = type.format || type.pattern;
      const range = getRange(type.minLength, type.maxLength, '0', '∞');
      return `${format ? `(${format})` : ''}${range}`.trim();
    }

    case 'INTEGER':
    case 'DOUBLE':
    case 'DECIMAL': {
      const range = getRange(type.minimum, type.maximum, '-∞', '+∞');
      const scaleInfo = type.type === 'DECIMAL' ? `(scale: ${type.scale})` : '';
      return `${scaleInfo}${range}`.trim();
    }

    case 'ENUM': {
      return `[${type.values.join(', ')}]`;
    }

    case 'DATE':
    case 'DATE_TIME':
    case 'TIME':
      return `(${type.format})`;

    case 'LIST': {
      const range = getRange(type.minItems, type.maxItems, '0', '∞');
      const inner = getInnerTypeDesc(type.valueType);
      return `${range} of ${inner}`.trim();
    }

    case 'MAP': {
      const keyDesc = getInnerTypeDesc(type.keyType);
      const valDesc = getInnerTypeDesc(type.valueType);
      return `keys: ${keyDesc}, values: ${valDesc}`;
    }

    case 'BOOLEAN':
    case 'OBJECT':
      return '';

    default: {
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
  }
};
