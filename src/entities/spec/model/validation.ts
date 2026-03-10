import { isObjectType } from './guards.ts';
import type { Error, SpecRow, SpecTable } from './types.ts';

export function validateSpecRow(specTable: SpecTable, specRow: SpecRow): Error | undefined {
  if (!specRow.name || specRow.name.trim() === '') {
    return { message: 'Name cannot be blank' };
  }
  const rowIndex = specTable.specRows.findIndex((s) => s.id === specRow.id);
  if (
    getObjectSiblings(rowIndex, specTable.specRows).filter((sr) => sr.name === specRow.name)
      .length > 1
  ) {
    return { message: 'Name must be unique inside one object' };
  }
  if (
    isObjectType(specRow.type) &&
    (isNextRowAbsent(specTable, rowIndex) ||
      isNextRowNotChildOfCurrentRow(specTable, rowIndex, specRow))
  ) {
    return { message: 'Object must have nested properties' };
  }
}

const isNextRowAbsent = (specTable: SpecTable, rowIndex: number) => {
  return specTable.specRows.length <= rowIndex + 1;
};

const isNextRowNotChildOfCurrentRow = (
  specTable: SpecTable,
  rowIndex: number,
  specRow: SpecRow,
) => {
  return specTable.specRows[rowIndex + 1].depth <= specRow.depth;
};

const getObjectSiblings = (targetIndex: number, rows: SpecRow[]): SpecRow[] => {
  const targetDepth = rows[targetIndex].depth;
  const siblings: SpecRow[] = [];

  for (let i = targetIndex - 1; i >= 0; i--) {
    if (rows[i].depth < targetDepth) {
      break;
    }
    if (rows[i].depth === targetDepth) {
      siblings.unshift(rows[i]);
    }
  }

  siblings.push(rows[targetIndex]);

  for (let i = targetIndex + 1; i < rows.length; i++) {
    if (rows[i].depth < targetDepth) {
      break;
    }
    if (rows[i].depth === targetDepth) {
      siblings.push(rows[i]);
    }
  }

  return siblings;
};
