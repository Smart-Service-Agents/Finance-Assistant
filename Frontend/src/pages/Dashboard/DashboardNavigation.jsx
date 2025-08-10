import Button from "../../components/Generic/button";

export default function DashboardNavigationTabs({tabs, activeTab, setActiveTab}){
    return(
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <Button key={tab}
                    interact={() => setActiveTab(tab)}
                    design={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${activeTab === tab?
                        'border-blue-500 text-blue-600': 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    text={tab.charAt(0).toUpperCase() + tab.slice(1)}
                />
              ))}
            </div>
          </div>
        </div>
    );
}