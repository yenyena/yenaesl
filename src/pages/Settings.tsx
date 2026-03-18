import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TabBar } from '../components/ui';
import { ArrowLeftIcon } from '../components/icons';
import { VocabularyManager } from './settings/VocabularyManager';
import { CategoryManager } from './settings/CategoryManager';
import { DataManagement } from './settings/DataManagement';

const TABS = [
  { id: 'vocabulary', label: 'Vocabulary Manager' },
  { id: 'categories', label: 'Category Lists' },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('vocabulary');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/"
          className="no-underline hover:opacity-70 transition-opacity text-text"
        >
          <ArrowLeftIcon size={28} />
        </Link>
        <h1 className="text-3xl m-0 text-primary">Settings</h1>
      </div>

      <div className="mb-6">
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === 'vocabulary' && (
        <div className="mb-8">
          <VocabularyManager />
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="mb-8">
          <CategoryManager />
        </div>
      )}

      <DataManagement />
    </div>
  );
}
