import type { SpecRow } from '@/entities/spec';

export const Requirement = ({
  onRequirementUpdate,
  row,
}: {
  onRequirementUpdate: (rowId: string, value: boolean) => void;
  row: SpecRow;
}) => {
  return (
    <div className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={row.required}
        onChange={(e) => onRequirementUpdate(row.id, e.target.checked)}
        className="checkbox checkbox-primary checkbox-sm cursor-pointer"
      />
    </div>
  );
};
