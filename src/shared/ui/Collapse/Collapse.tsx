import type { ReactNode } from 'react';

interface CollapseProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const Collapse = ({ title, icon, children, defaultOpen = false }: CollapseProps) => {
  return (
    <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg">
      <input type="checkbox" defaultChecked={defaultOpen} />
      <div className="collapse-title text-sm font-bold flex items-center gap-3">
        {icon} {title}
      </div>
      <div className="collapse-content space-y-4">
        <div className="pt-2 border-t border-base-200">{children}</div>
      </div>
    </div>
  );
};
