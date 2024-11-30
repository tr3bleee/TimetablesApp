import { useCallback, useMemo, useState } from 'react';

type SearchableItem = {
  [key: string]: any;
};

type SearchFunction<T> = (item: T) => string[];
type SortFunction<T> = (a: T, b: T) => number;

export function useSearch<T extends SearchableItem>(
  items: T[],
  getSearchFields?: SearchFunction<T>,
  sortItems?: SortFunction<T>
) {
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return sortItems ? [...items].sort(sortItems) : items;
    }

    const searchQuery = query.toLowerCase().trim();

    return items.filter(item => {
      if (getSearchFields) {
        // Используем переданную функцию для получения полей поиска
        const searchFields = getSearchFields(item);
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery)
        );
      }
      
      // Если функция поиска не передана, ищем по всем строковым полям
      return Object.values(item).some(value => 
        typeof value === 'string' && 
        value.toLowerCase().includes(searchQuery)
      );
    }).sort(sortItems);
  }, [items, query, getSearchFields, sortItems]);

  return {
    query,
    filteredItems,
    handleSearch,
    clearSearch
  };
} 