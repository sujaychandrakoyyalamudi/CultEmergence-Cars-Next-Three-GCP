export const MAX_COMPARISON_SELECTION = 10;

export type ComparisonVehicle = {
  id: string;
  brandSlug: string;
  brand: string;
  accent: string;
  rank: number;
  year: string;
  model: string;
  category: string;
  powertrain: string;
  price: string;
  highlight: string;
  officialUrl: string;
  detailHref: string;
};

type FilterableVehicle = Pick<
  ComparisonVehicle,
  'brandSlug' | 'brand' | 'model' | 'category' | 'powertrain'
>;

export function filterComparisonVehicles<T extends FilterableVehicle>(
  vehicles: readonly T[],
  brandSlug: string,
  query: string
): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return vehicles.filter((vehicle) => {
    if (brandSlug && vehicle.brandSlug !== brandSlug) return false;
    if (!normalizedQuery) return true;

    return [vehicle.brand, vehicle.model, vehicle.category, vehicle.powertrain]
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalizedQuery);
  });
}

export function toggleComparisonSelection(
  selected: readonly string[],
  vehicleId: string,
  limit = MAX_COMPARISON_SELECTION
): string[] {
  if (selected.includes(vehicleId)) return selected.filter((id) => id !== vehicleId);
  if (selected.length >= limit) return [...selected];
  return [...selected, vehicleId];
}
