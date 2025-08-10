export default function AdminDropdown({ onLogout }) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      <ul className="py-1 text-sm text-gray-700">
        <li>
          <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
        </li>
        <li>
          <a href="/preferences" className="block px-4 py-2 hover:bg-gray-100">Preferences</a>
        </li>
        <li>
          <a href="/premium" className="block px-4 py-2 hover:bg-gray-100">Premium</a>
        </li>
        <li>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
}