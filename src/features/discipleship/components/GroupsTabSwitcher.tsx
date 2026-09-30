import { useState } from 'react';

export type DiscipleshipTab = 'my-discipleship' | 'groups-i-lead';

export interface TabOption {
  id: DiscipleshipTab;
  label: string;
}

const TABS: TabOption[] = [
  { id: 'my-discipleship', label: 'My Discipleship' },
  { id: 'groups-i-lead', label: 'Groups I Lead' },
];

export interface GroupsTabSwitcherProps {

  activeTab?: DiscipleshipTab;

  defaultTab?: DiscipleshipTab;

  onChange?: (tab: DiscipleshipTab) => void;

  className?: string;
}

export function GroupsTabSwitcher({
  activeTab: controlledTab,
  defaultTab = 'my-discipleship',
  onChange,
  className = '',
}: GroupsTabSwitcherProps) {
  const [internalTab, setInternalTab] = useState<DiscipleshipTab>(defaultTab);

  const isControlled = controlledTab !== undefined;
  const currentTab = isControlled ? controlledTab : internalTab;

  const handleSelect = (tabId: DiscipleshipTab) => {
    if (!isControlled) {
      setInternalTab(tabId);
    }
    onChange?.(tabId);
  };

  return (
    <div
      role="tablist"
      aria-label="Discipleship groups switcher"
      className={`w-full max-w-md mx-auto p-1 bg-[#F1F3F6] rounded-full flex items-center gap-1 select-none ${className}`.trim()}
    >
      {TABS.map((tab) => {
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(tab.id)}
            className={`
              flex-1 py-2.5 px-4 rounded-full text-[14px] font-medium transition-all duration-200 cursor-pointer text-center
              ${isActive
                ? 'bg-[#0E172A] text-white shadow-sm font-semibold'
                : 'bg-transparent text-[#62718A] hover:text-[#0E172A]'
              }
            `.trim()}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default GroupsTabSwitcher;
