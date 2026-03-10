import { Plus } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { buildEmptyRow, renderTypeMetadata, type SpecTable } from '@/entities/spec';
import { generateHtml } from '@/entities/spec';
import { generateText } from '@/entities/spec';
import { Name, Requirement, SelectTypeModal, Type } from '@/features/edit-spec';
import { SpecRowContextMenu } from '@/features/edit-spec';
import { useSpecTableMutations } from '@/features/edit-spec';
import { putDataToClipboard } from '@/shared/lib/clipboard';
import { notifyError } from '@/shared/lib/notify';
import { useModal } from '@/shared/modal';

export const SpecTableWidget = ({ readOnly }: { readOnly: boolean }) => {
  const modal = useModal('selectSpecType');

  const { setValue, control } = useFormContext<{
    specTable: SpecTable;
    generationSource: string;
    isSourceValid: boolean;
  }>();
  const formSpecTable = useWatch({ control, name: 'specTable' });
  const [specTable, setSpecTable] = useState<SpecTable>(
    formSpecTable || {
      wrapperType: 'OBJECT',
      specRows: [buildEmptyRow(0)],
    },
  );
  const [prevFormSpecTable, setPrevFormSpecTable] = useState(formSpecTable);

  if (formSpecTable && formSpecTable !== prevFormSpecTable) {
    setPrevFormSpecTable(formSpecTable);
    setSpecTable(formSpecTable);
  }

  const onCommit = useCallback(
    (validatedTable: SpecTable) => {
      setSpecTable(validatedTable);
      const hasErrors =
        validatedTable.specRows.some((row) => row.error) || validatedTable.specRows.length === 0;

      if (!hasErrors) {
        setValue('specTable', validatedTable);
        setValue('generationSource', 'specTable');
      }
      setValue('isSourceValid', !hasErrors);
    },
    [setValue],
  );

  const mutations = useSpecTableMutations({ specTable, onCommit });

  const onHtmlTableCopy = async () => {
    try {
      await putDataToClipboard({
        'text/html': generateHtml(specTable),
        'text/plain': generateText(specTable),
      });
    } catch (e: unknown) {
      console.log(e);
      notifyError('Failed to copy table to clipboard');
    }
  };

  const onTypeModalOpen = (rowId: string) => {
    const row = specTable.specRows.find((r) => r.id === rowId);
    if (row) {
      modal.openModal(row);
    }
  };

  return (
    <div className="space-y-5 min-h-[70vh]">
      <div className="flex items-center justify-between bg-base-100 p-3 rounded-box border border-base-300 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider opacity-60">
            Root Wrapper
          </span>
          <div className="join">
            <button
              type="button"
              className={`btn btn-sm join-item text-xs ${
                specTable.wrapperType === 'OBJECT' ? 'btn-primary' : 'btn-ghost border-base-300'
              }`}
              onClick={() => mutations.onWrapperTypeUpdate('OBJECT')}
              disabled={readOnly}
            >
              Object {'{...}'}
            </button>
            <button
              type="button"
              className={`btn btn-sm join-item text-xs ${
                specTable.wrapperType === 'LIST' ? 'btn-primary' : 'btn-ghost border-base-300'
              }`}
              onClick={() => mutations.onWrapperTypeUpdate('LIST')}
              disabled={readOnly}
            >
              List {'[...]'}
            </button>
          </div>
        </div>
        <div className="text-[10px] opacity-40 uppercase">
          {specTable.wrapperType === 'OBJECT'
            ? 'Root is a Single Object'
            : 'Root is a Array of Objects'}
        </div>
      </div>
      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-lg relative">
        <table className="table w-full table-xs-custom">
          <thead className="bg-base-200 text-base-content border-b border-base-300">
            <tr>
              <th className="p-4 text-left font-semibold uppercase tracking-wide w-full">
                Property
              </th>
              <th className="p-4 text-left font-semibold uppercase tracking-wide min-w-[200px] max-w-[400px]">
                Type
              </th>
              <th className="p-4 text-left font-semibold uppercase tracking-wide min-w-[150px] max-w-[150px]">
                Examples
              </th>
              <th className="p-4 text-center font-semibold uppercase tracking-wide min-w-[100px] max-w-[100px]">
                Required
              </th>
              <th className="p-4 text-left font-semibold uppercase tracking-wide min-w-[200px] max-w-[350px]">
                Description
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-base-300 ${readOnly ? 'pointer-events-none' : ''}`}>
            {specTable?.specRows.map((row, index) => {
              const parent = specTable.specRows
                .slice(0, index)
                .reverse()
                .find((r) => r.depth < row.depth);

              return (
                <React.Fragment key={row.id}>
                  <SpecRowContextMenu
                    key={row.id}
                    row={row}
                    isParentDeprecated={parent?.deprecated}
                    onDeprecatedUpdate={(opts) => mutations.onDeprecatedUpdate(row.id, opts)}
                    onAddSiblingRow={(type) =>
                      type === 'before'
                        ? mutations.onAddSiblingRowBefore(row.id)
                        : mutations.onAddSiblingRowAfter(row.id)
                    }
                    onAddChildRow={() => mutations.onAddChildRow(row.id)}
                    onAddRootRow={mutations.onAddRootRow}
                    onRemoveRow={() => mutations.onRowRemove(row.id)}
                    onCopyTable={onHtmlTableCopy}
                  >
                    <tr
                      className={`border-b border-base-200 hover:bg-base-200/40 transition-colors ${row?.error ? 'bg-error/5' : ''}`}
                    >
                      <td className="p-0 relative overflow-visible h-full">
                        {row.depth > 0 && (
                          <div className="absolute inset-0 pointer-events-none">
                            {Array.from({ length: row.depth }).map((_, idx) => (
                              <React.Fragment key={idx}>
                                <div
                                  className="absolute border-l border-gray-300"
                                  style={{
                                    left: `${idx * 40 + 20}px`,
                                    top: 0,
                                    bottom: 0,
                                    width: '1px',
                                  }}
                                />

                                {idx === row.depth - 1 && (
                                  <div
                                    className="absolute border-t border-gray-300"
                                    style={{
                                      left: `${idx * 40 + 20}px`,
                                      width: '12px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                    }}
                                  />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        )}

                        <div
                          className="flex items-center py-2 min-h-[40px] relative z-10"
                          style={{ paddingLeft: `${row.depth * 40 + 12}px` }}
                        >
                          <div className="flex-1">
                            <Name row={row} onNameUpdate={mutations.onNameUpdate} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-0 max-w-[300px]">
                        <Type onTypeUpdate={onTypeModalOpen} row={row}>
                          <div className="flex flex-col py-1 gap-0.5">
                            <span className="font-mono text-[11px] font-black text-primary uppercase tracking-tight">
                              {row.type.type.toLowerCase()}
                            </span>
                            <span
                              className="font-mono text-[10px] text-base-content/50 leading-none truncate block max-w-[200px]"
                              title={renderTypeMetadata(row.type)}
                            >
                              {renderTypeMetadata(row.type)}
                            </span>
                          </div>
                        </Type>
                      </td>
                      <td className="px-4 py-0 max-w-[50px]">
                        {row.type.type === 'STRING' && (
                          <Type onTypeUpdate={onTypeModalOpen} row={row}>
                            {row.type?.examples?.join(', ')}
                          </Type>
                        )}
                      </td>
                      <td className="px-4 py-0">
                        <Requirement
                          onRequirementUpdate={mutations.onRequirementUpdate}
                          row={row}
                        />
                      </td>
                      <td className="px-4 py-0 max-w-[200px]">
                        <textarea
                          value={row.description}
                          onChange={(e) => mutations.onDescriptionUpdate(row.id, e.target.value)}
                          style={{ fieldSizing: 'content' } as any}
                          className="textarea textarea-bordered min-h-10 text-xs"
                        />
                      </td>
                    </tr>
                  </SpecRowContextMenu>
                  {row?.error && (
                    <tr className="bg-error/10 border-none!">
                      <td colSpan={5} className="p-0 border-none!">
                        <div className="px-4 py-1 flex flex-col gap-0.5 border-l-4 border-error ml-4">
                          <span className="text-[11px] font-bold text-error uppercase">
                            ⚠️ {row.error.message}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            <tr>
              <td
                colSpan={5}
                className="p-2 border-none bg-base-100/50 hover:bg-base-200/50 transition-colors"
              >
                <button
                  onClick={mutations.onAddRootRow}
                  className="btn btn-ghost btn-sm w-full text-base-content/60 hover:text-primary border border-dashed border-base-300 hover:border-primary/50 font-normal"
                >
                  <Plus size={16} className="mr-1" /> Add Root Property
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <SelectTypeModal onSelect={mutations.onTypeUpdate} />
      </div>
    </div>
  );
};
