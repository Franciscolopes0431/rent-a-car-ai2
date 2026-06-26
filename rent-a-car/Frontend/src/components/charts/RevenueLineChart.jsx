import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

function RevenueLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#34343a" />
        <XAxis dataKey="period" tick={{ fill: '#c4c4c8' }} />
        <YAxis tick={{ fill: '#c4c4c8' }} />
        <Tooltip formatter={(value) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)} />
        <Line type="monotone" dataKey="revenue" stroke="#f5b81c" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RevenueLineChart;
