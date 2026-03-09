import { useCallback } from 'react';

import {
  buildEmptyRow,
  isObjectType,
  type SpecRow,
  type SpecTable,
  type SpecType,
  validateSpecRow,
} from '@/entities/spec';

export const useSpecTableMutations = ({
  specTable,
  onCommit,
}: {
  specTable: SpecTable;
  onCommit: (table: SpecTable) => void;
}) => {
  const commitChanges = useCallback(
    (nextTable: SpecTable) => {
      const validatedTable: SpecTable = {
        ...nextTable,
        specRows: nextTable.specRows.map((row) => ({
          ...row,
          error: validateSpecRow(nextTable, row),
        })),
      };
      onCommit(validatedTable);
    },
    [onCommit],
  );

  const updateRow = useCallback(
    (rowId: string, updates: Partial<SpecRow>) => {
      const updatedRows = specTable.specRows.map((row) =>
        row.id === rowId ? { ...row, ...updates } : row,
      );
      commitChanges({ ...specTable, specRows: updatedRows });
    },
    [specTable, commitChanges],
  );

  const onNameUpdate = useCallback(
    (rowId: string, name: string) => updateRow(rowId, { name }),
    [updateRow],
  );
  const onRequirementUpdate = useCallback(
    (rowId: string, required: boolean) => updateRow(rowId, { required }),
    [updateRow],
  );
  const onDescriptionUpdate = useCallback(
    (rowId: string, description: string) => updateRow(rowId, { description }),
    [updateRow],
  );

  const onTypeUpdate = useCallback(
    (rowId: string, type: SpecType) => {
      const rowIndex = specTable.specRows.findIndex((r) => r.id === rowId);
      if (rowIndex === -1) {
        return;
      }

      const currentRow = specTable.specRows[rowIndex];
      const wasObject = isObjectType(currentRow.type);
      const isNowObject = isObjectType(type);

      const updatedRows = [...specTable.specRows];
      updatedRows[rowIndex] = { ...currentRow, type };

      if (isNowObject) {
        const hasChildren =
          rowIndex < updatedRows.length - 1 && updatedRows[rowIndex + 1].depth > currentRow.depth;

        if (!hasChildren) {
          const newChild = buildEmptyRow(currentRow.depth + 1);
          updatedRows.splice(rowIndex + 1, 0, newChild);
        }
      } else if (wasObject && !isNowObject) {
        let deleteCount = 0;
        for (let i = rowIndex + 1; i < updatedRows.length; i++) {
          if (updatedRows[i].depth > currentRow.depth) deleteCount++;
          else break;
        }
        if (deleteCount > 0) {
          updatedRows.splice(rowIndex + 1, deleteCount);
        }
      }

      commitChanges({ ...specTable, specRows: updatedRows });
    },
    [specTable, commitChanges],
  );

  const onDeprecatedUpdate = useCallback(
    (rowId: string, options: { recursive: boolean; forceState: boolean }) => {
      const rowIndex = specTable.specRows.findIndex((r) => r.id === rowId);
      if (rowIndex === -1) {
        return;
      }

      const currentRow = specTable.specRows[rowIndex];
      if (!options.forceState) {
        const parent = specTable.specRows
          .slice(0, rowIndex)
          .reverse()
          .find((r) => r.depth < currentRow.depth);
        if (parent?.deprecated) {
          return;
        }
      }

      const updatedRows = [...specTable.specRows];
      updatedRows[rowIndex] = { ...currentRow, deprecated: options.forceState };

      if (options.recursive) {
        for (let i = rowIndex + 1; i < updatedRows.length; i++) {
          if (updatedRows[i].depth > currentRow.depth) {
            updatedRows[i] = { ...updatedRows[i], deprecated: options.forceState };
          } else {
            break;
          }
        }
      }

      commitChanges({ ...specTable, specRows: updatedRows });
    },
    [specTable, commitChanges],
  );

  const onRowRemove = useCallback(
    (rowId: string) => {
      const rowIndex = specTable.specRows.findIndex((row) => row.id === rowId);
      if (rowIndex === -1) {
        return;
      }

      const targetDepth = specTable.specRows[rowIndex].depth;
      const updatedRows = [...specTable.specRows];

      let removeCount = 1;
      for (let i = rowIndex + 1; i < updatedRows.length; i++) {
        if (updatedRows[i].depth > targetDepth) {
          removeCount++;
        } else {
          break;
        }
      }

      updatedRows.splice(rowIndex, removeCount);
      commitChanges({ ...specTable, specRows: updatedRows });
    },
    [specTable, commitChanges],
  );

  const onAddSiblingRowBefore = useCallback(
    (rowId: string) => {
      const index = specTable.specRows.findIndex((row) => row.id === rowId);
      if (index === -1) {
        return;
      }

      const updatedRows = [...specTable.specRows];
      updatedRows.splice(index, 0, buildEmptyRow(specTable.specRows[index].depth));
      commitChanges({ ...specTable, specRows: updatedRows });
    },
    [specTable, commitChanges],
  );

  const onAddSiblingRowAfter = useCallback(
    (rowId: string) => {
      const index = specTable.specRows.findIndex((row) => row.id === rowId);
      if (index === -1) {
        return;
      }

      const currentRow = specTable.specRows[index];
      let insertIndex = index + 1;

      for (let i = index + 1; i < specTable.specRows.length; i++) {
        if (specTable.specRows[i].depth > currentRow.depth) {
          insertIndex++;
        } else {
          break;
        }
      }

      const updatedRows = [...specTable.specRows];
      updatedRows.splice(insertIndex, 0, buildEmptyRow(currentRow.depth));
      commitChanges({ ...specTable, specRows: updatedRows });
    },
    [specTable, commitChanges],
  );

  const onAddRootRow = useCallback(() => {
    commitChanges({ ...specTable, specRows: [...specTable.specRows, buildEmptyRow(0)] });
  }, [specTable, commitChanges]);

  const onAddChildRow = useCallback(
    (rowId: string) => {
      const index = specTable.specRows.findIndex((row) => row.id === rowId);
      if (index === -1) {
        return;
      }

      const updatedRows = [...specTable.specRows];
      updatedRows.splice(index + 1, 0, buildEmptyRow(specTable.specRows[index].depth + 1));
      commitChanges({ ...specTable, specRows: updatedRows });
    },
    [specTable, commitChanges],
  );

  const onWrapperTypeUpdate = useCallback(
    (newWrapper: 'OBJECT' | 'LIST') => {
      commitChanges({ ...specTable, wrapperType: newWrapper });
    },
    [specTable, commitChanges],
  );

  return {
    onNameUpdate,
    onRequirementUpdate,
    onDescriptionUpdate,
    onTypeUpdate,
    onDeprecatedUpdate,
    onRowRemove,
    onAddSiblingRowBefore,
    onAddSiblingRowAfter,
    onAddRootRow,
    onAddChildRow,
    onWrapperTypeUpdate,
  };
};
