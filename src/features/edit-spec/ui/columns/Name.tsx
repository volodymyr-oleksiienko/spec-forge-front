import type { SpecRow } from '@/entities/spec';

export const Name = ({
  onNameUpdate,
  row,
}: {
  onNameUpdate: (rowId: string, name: string) => void;
  row: SpecRow;
}) => {
  return (
    <label className="flex items-center group relative w-full cursor-text">
      <div
        className={`
          flex items-center gap-2 w-fit
          ${row.deprecated ? 'tooltip tooltip-error tooltip-right' : ''}
        `}
        data-tip={row.deprecated ? 'This property is deprecated' : ''}
      >
        <input
          type="text"
          placeholder="property_name"
          autoComplete="off"
          style={{ fieldSizing: 'content' } as any}
          maxLength={256}
          className={`
            bg-transparent border-none outline-none focus:ring-0 p-0 h-auto
            font-mono text-[11px] leading-none transition-colors
            placeholder:text-base-content/20
            ${row.deprecated ? 'line-through decoration-error/50 text-base-content/50' : 'text-base-content'}
            focus:text-primary
          `}
          value={row.name}
          onChange={(e) => onNameUpdate(row.id, e.target.value)}
        />

        {row.deprecated && (
          <span className="shrink-0 text-[9px] font-black text-error bg-error/10 px-1 py-0.5 rounded border border-error/20 leading-none">
            DEP
          </span>
        )}
      </div>

      <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left opacity-30" />
    </label>
  );
};
