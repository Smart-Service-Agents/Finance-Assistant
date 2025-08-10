import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function FilterDropdown({ options, onSelectionChange, placeholder = "Select Options", maxVisible }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localOptions, setLocalOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOptions = localOptions.filter(option => option.selected);
  const visibleOptions = selectedOptions.slice(0, maxVisible);
  const hiddenCount = selectedOptions.length - maxVisible;

  const toggleOption = (optionId) => {
    const updatedOptions = localOptions.map(option =>
      option.id === optionId ? { ...option, selected: !option.selected } : option
    );
    setLocalOptions(updatedOptions);
    onSelectionChange(updatedOptions.filter(opt => opt.selected).map(opt => opt.id));
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder;

    const visibleText = visibleOptions.map(opt => opt.label).join(', ');
    if (hiddenCount > 0) {
      return `${visibleText} +${hiddenCount} more`;
    }
    return visibleText;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <span className="text-gray-700 truncate">{getDisplayText()}</span>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {localOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-150"
            >
              <span className="text-gray-700">{option.label}</span>
              {option.selected && (
                <Check size={16} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}