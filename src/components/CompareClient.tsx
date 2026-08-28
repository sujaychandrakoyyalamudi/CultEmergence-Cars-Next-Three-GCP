'use client';

import Link from 'next/link';
import { type CSSProperties, type ReactNode, useMemo, useState } from 'react';
import {
  filterComparisonVehicles,
  MAX_COMPARISON_SELECTION,
  toggleComparisonSelection,
  type ComparisonVehicle
} from '@/lib/compare';

type CompareClientProps = {
  vehicles: readonly ComparisonVehicle[];
};

type ComparisonRow = {
  label: string;
  get: (vehicle: ComparisonVehicle) => ReactNode;
};

const comparisonRows: readonly ComparisonRow[] = [
  { label: 'Manufacturer', get: (vehicle) => vehicle.brand },
  { label: 'Manufacturer rank', get: (vehicle) => `#${vehicle.rank}` },
  { label: 'Model year', get: (vehicle) => vehicle.year },
  { label: 'Category', get: (vehicle) => vehicle.category },
  { label: 'Starting price', get: (vehicle) => vehicle.price },
  { label: 'Powertrain', get: (vehicle) => vehicle.powertrain },
  { label: 'Why it stands out', get: (vehicle) => vehicle.highlight },
  {
    label: 'Official source',
    get: (vehicle) => (
      <a href={vehicle.officialUrl} target="_blank" rel="noreferrer">
        Manufacturer data <span aria-hidden="true">↗</span>
      </a>
    )
  }
];

export function CompareClient({ vehicles }: CompareClientProps) {
  const [selected, setSelected] = useState<string[]>(() =>
    vehicles
      .filter((vehicle) => vehicle.rank === 1)
      .slice(0, 3)
      .map((vehicle) => vehicle.id)
  );
  const [brandFilter, setBrandFilter] = useState('');
  const [query, setQuery] = useState('');

  const manufacturers = useMemo(
    () =>
      Array.from(
        new Map(vehicles.map((vehicle) => [vehicle.brandSlug, vehicle.brand])).entries()
      ).map(([slug, name]) => ({ slug, name })),
    [vehicles]
  );

  const visibleVehicles = useMemo(
    () => filterComparisonVehicles(vehicles, brandFilter, query),
    [brandFilter, query, vehicles]
  );

  const selectedVehicles = useMemo(
    () =>
      selected
        .map((id) => vehicles.find((vehicle) => vehicle.id === id))
        .filter((vehicle): vehicle is ComparisonVehicle => Boolean(vehicle)),
    [selected, vehicles]
  );

  const selectionIsFull = selected.length >= MAX_COMPARISON_SELECTION;
  const filtersAreActive = Boolean(brandFilter || query);

  function toggle(vehicleId: string) {
    setSelected((current) => toggleComparisonSelection(current, vehicleId));
  }

  function clearFilters() {
    setBrandFilter('');
    setQuery('');
  }

  return (
    <div className="compare-app">
      <section className="compare-controls" aria-labelledby="compare-controls-title">
        <div className="compare-controls-heading">
          <div>
            <p className="eyebrow">Build your comparison</p>
            <h2 id="compare-controls-title">Find vehicles</h2>
          </div>
          <p aria-live="polite">
            {visibleVehicles.length} of {vehicles.length} shown
          </p>
        </div>

        <div className="compare-filters" role="search">
          <label>
            <span>Manufacturer</span>
            <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
              <option value="">All manufacturers</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer.slug} value={manufacturer.slug}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Model or keyword</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Taycan, hybrid, or SUV"
            />
          </label>

          <button type="button" onClick={clearFilters} disabled={!filtersAreActive}>
            Clear filters
          </button>
        </div>
      </section>

      <fieldset className="compare-picker">
        <legend>Choose up to {MAX_COMPARISON_SELECTION} vehicles</legend>
        <div className="compare-picker-summary">
          <p aria-live="polite">
            {selected.length} of {MAX_COMPARISON_SELECTION} selected
          </p>
          <span>
            {selectionIsFull
              ? 'Limit reached—remove one to add another.'
              : 'Mix manufacturers freely or stay within one marque.'}
          </span>
        </div>

        {visibleVehicles.length > 0 ? (
          <div
            className="compare-options"
            tabIndex={0}
            aria-label={`${visibleVehicles.length} filtered vehicles`}
          >
            {visibleVehicles.map((vehicle) => {
              const checked = selected.includes(vehicle.id);
              const disabled = !checked && selectionIsFull;

              return (
                <label
                  key={vehicle.id}
                  className={checked ? 'is-selected' : undefined}
                  style={{ '--accent': vehicle.accent } as CSSProperties}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(vehicle.id)}
                  />
                  <span className="compare-rank">{String(vehicle.rank).padStart(2, '0')}</span>
                  <strong>{vehicle.brand}</strong>
                  <small>{vehicle.model}</small>
                  <em>
                    {vehicle.year} · {vehicle.category}
                  </em>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="compare-filter-empty">
            <strong>No vehicles match those filters.</strong>
            <button type="button" onClick={clearFilters}>
              Reset filters
            </button>
          </div>
        )}
      </fieldset>

      <section className="selection-tray" aria-labelledby="selection-title">
        <div className="selection-tray-heading">
          <div>
            <p className="eyebrow">Selected vehicles</p>
            <h2 id="selection-title">
              {selected.length > 0 ? `${selected.length} ready to compare` : 'Start with a vehicle'}
            </h2>
          </div>
          <button type="button" onClick={() => setSelected([])} disabled={selected.length === 0}>
            Clear selection
          </button>
        </div>

        {selectedVehicles.length > 0 ? (
          <div className="selection-chips">
            {selectedVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => toggle(vehicle.id)}
                aria-label={`Remove ${vehicle.brand} ${vehicle.model}`}
                style={{ '--accent': vehicle.accent } as CSSProperties}
              >
                <span>{vehicle.brand}</span>
                {vehicle.model}
                <b aria-hidden="true">×</b>
              </button>
            ))}
          </div>
        ) : (
          <p>Use the filters and vehicle picker above to build a comparison.</p>
        )}
      </section>

      {selectedVehicles.length > 0 ? (
        <div className="comparison-scroll" tabIndex={0} aria-label="Scrollable comparison table">
          <table className="comparison-table">
            <caption>{selectedVehicles.length} vehicle comparison</caption>
            <thead>
              <tr>
                <th scope="col">Specification</th>
                {selectedVehicles.map((vehicle) => (
                  <th
                    key={vehicle.id}
                    scope="col"
                    style={{ '--accent': vehicle.accent } as CSSProperties}
                  >
                    <Link href={vehicle.detailHref}>
                      <span>{vehicle.brand}</span>
                      {vehicle.model}
                    </Link>
                    <small>{vehicle.year}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {selectedVehicles.map((vehicle) => (
                    <td key={`${row.label}-${vehicle.id}`}>{row.get(vehicle)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">Select at least one vehicle to begin.</p>
      )}
    </div>
  );
}
