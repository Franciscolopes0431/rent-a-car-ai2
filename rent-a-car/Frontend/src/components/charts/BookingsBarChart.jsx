import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

function BookingsBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#34343a" />
        <XAxis dataKey="status" tick={{ fill: '#c4c4c8' }} />
        <YAxis tick={{ fill: '#c4c4c8' }} />
        <Tooltip />
        <Bar dataKey="count" fill="#f5b81c" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BookingsBarChart;
