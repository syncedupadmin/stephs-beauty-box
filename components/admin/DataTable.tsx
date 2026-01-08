'use client';

/**
 * Data Table Component
 * ====================
 * Reusable sortable table with editorial styling
 */

import { useState, useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

interface Column<T extends AnyRecord> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends AnyRecord> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends AnyRecord>({
  columns,
  data,
  keyField,
  onRowClick,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: string) => {
    if (sortField === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortField, sortDirection]);

  const getValue = (item: T, key: string): unknown => {
    if (key.includes('.')) {
      return key.split('.').reduce((obj: unknown, k) => {
        if (obj && typeof obj === 'object') {
          return (obj as Record<string, unknown>)[k];
        }
        return undefined;
      }, item);
    }
    return item[key];
  };

  if (data.length === 0) {
    return (
      <div className="bg-off-white p-12 text-center">
        <p className="text-body-sm font-body text-ink/50">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-off-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink/10">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`text-left px-6 py-4 text-overline uppercase tracking-[0.15em] text-ink/50 font-body font-normal ${
                    column.sortable ? 'cursor-pointer hover:text-ink transition-colors duration-600' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <span className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortField === column.key && (
                      <span className="text-botanical">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr
                key={String(item[keyField])}
                className={`border-b border-ink/5 last:border-0 ${
                  onRowClick
                    ? 'cursor-pointer hover:bg-ink/[0.02] transition-colors duration-600'
                    : ''
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 text-body-sm font-body text-ink ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(item)
                      : String(getValue(item, String(column.key)) ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
