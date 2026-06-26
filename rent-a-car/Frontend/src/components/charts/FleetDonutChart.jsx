import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#f5b81c', '#6c757d', '#0dcaf0', '#198754', '#d63384'];

function FleetDonutChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} fill="#f5b81c" paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend verticalAlign="bottom" wrapperStyle={{ color: '#c4c4c8' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default FleetDonutChart;
