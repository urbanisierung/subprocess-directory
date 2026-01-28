import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterGroup {
  title: string;
  options: FilterOption[];
}

interface FacetedSidebarProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const filterGroups: FilterGroup[] = [
  {
    title: "Category",
    options: [
      { label: "Finance", value: "finance", count: 12 },
      { label: "HR", value: "hr", count: 8 },
      { label: "Tech", value: "tech", count: 15 },
      { label: "Operations", value: "operations", count: 10 },
    ],
  },
  {
    title: "Complexity",
    options: [
      { label: "Simple", value: "low", count: 20 },
      { label: "Moderate", value: "mid", count: 15 },
      { label: "Complex", value: "high", count: 10 },
    ],
  },
  {
    title: "Elements",
    options: [
      { label: "User Task", value: "user-task", count: 25 },
      { label: "Service Task", value: "service-task", count: 30 },
      { label: "Gateway", value: "gateway", count: 18 },
      { label: "Subprocess", value: "subprocess", count: 12 },
    ],
  },
];

export default function FacetedSidebar({
  onFilterChange,
  isOpen,
  onToggle,
}: FacetedSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const handleFilterToggle = (groupTitle: string, value: string) => {
    const groupKey = groupTitle.toLowerCase();
    const currentFilters = selectedFilters[groupKey] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter((v) => v !== value)
      : [...currentFilters, value];

    const updatedFilters = {
      ...selectedFilters,
      [groupKey]: newFilters,
    };

    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  const totalFiltersCount = Object.values(selectedFilters).reduce(
    (acc, filters) => acc + filters.length,
    0
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 
          bg-white dark:bg-gray-900 border-r border-concrete-grey dark:border-gray-800 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto
        `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold dark:text-white">Filters</h2>
            {totalFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-orangemunda hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filter Groups */}
          <div className="space-y-6">
            {filterGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.options.map((option) => {
                    const groupKey = group.title.toLowerCase();
                    const isSelected = (selectedFilters[groupKey] || []).includes(
                      option.value
                    );

                    return (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleFilterToggle(group.title, option.value)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-orangemunda focus:ring-orangemunda cursor-pointer dark:bg-gray-800"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white flex-1">
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {option.count}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
