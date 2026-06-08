import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useSortableData<T>(items: T[], config: SortConfig | null = null) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        let aVal = a;
        let bVal = b;
        
        // Handle nested paths (e.g. "payment.amount")
        if (sortConfig.key.includes('.')) {
           const parts = sortConfig.key.split('.');
           aVal = parts.reduce((obj: any, key: string) => (obj && obj[key] !== undefined ? obj[key] : undefined), a);
           bVal = parts.reduce((obj: any, key: string) => (obj && obj[key] !== undefined ? obj[key] : undefined), b);
        } else {
           aVal = a[sortConfig.key];
           bVal = b[sortConfig.key];
        }

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1; // nulls at end
        if (bVal === null || bVal === undefined) return -1;
        
        const isANumeric = typeof aVal === 'number' || (typeof aVal === 'string' && aVal !== '' && !isNaN(Number(aVal)));
        const isBNumeric = typeof bVal === 'number' || (typeof bVal === 'string' && bVal !== '' && !isNaN(Number(bVal)));

        if (isANumeric && isBNumeric) {
          const aNum = Number(aVal);
          const bNum = Number(bVal);
          if (sortConfig.direction === 'asc') return aNum - bNum;
          else return bNum - aNum;
        }

        // String comparison
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string, isNumeric: boolean = false) => {
    let direction: SortDirection = isNumeric ? 'asc' : 'desc'; // Default first click
    
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else {
        direction = 'asc';
      }
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
}

export function SortableHeader({ label, sortKey, isNumeric = false, currentSort, requestSort }: { 
  label: string; 
  sortKey: string; 
  isNumeric?: boolean; 
  currentSort: SortConfig | null; 
  requestSort: (key: string, isNumeric: boolean) => void 
}) {
  const isActive = currentSort?.key === sortKey;
  return (
    <th 
      onClick={() => requestSort(sortKey, isNumeric)} 
      style={{ cursor: 'pointer', userSelect: 'none', transition: 'background 0.2s' }}
      title={`Ordenar por ${label}`}
      className="sortable-th"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {label}
        <span style={{ 
          fontSize: '12px', 
          display: 'inline-block',
          transition: 'transform 0.2s ease, opacity 0.2s ease',
          opacity: isActive ? 1 : 0.3,
          transform: isActive && currentSort.direction === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          {isActive ? '↑' : '↕'}
        </span>
      </div>
    </th>
  );
}
