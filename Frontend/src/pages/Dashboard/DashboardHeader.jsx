import { useState, useRef, useEffect } from "react";
import { Building2, Users } from "lucide-react";
import AdminDropdown from "../../components/Dashboard/AdminDropDown";

import { useNavigate } from 'react-router-dom';

export default function DashboardHeader({ hotel }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const cookieNames = ["hotel", "email", "city", "country", "authenticated"];

    cookieNames.forEach(name => {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    });

    localStorage.removeItem('reviews_cache');
    localStorage.removeItem('reviews_ts');

    localStorage.removeItem('guestExperienceData');
    localStorage.removeItem('guestExperienceOptions');
    localStorage.removeItem('trajectoryData');
    localStorage.removeItem('trajectoryOptions');
    localStorage.removeItem('sentimentsData');
    localStorage.removeItem('sentimentsOptions');
    localStorage.removeItem('aiInsights');
    localStorage.removeItem('analysisTS');
    
    navigate('/');
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{hotel}</h1>
              <p className="text-sm text-gray-600">Management Dashboard</p>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>

            {dropdownOpen && <AdminDropdown onLogout={handleLogout} />}
          </div>
        </div>
      </div>
    </div>
  );
}
