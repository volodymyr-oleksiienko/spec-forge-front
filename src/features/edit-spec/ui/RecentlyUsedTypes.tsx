import { renderTypeMetadata, type SpecType } from '@/entities/spec';

export const RecentlyUsedTypes = ({
  recentTypes,
  onSelect,
}: {
  recentTypes: SpecType[];
  onSelect: (type: SpecType) => void;
}) => {
  if (!recentTypes || recentTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 opacity-40">
        <p className="text-sm">No recently used types yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {recentTypes.map((type, index) => (
        <button
          key={`${index}-${JSON.stringify(type)}`}
          type="button"
          onClick={() => onSelect(type)}
          className="badge badge-outline badge-lg gap-2 cursor-pointer hover:badge-primary transition-all h-auto"
        >
          <div className="flex flex-col py-1 gap-0.5">
            <span className="font-mono text-[11px] font-black text-primary uppercase tracking-tight">
              {type.type.toLowerCase()}
            </span>
            <span
              className="font-mono text-[10px] text-base-content/50 leading-none truncate block max-w-[200px]"
              title={renderTypeMetadata(type)}
            >
              {renderTypeMetadata(type)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
