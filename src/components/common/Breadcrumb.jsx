import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome, HiChevronRight } from 'react-icons/hi';

export default function Breadcrumb({ items = [], className = "" }) {
  return (
    <nav className={`flex items-center text-xs md:text-sm text-slate-400 font-medium ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-slate-400 hover:text-amber-400 transition-colors"
          >
            <HiHome className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              <HiChevronRight className="w-3.5 h-3.5 text-slate-500 mx-1 flex-shrink-0" />
              {isLast || !item.href ? (
                <span className="text-amber-400 font-semibold truncate max-w-[200px] md:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-slate-300 hover:text-amber-400 transition-colors truncate max-w-[150px] md:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
