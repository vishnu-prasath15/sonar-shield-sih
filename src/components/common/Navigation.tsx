import React from 'react';
import { 
  Scan, 
  Table, 
  Map as MapIcon, 
  CheckSquare, 
  FileText, 
  FolderGit2,
  AlertCircle
} from 'lucide-react';

export type NavTab = 'survey' | 'sonar' | 'detections' | 'map' | 'review' | 'reports';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingReviewCount: number;
  totalDetectionsCount: number;
  highRiskCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingReviewCount,
  totalDetectionsCount,
  highRiskCount,
}) => {
  const tabs = [
    { 
      id: 'sonar' as NavTab, 
      label: 'Sonar Analysis', 
      icon: Scan, 
      badge: totalDetectionsCount > 0 ? `${totalDetectionsCount}` : undefined,
      badgeColor: 'bg-blue-600 text-white'
    },
    { 
      id: 'detections' as NavTab, 
      label: 'Detections', 
      icon: Table, 
      badge: totalDetectionsCount > 0 ? `${totalDetectionsCount}` : undefined,
      badgeColor: 'bg-slate-700 text-slate-200'
    },
    { 
      id: 'map' as NavTab, 
      label: 'Map View', 
      icon: MapIcon,
      badge: highRiskCount > 0 ? `${highRiskCount} High Risk` : undefined,
      badgeColor: 'bg-red-600 text-white'
    },
    { 
      id: 'review' as NavTab, 
      label: 'Review Queue', 
      icon: CheckSquare,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} Pending` : undefined,
      badgeColor: 'bg-amber-600 text-white'
    },
    { 
      id: 'reports' as NavTab, 
      label: 'Survey Reports', 
      icon: FileText,
      badge: undefined,
      badgeColor: ''
    },
    { 
      id: 'survey' as NavTab, 
      label: 'Survey Info', 
      icon: FolderGit2,
      badge: undefined,
      badgeColor: ''
    }
  ];

  return (
    <nav className="bg-slate-900/95 border-b border-slate-800 px-4 flex items-center justify-between text-xs select-none">
      <div className="flex items-center space-x-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 font-medium transition-colors border-b-2 ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-slate-800/60'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="tracking-wide">{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Status Helper */}
      <div className="hidden md:flex items-center space-x-4 text-[11px] font-mono text-slate-400">
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
          High Risk Anomaly Alert: <strong className="ml-1 text-slate-200">{highRiskCount} targets</strong>
        </span>
        <span className="text-slate-600">|</span>
        <span>Acoustic Grid: <strong className="text-slate-200">150m Swath Corridor</strong></span>
      </div>
    </nav>
  );
};
