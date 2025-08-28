'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchResult {
  _id: string;
  title: string;
  slug: string;
  type: 'caseStudy' | 'knowledgebaseArticle';
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handler to close dropdown if clicked outside
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?term=${query}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setIsOpen(data.length > 0);
        }
      } catch (error) {
        console.error('Search fetch error:', error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const getResultLink = (result: SearchResult) => {
    return result.type === 'caseStudy' ? `/case-studies/${result.slug}` : `/knowledge-base/${result.slug}`;
  };

  return (
    <div className="relative ml-6 flex-1 max-w-xs" ref={searchRef}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input 
        type="search" 
        placeholder="Search..." 
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(results.length > 0)}
      />
      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {results.map((result) => (
              <li key={result._id}>
                <Link href={getResultLink(result)} onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}>
                  <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <p className="font-semibold text-sm">{result.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {result.type === 'caseStudy' ? 'Case Study' : 'Knowledge Base'}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
