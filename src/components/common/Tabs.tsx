import { type FC } from 'react';

type Tab = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
};

export const Tabs: FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};