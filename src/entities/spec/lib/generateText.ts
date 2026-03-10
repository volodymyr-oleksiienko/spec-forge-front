import { renderTypeMetadata, type SpecTable } from '@/entities/spec';

export const generateText = (specTable: SpecTable): string => {
  if (!specTable.specRows || specTable.specRows.length === 0) {
    return '';
  }

  const maxDepth = specTable.specRows.reduce((max, row) => Math.max(max, row.depth), 0);
  const propColCount = maxDepth + 1;

  const headers = [...Array(propColCount).fill('Property'), 'Type', 'Required', 'Description'].join(
    '\t',
  );

  const bodyRows = specTable.specRows
    .map((row) => {
      const propCols = Array.from({ length: propColCount }, (_, i) =>
        i === row.depth ? row.name : '',
      );
      const typeStr = `${row.type.type.toLowerCase()} ${renderTypeMetadata(row.type)}`;
      const reqStr = row.required ? 'Yes' : 'No';
      const descStr = (row.description || '').replace(/\r?\n/g, ' ');
      return [...propCols, typeStr, reqStr, descStr].join('\t');
    })
    .join('\n');

  return `${headers}\n${bodyRows}`;
};
