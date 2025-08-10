import { BarChart3, TrendingUp, TrendingDown, PieChart, Brain } from "lucide-react";
import { useState, useEffect } from 'react';

import FilterDropdown from "../../../components/Generic/FilterDropdown";

// import ReviewSection from "../../../sections/ReviewsSection";

import BarChart from "../../../components/Generic/Charts/BarChart";
import LineChart from "../../../components/Generic/Charts/LineChart";
import DonutChart from "../../../components/Generic/Charts/DonutChart";

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}


export default function DashboardAnalysis() {
  const [loaded, setIsLoaded] = useState(false);

  const [guestExperienceOptions, setGuestExperienceOptions] = useState([]);
  const [guestExperienceData, setGuestExperienceData] = useState([]);
  const [currentExperienceData, setCurrentExperienceData] = useState([]);
  
  const [trajectoryOptions, setTrajectoryOptions] = useState([]);
  const [trajectoryData, setTrajectoryData] = useState([]);

  const [sentimentOptions, setSentimentOptions] = useState([]);
  const [sentimentsData, setSentimentsData] = useState({});
  const [currentSentimentData, setCurrentSentimentData] = useState([]);

  // const [positiveReviews, setPositiveReviews] = useState([]);
  // const [negativeReviews, setNegativeReviews] = useState([]);
  // const [neutralReviews, setNeutralReviews] = useState([]);

  const [reviewCount, setReviewCount] = useState(0);

  const [aiInsights, setAiInsights] = useState([]);

  useEffect(() => {
    let reviews = JSON.parse(localStorage.getItem('reviews_cache') || '[]');

    (async () => {
      if (!loaded) {
        console.log("Reviews before loading: ", reviews);
        console.log("Type of reviews: ", typeof reviews);
        if (reviews == '[]' || reviews == '' || reviews == null)
        {
          console.log("Extracting reviews");

          const hotel = getCookie('hotel');
          const city = getCookie('city');
          const region = getCookie('country');

          const uri = process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_REVIEWS_PATH

          const response = await fetch(uri, {
              method: 'POST',
              headers:  { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ hotel, city, region, master:'rey-master-eo' })
          });

          const data = await response.json();
          
          console.log(data);
          
          localStorage.setItem('reviews_cache', JSON.stringify(data));
          localStorage.setItem('reviews_ts', Date.now().toString());
          
          reviews = data;
        }

        setReviewCount(reviews.length);
        const rawGED = JSON.parse(localStorage.getItem('guestExperienceData'));
        const rawGEO = JSON.parse(localStorage.getItem('guestExperienceOptions'));
        const rawTD = JSON.parse(localStorage.getItem('trajectoryData'));
        const rawTO = JSON.parse(localStorage.getItem('trajectoryOptions'));
        const rawSD = JSON.parse(localStorage.getItem('sentimentsData'));
        const rawSO = JSON.parse(localStorage.getItem('sentimentsOptions'));
        const rawAI = JSON.parse(localStorage.getItem('aiInsights'));

        console.log("Debug: "+rawGEO)

        const rawTS = localStorage.getItem('analysisTS');

        if (rawGED && rawGEO && rawTD && rawTO && rawSD && rawSO && rawAI && rawTS) {
          const ONE_DAY_MS = 24 * 60 * 60 * 1000;
          if ((Date.now() - Number(rawTS)) < ONE_DAY_MS) {
            setGuestExperienceData(rawGED);
            setGuestExperienceOptions(rawGEO);

            setTrajectoryData(rawTD);
            setTrajectoryOptions(rawTO);

            setSentimentsData(rawSD);
            setSentimentOptions(rawSO);

            setAiInsights(rawAI);
          }
        }
        else {
          const uri = process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_ANALYSIS_PATH

          console.log("Uri: " + uri)
          const response = await fetch(uri, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ meta_data: { reviews: reviews } })
          });

          const data = await response.json();

          // const reviewReactions = data.reviewReactions;

          // const positive = reviewReactions.filter(item => item.sentiment === "Positive");
          // const negative = reviewReactions.filter(item => item.sentiment === "Negative");
          // const neutral = reviewReactions.filter(item => item.sentiment === "Neutral");

          // setPositiveReviews(positive);
          // setNegativeReviews(negative);
          // setNeutralReviews(neutral);

          setGuestExperienceData(data.guestExperienceData);
          setGuestExperienceOptions(data.guestExperienceOptions);

          setTrajectoryData(data.trajectoryData);
          setTrajectoryOptions(data.trajectoryOptions);

          setSentimentsData(data.sentimentsData);
          setSentimentOptions(data.sentimentsOptions);

          setAiInsights(data.aiInsights);

          localStorage.setItem('guestExperienceData', JSON.stringify(data.guestExperienceData));
          localStorage.setItem('guestExperienceOptions', JSON.stringify(data.guestExperienceOptions));
          localStorage.setItem('trajectoryData', JSON.stringify(data.trajectoryData));
          localStorage.setItem('trajectoryOptions', JSON.stringify(data.trajectoryOptions));
          localStorage.setItem('sentimentsData', JSON.stringify(data.sentimentsData));
          localStorage.setItem('sentimentsOptions', JSON.stringify(data.sentimentsOptions));
          localStorage.setItem('aiInsights', JSON.stringify(data.aiInsights));
          localStorage.setItem('analysisTS', Date.now().toString());

          // console.log('reviews: ' + localStorage.getItem('reviews_cache'));
          
          // console.log('analysis: ');
          // console.log(localStorage.getItem('guestExperienceData'));
          // console.log(localStorage.getItem('guestExperienceOptions'));
          // console.log(localStorage.getItem('trajectoryData'));
          // console.log(localStorage.getItem('trajectoryOptions'));
          // console.log(localStorage.getItem('sentimentsData'));
          // console.log(localStorage.getItem('sentimentsOptions'));
          // console.log(localStorage.getItem('aiInsights'));
          
        }
        setIsLoaded(true);
      }
    })();
  });

  useEffect(() => {
    if (!sentimentsData || !sentimentOptions.length) return;

    const selectedSentiment = sentimentOptions.find(item => item.selected);
    const selectedLabel = selectedSentiment ? selectedSentiment.label : 'Overall';

    const data = sentimentsData[selectedLabel];


    const selectedExperience = guestExperienceOptions.filter(item => item.selected).map(item => item.label);
    const selectedExperienceData = guestExperienceData.filter(item => selectedExperience.includes(item.label));
    setCurrentExperienceData((Array.isArray(selectedExperienceData) ? selectedExperienceData : []));

    if (Array.isArray(data)) {
      setCurrentSentimentData(data);
    } else {
      setCurrentSentimentData([]);
    }
  }, [sentimentsData, sentimentOptions, guestExperienceData, guestExperienceOptions]);

  // Generate analysis for inline display
  const getGuestExperienceAnalysis = () => {
    const selectedData = currentExperienceData;
    const lowestRated = selectedData.reduce((min, item) => item.value < min.value ? item : min, selectedData[0]);
    const highestRated = selectedData.reduce((max, item) => item.value > max.value ? item : max, selectedData[0]);
    
    return {
      summary: `${highestRated?.label} leads with ${highestRated?.value}/5, while ${lowestRated?.label} needs attention at ${lowestRated?.value}/5.`,
      insights: [
        `${highestRated?.label} is your strongest area - leverage this in marketing`,
        `${lowestRated?.label} requires immediate focus to improve guest satisfaction`,
        `Average performance across selected categories: ${(selectedData.reduce((sum, item) => sum + item.value, 0) / selectedData.length).toFixed(1)}/5`
      ],
      priority: lowestRated?.value < 3.5 ? 'high' : lowestRated?.value < 4.0 ? 'medium' : 'low'
    };
  };

  const getTrajectoryAnalysis = () => {
    const data = trajectoryData;
    const selectedMetric = trajectoryOptions.find(opt => opt.selected)?.label || 'Average Rating';
    const latest = data[data.length - 1]?.value || 0;
    const previous = data[data.length - 2]?.value || 0;
    const change = latest - previous;
    const trend = change > 0.1 ? 'improving' : change < -0.1 ? 'declining' : 'stable';
    
    return {
      summary: `${selectedMetric} is ${trend === 'improving' ? 'trending upward' : trend === 'declining' ? 'declining' : 'stable'} at ${latest}.`,
      insights: [
        `Current performance: ${latest}/5`,
        `${change >= 0 ? 'Increased' : 'Decreased'} by ${Math.abs(change).toFixed(1)} from last month`,
        trend === 'improving' ? 'Maintain current strategies' : trend === 'declining' ? 'Implement improvement plan' : 'Consider optimization opportunities'
      ],
      trend,
      priority: trend === 'declining' ? 'high' : trend === 'stable' ? 'medium' : 'low'
    };
  };

  const getSentimentAnalysis = () => {
    const data = currentSentimentData;
    const selectedCategory = sentimentOptions.find(opt => opt.selected)?.label || 'Overall';
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const positive = data.find(item => item.label === 'Positive')?.value || 0;
    const negative = data.find(item => item.label === 'Negative')?.value || 0;
    const positivePercent = ((positive / total) * 100).toFixed(1);
    
    return {
      summary: `${selectedCategory} sentiment: ${positivePercent}% positive from ${total} reviews analyzed.`,
      insights: [
        `${positive} positive mentions vs ${negative} negative mentions`,
        positive > negative * 2 ? 'Strong positive sentiment indicates satisfaction' : 'Mixed feedback requires attention',
        `Focus on addressing the ${negative} negative reviews to improve overall sentiment`
      ],
      priority: positive > negative * 2 ? 'low' : 'medium'
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'declining':
        return <TrendingDown size={16} className="text-red-600" />;
      default:
        return <div className="w-4 h-0.5 bg-gray-400 rounded"></div>;
    }
  };
  


  return loaded ? (
    <div className="space-y-8">
      {/* First Row - AI Analysis (Full Width) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">AI Analysis</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiInsights.map((insight) => (
            <div key={insight.id} className={`border rounded-lg p-4 ${getPriorityColor(insight.priority)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {insight.icon}
                  <h4 className="font-semibold text-gray-800 text-sm">{insight.title}</h4>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(insight.priority)}`}>
                  {insight.priority}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="bg-white px-2 py-1 rounded-full text-gray-600">
                    {insight.category}
                  </span>
                  <span className="text-gray-600">
                    Impact: <span className="font-medium">{insight.impact}</span>
                  </span>
                </div>
                <span className="text-gray-600">
                  {insight.timeframe}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Second Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Guest Experience */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Guest Experience</h2>
          </div>

          <div className="mb-6">
            <FilterDropdown
              options={guestExperienceOptions}
              onSelectionChange={(selectedIds) => {
                setGuestExperienceOptions(prev =>
                  prev.map(opt => ({ ...opt, selected: selectedIds.includes(opt.id) }))
                );
              }}
              placeholder="Select experience categories"
              maxVisible={3}
            />
          </div>

          <BarChart
            data={currentExperienceData}
            title="Rating by Category"
            maxValue={5}
          />

          {/* Inline AI Analysis */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-blue-600" />
              <h4 className="font-semibold text-blue-800">AI Analysis</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(getGuestExperienceAnalysis().priority)}`}>
                {getGuestExperienceAnalysis().priority} priority
              </span>
            </div>
            <p className="text-sm text-blue-700 mb-3">{getGuestExperienceAnalysis().summary}</p>
            <ul className="space-y-1">
              {getGuestExperienceAnalysis().insights.map((insight, index) => (
                <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Hotel Trajectory */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Hotel Trajectory</h2>
          </div>
          
          <div className="mb-6">
            <FilterDropdown
              options={trajectoryOptions}
              onSelectionChange={(selectedIds) => {
                setTrajectoryOptions(prev =>
                  prev.map(opt => ({ ...opt, selected: selectedIds.includes(opt.id) && selectedIds.length === 1 }))
                );
                
                if (selectedIds.length > 0) {
                  setTrajectoryOptions(prev =>
                    prev.map(opt => ({ ...opt, selected: opt.id === selectedIds[selectedIds.length - 1] }))
                  );
                }
              }}
              placeholder="Select metric to track"
              maxVisible={1}
            />
          </div>
          
          <LineChart
            data={trajectoryData}
            title="Performance Over Time"
            color="#10B981"
          />

          {/* Inline AI Analysis */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-green-600" />
              <h4 className="font-semibold text-green-800">AI Analysis</h4>
              <div className="flex items-center gap-2">
                {getTrendIcon(getTrajectoryAnalysis().trend)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(getTrajectoryAnalysis().priority)}`}>
                  {getTrajectoryAnalysis().priority} priority
                </span>
              </div>
            </div>
            <p className="text-sm text-green-700 mb-3">{getTrajectoryAnalysis().summary}</p>
            <ul className="space-y-1">
              {getTrajectoryAnalysis().insights.map((insight, index) => (
                <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <PieChart size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Sentiment Analysis</h2>
        </div>
        
        <div className="mb-6 max-w-xs">
          <FilterDropdown
            options={sentimentOptions}
            onSelectionChange={(selectedIds) => {
              setSentimentOptions(prev =>
                prev.map(opt => ({ ...opt, selected: selectedIds.includes(opt.id) && selectedIds.length === 1 }))
              );
              
              if (selectedIds.length > 0) {
                setSentimentOptions(prev =>
                  prev.map(opt => ({ ...opt, selected: opt.id === selectedIds[selectedIds.length - 1] }))
                );
              }
            }}
            placeholder="Select category"
            maxVisible={1}
          />
        </div>
        
        <DonutChart
          data={currentSentimentData}
          title="Review Sentiment Distribution"
          reviews={reviewCount}
        />

        {/* Inline AI Analysis */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-purple-600" />
            <h4 className="font-semibold text-purple-800">AI Analysis</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(getSentimentAnalysis().priority)}`}>
              {getSentimentAnalysis().priority} priority
            </span>
          </div>
          <p className="text-sm text-purple-700 mb-3">{getSentimentAnalysis().summary}</p>
          <ul className="space-y-1">
            {getSentimentAnalysis().insights.map((insight, index) => (
              <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                {insight}
              </li>
            ))}
          </ul>
        </div>

      </div>
      
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReviewSection
          reviews={positiveReviews}
          title="Positive Reviews"
          icon={<ThumbsUp size={20} className="text-green-600" />}
          bgColor="bg-green-50"
          borderColor="border-green-200"
        />
        
        <ReviewSection
          reviews={neutralReviews}
          title="Neutral Reviews"
          icon={<Minus size={20} className="text-gray-600" />}
          bgColor="bg-gray-50"
          borderColor="border-gray-200"
        />
        
        <ReviewSection
          reviews={negativeReviews}
          title="Negative Reviews"
          icon={<ThumbsDown size={20} className="text-red-600" />}
          bgColor="bg-red-50"
          borderColor="border-red-200"
        />
      </div> */}
    </div>
  ) : (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Performance Analysis</h2>
          <p className="text-gray-600">
            Detailed insights into your hotel's performance metrics and trends.
          </p>
          <div className="mt-8 text-sm text-gray-500">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}