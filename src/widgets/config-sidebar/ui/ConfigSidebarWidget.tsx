import { GenerationConfigForm } from '@/features/configure-generation';

export const ConfigSidebarWidget = () => {
  return (
    <aside className="space-y-6">
      <div className="card h-fit bg-base-100 shadow-sm border border-base-300">
        <div className="card-body gap-4">
          <div>
            <h2 className="card-title text-xl">Configuration</h2>
            <p className="text-sm text-base-content/60">Set up code generation parameters</p>
          </div>
          <div className="divider my-0"></div>
          <GenerationConfigForm />
        </div>
      </div>
    </aside>
  );
};
