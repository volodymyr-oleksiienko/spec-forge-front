import type { PropsWithChildren } from 'react';

import { type SpecRow } from '@/entities/spec';

export const Type = ({
  onTypeUpdate,
  row,
  children,
}: PropsWithChildren<{
  onTypeUpdate: (rowId: string) => void;
  row: SpecRow;
}>) => {
  return (
    <button
      onClick={() => onTypeUpdate(row.id)}
      className="
        border border-transparent bg-transparent
        hover:border-base-300 hover:bg-base-200
        break-all min-h-10 w-full min-w-[100px] px-3 rounded-md
        text-left font-mono text-sm transition-all duration-200"
    >
      {children}
    </button>
  );
};
