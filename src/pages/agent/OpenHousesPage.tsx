import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/common';
import { OpenHouseForm, OpenHouseList } from '../../components/openHouse';
import { useOpenHouses } from '../../hooks';

export function OpenHousesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Open Houses</h1>
            <p className="text-gray-600 mt-2">Publish and manage your open house events</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Publish Open House
          </Button>
        </div>
      </header>

      {showForm ? (
        <OpenHouseForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
          }}
        />
      ) : (
        <div className="space-y-6">
          <OpenHouseList />
        </div>
      )}
    </>
  );
}