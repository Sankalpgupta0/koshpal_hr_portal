import { useState, useEffect } from 'react';
import { FiUsers, FiTrendingUp, FiActivity, FiCalendar } from 'react-icons/fi';
import { getDashboardStats } from '../api/hr';

function StatsCards() {
  const [stats, setStats] = useState([
    {
      title: 'EMPLOYEE MONITORED',
      value: '0',
      change: '+0%',
      icon: FiUsers,
      bgColor: 'bg-gradient-to-br from-[#334EAC] to-[#5B70C7]',
      textColor: 'text-white',
      accentColor: '#FFFFFF33',
    },
    {
      title: 'AVG FINANCIAL HEALTH',
      value: '0',
      change: 'This Month',
      icon: FiTrendingUp,
      bgColor: 'bg-gradient-to-br from-[#67A682] to-[#85C09E]',
      textColor: 'text-white',
      accentColor: '#FFFFFF33',
    },
    {
      title: 'PARTICIPATION RATE',
      value: '0%',
      change: '0%',
      icon: FiActivity,
      bgColor: 'bg-gradient-to-br from-[#EB8A14] to-[#F5A84B]',
      textColor: 'text-white',
      accentColor: '#FFFFFF33',
    },
    {
      title: 'SESSIONS THIS PERIOD',
      value: '0',
      change: '0% Rate',
      icon: FiCalendar,
      bgColor: 'bg-gradient-to-br from-[#17A2B8] to-[#4BB7C9]',
      textColor: 'text-white',
      accentColor: '#FFFFFF33',
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats([
          {
            title: 'EMPLOYEE MONITORED',
            value: data.employeeMonitored.toString(),
            change: data.employeeMonitoredChange,
            icon: FiUsers,
            bgColor: 'bg-gradient-to-br from-[#334EAC] to-[#5B70C7]',
            textColor: 'text-white',
            accentColor: '#FFFFFF33',
          },
          {
            title: 'AVG FINANCIAL HEALTH',
            value: data.avgFinancialHealth.toString(),
            change: data.avgFinancialHealthPeriod,
            icon: FiTrendingUp,
            bgColor: 'bg-gradient-to-br from-[#67A682] to-[#85C09E]',
            textColor: 'text-white',
            accentColor: '#FFFFFF33',
          },
          {
            title: 'PARTICIPATION RATE',
            value: `${data.participationRate}%`,
            change: data.participationRateChange,
            icon: FiActivity,
            bgColor: 'bg-gradient-to-br from-[#EB8A14] to-[#F5A84B]',
            textColor: 'text-white',
            accentColor: '#FFFFFF33',
          },
          {
            title: 'SESSIONS THIS PERIOD',
            value: data.sessionsThisPeriod.toString(),
            change: `${data.sessionsRate} Rate`,
            icon: FiCalendar,
            bgColor: 'bg-gradient-to-br from-[#17A2B8] to-[#4BB7C9]',
            textColor: 'text-white',
            accentColor: '#FFFFFF33',
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="w-full">
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="lg:hidden overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-min">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} ${stat.textColor} rounded-2xl p-5 h-[145.2px] shadow-lg relative overflow-hidden flex-shrink-0 w-80`}
              >
                {/* Background Circle */}
                <div 
                  className="absolute -right-[3.5rem] -top-[2.5rem] h-32 w-32 rounded-full opacity-10"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 255)' }}
                ></div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="p-[10px] rounded-2xl" style={{ backgroundColor: stat.accentColor }}>
                      <Icon className="w-[20px] h-[20px]" />
                    </div>
                    {stat.change && (
                      <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: stat.accentColor }}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider opacity-90">
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    {stat.subtitle && stat.change && (
                      <span className="text-sm opacity-80">{stat.subtitle}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.textColor} rounded-2xl p-5 h-[145.2px] shadow-lg relative overflow-hidden`}
            >
              {/* Background Circle */}
              <div 
                className="absolute -right-[3.5rem] -top-[2.5rem] h-32 w-32 rounded-full opacity-10"
                style={{ backgroundColor: 'rgba(255, 255, 255, 255)' }}
              ></div>

              {/* Content */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-[10px] rounded-2xl" style={{ backgroundColor: stat.accentColor }}>
                    <Icon className="w-[20px] h-[20px]" />
                  </div>
                  {stat.change && (
                    <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: stat.accentColor }}>
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-90">
                  {stat.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  {stat.subtitle && stat.change && (
                    <span className="text-sm opacity-80">{stat.subtitle}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatsCards;

