import { useState } from 'react';
import type { OpenHouse } from '../types/openHouse';

export function useOpenHouses() {
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([]);

  const deleteOpenHouse = (id: string) => {
    setOpenHouses(prev => prev.filter(oh => oh.id !== id));
  };

  return {
    openHouses,
    deleteOpenHouse
  };
}