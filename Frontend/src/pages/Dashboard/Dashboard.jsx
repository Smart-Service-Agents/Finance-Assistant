import { useState } from 'react';
// import { Star, TrendingUp, BarChart3 } from 'lucide-react';
import DashboardReviews from './Tabs/DashboardReviews';
import DashboardAnalysis from './Tabs/DashboardAnalysis';
import DashboardCompetition from './Tabs/DashboardCompetition';
import DashboardAssistant from './Tabs/DashboardAssistant';
import DashboardNavigationTabs from '../Dashboard/DashboardNavigation';
import DashboardHeader from '../Dashboard/DashboardHeader';

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

// const getTabIcon = (tab) => {
//   switch (tab) {
//     case 'reviews':
//       return <Star size={20} />;
//     case 'competition':
//       return <TrendingUp size={20} />;
//     case 'analysis':
//       return <BarChart3 size={20} />;
//     default:
//       return <Star size={20} />;
//   }
// };

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('analysis');
    // eslint-disable-next-line no-unused-vars
    const [tabs, setTabs] = useState([
        'analysis', 'competition', 'reviews', 'assistant'
    ]);
    
    const renderTabContent = () =>{
        switch (activeTab) {
            case 'reviews':
              return(<DashboardReviews hotel={ getCookie('hotel') } city={ getCookie('city') } region={ getCookie('country') } />);
            case 'competition':
              return(<DashboardCompetition />);
            case 'analysis':
              return(<DashboardAnalysis />);
            case 'assistant':
              return(<DashboardAssistant />);
            default:
              return(<></>);
        }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">

        <DashboardHeader hotel={getCookie('hotel')}/>
        <DashboardNavigationTabs tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab}/>

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>
      </div>
    );
}