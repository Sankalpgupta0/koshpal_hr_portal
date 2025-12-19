import StatsCards from '../components/StatsCards';
import {
  FinancialHealthChart,
  ParticipationChart,
  AvgScoreTrendChart,
} from '../components/Charts';
import SessionEffectiveness from '../components/SessionEffectiveness';
import RightSidebar from '../components/RightSidebar';

function Dashboard() {
  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Stats Cards - Full Width */}
      <StatsCards />

      {/* Main Content and Right Sidebar Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Charts - Left Side */}
        <div className="lg:col-span-3 space-y-6">
          <FinancialHealthChart />
          <ParticipationChart />
          <AvgScoreTrendChart />
          <SessionEffectiveness />
        </div>

        {/* Right Sidebar Content */}
        <div className="col-span-1">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

