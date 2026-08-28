import { describe, expect, it } from 'vitest';
import {
  filterComparisonVehicles,
  MAX_COMPARISON_SELECTION,
  toggleComparisonSelection
} from '@/lib/compare';
import { comparisonVehicles } from '@/lib/comparisonVehicles';

describe('comparison data and selection', () => {
  it('exposes every manufacturer collection entry with a unique id', () => {
    expect(comparisonVehicles).toHaveLength(96);
    expect(new Set(comparisonVehicles.map((vehicle) => vehicle.id)).size).toBe(96);
    expect(new Set(comparisonVehicles.map((vehicle) => vehicle.brand)).size).toBe(10);
  });

  it('filters by manufacturer and model keywords together', () => {
    const porscheElectric = filterComparisonVehicles(comparisonVehicles, 'porsche', 'electric');
    expect(porscheElectric.length).toBeGreaterThan(0);
    expect(porscheElectric.every((vehicle) => vehicle.brand === 'Porsche')).toBe(true);
    expect(porscheElectric.some((vehicle) => vehicle.model === 'Taycan')).toBe(true);

    const crossBrandM5 = filterComparisonVehicles(comparisonVehicles, '', 'M5');
    expect(crossBrandM5.map((vehicle) => vehicle.model)).toContain('M5 Sedan');
  });

  it('caps comparison selection at ten while allowing removal', () => {
    const ids = comparisonVehicles.slice(0, MAX_COMPARISON_SELECTION + 1).map(({ id }) => id);
    const full = ids.slice(0, MAX_COMPARISON_SELECTION);

    expect(toggleComparisonSelection(full, ids[MAX_COMPARISON_SELECTION]!)).toEqual(full);
    expect(toggleComparisonSelection(full, full[3]!)).not.toContain(full[3]);
  });
});
