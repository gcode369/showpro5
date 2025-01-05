import { OpenHouseCard } from './OpenHouseCard';
import type { OpenHouseListProps } from '../../types/openHouse';

export function OpenHouseList({ openHouses, onDelete }: OpenHouseListProps) {
  if (openHouses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-600">No open houses scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {openHouses.map((openHouse) => (
        <OpenHouseCard
          key={openHouse.id}
          openHouse={openHouse}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}