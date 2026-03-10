import * as ContextMenu from '@radix-ui/react-context-menu';
import { Ban, Copy, Plus, RefreshCcw, Trash2 } from 'lucide-react';
import React from 'react';

import { isObjectType, type SpecRow } from '@/entities/spec';

export const SpecRowContextMenu = ({
  row,
  isParentDeprecated,
  children,
  onDeprecatedUpdate,
  onAddSiblingRow,
  onAddChildRow,
  onAddRootRow,
  onRemoveRow,
  onCopyTable,
}: {
  row: SpecRow;
  isParentDeprecated?: boolean;
  children: React.ReactNode;
  onDeprecatedUpdate: (options: { recursive: boolean; forceState: boolean }) => void;
  onAddSiblingRow: (type: 'before' | 'after') => void;
  onAddChildRow: () => void;
  onAddRootRow: () => void;
  onRemoveRow: () => void;
  onCopyTable: () => void;
}) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content
          className="menu bg-base-100 text-base-content w-64 rounded-box shadow-xl border border-base-300 z-50 py-2 animate-in fade-in zoom-in-95 duration-100"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {!row.deprecated ? (
            <ContextMenu.Item
              className="outline-none"
              onClick={() => onDeprecatedUpdate({ recursive: true, forceState: true })}
            >
              <div className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg cursor-pointer">
                <Ban size={16} className="text-error" />
                <span>Mark as Deprecated</span>
              </div>
            </ContextMenu.Item>
          ) : (
            <>
              {isParentDeprecated ? (
                <div className="px-4 py-2 text-xs text-error bg-error/10 flex items-center gap-2 mb-1">
                  <span>🔒 Parent is Deprecated</span>
                </div>
              ) : (
                <>
                  <ContextMenu.Label className="px-4 py-1 text-[10px] uppercase opacity-50">
                    Restore Options
                  </ContextMenu.Label>
                  <ContextMenu.Item
                    className="outline-none"
                    onClick={() => onDeprecatedUpdate({ recursive: false, forceState: false })}
                  >
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg cursor-pointer">
                      <RefreshCcw size={16} />
                      <span>Restore: Only this</span>
                    </div>
                  </ContextMenu.Item>
                  {isObjectType(row.type) && (
                    <ContextMenu.Item
                      className="outline-none"
                      onClick={() => onDeprecatedUpdate({ recursive: true, forceState: false })}
                    >
                      <div className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg cursor-pointer">
                        <RefreshCcw size={16} />
                        <span>Restore: With children</span>
                      </div>
                    </ContextMenu.Item>
                  )}
                </>
              )}
            </>
          )}

          <div className="divider my-1 opacity-20" />

          <ContextMenu.Item className="outline-none" onClick={() => onAddSiblingRow('before')}>
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg cursor-pointer">
              <Plus size={16} />
              <span>Insert Row Before</span>
            </div>
          </ContextMenu.Item>
          <ContextMenu.Item className="outline-none" onClick={() => onAddSiblingRow('after')}>
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg cursor-pointer">
              <Plus size={16} />
              <span>Insert Row After (Skip kids)</span>
            </div>
          </ContextMenu.Item>

          {isObjectType(row.type) && (
            <ContextMenu.Item className="outline-none" onClick={onAddChildRow}>
              <div className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg cursor-pointer text-primary font-medium">
                <Plus size={16} />
                <span>Add Child Row</span>
              </div>
            </ContextMenu.Item>
          )}

          <ContextMenu.Item className="outline-none" onClick={() => onAddRootRow()}>
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg cursor-pointer">
              <Plus size={16} />
              <span>Add Root Property</span>
            </div>
          </ContextMenu.Item>

          <div className="divider my-1 opacity-20" />

          <ContextMenu.Item className="outline-none" onClick={onRemoveRow}>
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg cursor-pointer text-error">
              <Trash2 size={16} />
              <span>Delete Row</span>
            </div>
          </ContextMenu.Item>

          <div className="divider my-1 opacity-20" />

          <ContextMenu.Item className="outline-none" onClick={onCopyTable}>
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-lg cursor-pointer">
              <Copy size={16} />
              <span>Copy Table</span>
            </div>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};
