// Advanced search component with filters and suggestions
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  FileText, 
  Folder, 
  Clock,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { DataRoomItem, SearchFilter } from '@/types/enhanced';

interface AdvancedSearchProps {
  onSearch: (filter: SearchFilter) => void;
  recentSearches?: string[];
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

export function AdvancedSearch({
  onSearch,
  recentSearches = [],
  suggestions = [],
  placeholder = "Search files and folders...",
  className = ""
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({
    query: '',
    type: undefined,
    dateRange: undefined,
    sizeRange: undefined
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const searchFilter: SearchFilter = {
      ...filters,
      query: searchQuery || query
    };

    onSearch(searchFilter);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setShowFilters(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({ query: '', type: undefined, dateRange: undefined, sizeRange: undefined });
    onSearch({ query: '' });
    inputRef.current?.focus();
  };

  const clearFilters = () => {
    setFilters({ query, type: undefined, dateRange: undefined, sizeRange: undefined });
  };

  const hasActiveFilters = filters.type || filters.dateRange || filters.sizeRange;

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase()) && suggestion !== query
  );

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFilters(prev => ({ ...prev, query: e.target.value }));
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-20 py-3 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-200 text-sm placeholder-gray-400"
        />
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title="Advanced filters"
          >
            <Filter size={16} />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></div>
            )}
          </button>

          {/* Clear Button */}
          {(query || hasActiveFilters) && (
            <button
              onClick={clearSearch}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-large z-50 overflow-hidden">
          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                <Clock size={12} />
                Recent Searches
              </div>
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    handleSearch(search);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                <Search size={12} />
                Suggestions
              </div>
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Search Button */}
          {query && (
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => handleSearch()}
                className="w-full btn-primary justify-center"
              >
                <Search size={16} />
                Search for &ldquo;{query}&rdquo;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-large z-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* File Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, type: undefined }))}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    !filters.type
                      ? 'border-primary-300 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, type: 'file' }))}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    filters.type === 'file'
                      ? 'border-primary-300 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <FileText size={14} />
                  Files
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, type: 'folder' }))}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                    filters.type === 'folder'
                      ? 'border-primary-300 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Folder size={14} />
                  Folders
                </button>
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Modified
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateRange?.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const start = e.target.value ? new Date(e.target.value) : undefined;
                    setFilters(prev => ({
                      ...prev,
                      dateRange: start ? { start, end: prev.dateRange?.end || new Date() } : undefined
                    }));
                  }}
                  className="input text-sm"
                  placeholder="From date"
                />
                <input
                  type="date"
                  value={filters.dateRange?.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const end = e.target.value ? new Date(e.target.value) : undefined;
                    setFilters(prev => ({
                      ...prev,
                      dateRange: end ? { start: prev.dateRange?.start || new Date(), end } : undefined
                    }));
                  }}
                  className="input text-sm"
                  placeholder="To date"
                />
              </div>
            </div>

            {/* File Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Size (MB)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.sizeRange?.min ? (filters.sizeRange.min / (1024 * 1024)).toFixed(1) : ''}
                  onChange={(e) => {
                    const min = e.target.value ? parseFloat(e.target.value) * 1024 * 1024 : undefined;
                    setFilters(prev => ({
                      ...prev,
                      sizeRange: min ? { min, max: prev.sizeRange?.max || Infinity } : undefined
                    }));
                  }}
                  className="input text-sm"
                  placeholder="Min size"
                  min="0"
                  step="0.1"
                />
                <input
                  type="number"
                  value={filters.sizeRange?.max && filters.sizeRange.max !== Infinity ? (filters.sizeRange.max / (1024 * 1024)).toFixed(1) : ''}
                  onChange={(e) => {
                    const max = e.target.value ? parseFloat(e.target.value) * 1024 * 1024 : undefined;
                    setFilters(prev => ({
                      ...prev,
                      sizeRange: max ? { min: prev.sizeRange?.min || 0, max } : undefined
                    }));
                  }}
                  className="input text-sm"
                  placeholder="Max size"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                handleSearch();
                setShowFilters(false);
              }}
              className="btn-primary w-full justify-center"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}