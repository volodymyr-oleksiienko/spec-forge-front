import type { SpecType } from './types.ts';

export const isObjectType = (specType: SpecType): boolean => {
  switch (specType.type) {
    case 'OBJECT':
      return true;
    case 'LIST':
    case 'MAP':
      return isObjectType(specType.valueType);
    case 'STRING':
    case 'INTEGER':
    case 'BOOLEAN':
    case 'DOUBLE':
    case 'DECIMAL':
    case 'DATE':
    case 'DATE_TIME':
    case 'TIME':
    case 'ENUM':
      return false;
    default: {
      const _exhaustiveCheck: never = specType;
      return _exhaustiveCheck;
    }
  }
};
