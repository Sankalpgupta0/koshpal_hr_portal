import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getFinancialHealthDistribution, getParticipationByDepartment } from '../api/hr';

function FinancialHealthChart() {
  const [data, setData] = useState([
    { name: 'Low (0-39)', value: 0, color: '#F59E0B' },
    { name: 'Medium (40-69)', value: 0, color: '#334EAC' },
    { name: 'High (70-100)', value: 0, color: '#348958' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFinancialHealthDistribution();
        const chartData = response.distribution.map((item, idx) => ({
          name: item.category,
          value: item.value,
          color: idx === 0 ? '#F59E0B' : idx === 1 ? '#334EAC' : '#348958',
        }));
        setData(chartData);
      } catch (error) {
        console.error('Error fetching financial health distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-lg p-5 shadow-sm border flex flex-col gap-[30px] h-auto" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
      <div className="flex justify-between items-center  sm:h-[50px] mb-2">
        <div className='flex flex-col gap-[4px]'>
          <h3 className="text-h4" style={{ color: 'var(--color-text-primary)' }}>
          Financial Health Distribution
        </h3>
       <p className="text-caption" style={{ color: 'var(--color-text-secondary)' }}>Click a band to filter employee directory</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ParticipationChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getParticipationByDepartment();
        const chartData = response.map((dept) => ({
          department: dept.department,
          value: dept.participationRate,
        }));
        setData(chartData);
      } catch (error) {
        console.error('Error fetching participation by department:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-lg p-[25px] shadow-sm border flex flex-col gap-[40px] sm:h-[394px] h-[420px]" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
      <div className='flex justify-between items-center '>
        <h3 className="text-h4 mb-1" style={{ color: 'var(--color-text-primary)' }}>
        Participation by Department
      </h3>
      <p className="text-caption mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        % of eligible employees actively participating
      </p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" domain={[0, 8]} stroke="#6b7280" />
          <YAxis dataKey="department" type="category" stroke="#6b7280" width={100} />
          <Tooltip />
          <Bar dataKey="value" fill="#2B8997" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function AvgScoreTrendChart() {
  const data = [
    { month: 'May', score: 40 },
    { month: 'Jun', score: 42 },
    { month: 'Jul', score: 44 },
    { month: 'Aug', score: 46 },
    { month: 'Sep', score: 48 },
    { month: 'Oct', score: 49 },
    { month: 'Nov', score: 51 },
  ];

  return (
    <div className="rounded-lg p-[25px] shadow-sm border flex flex-col gap-[40px]" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
      <div className="flex justify-between items-center sm:h-[46px]">
        <div className='flex flex-col gap-[4px]'>
          <h3 className="text-h4" style={{ color: 'var(--color-text-primary)' }}>
            Avg Score Trend Over Time
          </h3>
          <span className="text-caption" style={{ color: 'var(--color-text-secondary)' }}>90-day rolling average with program markers</span>
        </div>
        
        <span className="text-caption px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>Data synced 10 mins ago</span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis domain={[0, 100]} stroke="#6b7280" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { FinancialHealthChart, ParticipationChart, AvgScoreTrendChart };

