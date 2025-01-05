export type OpenHouse = {
  id: string;
  propertyId: string;
  date: string;
  startTime: string;
  endTime: string;
  agentId: string;
  agentName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  maxAttendees?: number;
  currentAttendees: number;
  listingUrl?: string;
};

export type OpenHouseListProps = {
  openHouses: OpenHouse[];
  onDelete: (id: string) => void;
};