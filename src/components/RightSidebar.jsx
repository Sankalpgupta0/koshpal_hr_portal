import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHelpCircle, FiLogOut, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { getDashboardAlerts } from '../api/hr';
import { logout } from '../api/auth';

function RightSidebar() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getDashboardAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const quickActions = [
    { icon: FiHelpCircle, label: 'Contact Support', action: () => {} },
    { icon: FiLogOut, label: 'Logout', action: handleLogout },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return FiCheckCircle;
      case 'error':
        return FiAlertCircle;
      case 'warning':
        return FiAlertCircle;
      default:
        return FiInfo;
    }
  };

  const getAlertColors = (type) => {
    switch (type) {
      case 'success':
        return { icon: 'text-green-600', bg: 'bg-green-50' };
      case 'error':
        return { icon: 'text-red-600', bg: 'bg-red-50' };
      case 'warning':
        return { icon: 'text-yellow-600', bg: 'bg-yellow-50' };
      default:
        return { icon: 'text-blue-600', bg: 'bg-blue-50' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="p-3 shadow-sm border rounded-[14px] h-fit" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
        <h3 className="text-h5 mb-[10px]" style={{ color: 'var(--color-text-primary)' }}>Quick Actions</h3>
        <div className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="w-full flex items-center justify-center gap-4 px-3 h-[36px] py-2 rounded-lg border hover:opacity-80 transition-colors text-center"
                style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-primary)' }}
              >
                <Icon className="w-[16px] h-[16px]" />
                <span className="text-body-md">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
        <h3 className="text-h4 mb-4" style={{ color: 'var(--color-text-primary)' }}>Alerts</h3>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : alerts.length === 0 ? (
          <p className="text-caption text-center py-4" style={{ color: 'var(--color-text-secondary)' }}>
            No alerts at this time
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const Icon = getAlertIcon(alert.type);
              const colors = getAlertColors(alert.type);
              return (
                <div
                  key={index}
                  className={`${colors.bg} rounded-lg p-4 border border-gray-200`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${colors.icon} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <h4 className="text-subtitle mb-1" style={{ color: 'var(--color-text-primary)' }}>
                        {alert.title}
                      </h4>
                      <p className="text-caption" style={{ color: 'var(--color-text-secondary)' }}>{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    

      {/* Data Freshness */}
      <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
        <h3 className="text-h4 mb-4" style={{ color: 'var(--color-text-primary)' }}>Data Freshness</h3>
        <div className="space-y-3 text-body-md">
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-text-secondary)' }}>Last sync:</span>
            <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>10 mins ago</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-text-secondary)' }}>Data source:</span>
            <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Koshpal Analytics</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-text-secondary)' }}>Sample size:</span>
            <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>200 employees</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;

