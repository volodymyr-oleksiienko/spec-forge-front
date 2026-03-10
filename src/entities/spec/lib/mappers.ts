import type * as SpecModelTypes from '../api/dto.ts';
import type * as SpecTableTypes from '../model/types.ts';

export const mapToSpecTable = (model: SpecModelTypes.SpecModel): SpecTableTypes.SpecTable => {
  const rows: SpecTableTypes.SpecRow[] = [];

  const flatten = (properties: SpecModelTypes.SpecProperty[], depth: number) => {
    properties.forEach((prop) => {
      const row: SpecTableTypes.SpecRow = {
        id: crypto.randomUUID(),
        depth,
        name: prop.name,
        type: prop.type as SpecTableTypes.SpecType,
        required: prop.required,
        description: prop.description || '',
        deprecated: prop.deprecated ?? false,
      };

      rows.push(row);

      const nestedObject = findNestedObjectInType(prop.type);
      if (nestedObject) {
        flatten(nestedObject.children, depth + 1);
      }
    });
  };

  flatten(model.properties, 0);

  return {
    wrapperType: model.wrapperType,
    specRows: rows,
  };
};

export const mapToSpecModel = (table: SpecTableTypes.SpecTable): SpecModelTypes.SpecModel => {
  const result: SpecModelTypes.SpecProperty[] = [];

  const stack: { props: SpecModelTypes.SpecProperty[]; depth: number }[] = [
    { props: result, depth: 0 },
  ];

  table.specRows.forEach((row) => {
    const property: SpecModelTypes.SpecProperty = {
      name: row.name,
      description: row.description,
      required: row.required,
      deprecated: row.deprecated,
      type: JSON.parse(JSON.stringify(row.type)),
    };

    const targetObject = findNestedObjectInType(property.type);
    if (targetObject) {
      targetObject.children = [];
    }

    while (stack.length > 1 && stack[stack.length - 1].depth > row.depth) {
      stack.pop();
    }

    stack[stack.length - 1].props.push(property);

    if (targetObject) {
      stack.push({ props: targetObject.children!, depth: row.depth + 1 });
    }
  });

  return {
    wrapperType: table.wrapperType,
    properties: result,
  };
};

function findNestedObjectInType(type: any): any {
  if (type.type === 'OBJECT') {
    return type;
  }
  if (type.type === 'LIST') {
    return findNestedObjectInType(type.valueType);
  }
  if (type.type === 'MAP') {
    return findNestedObjectInType(type.valueType);
  }
}
