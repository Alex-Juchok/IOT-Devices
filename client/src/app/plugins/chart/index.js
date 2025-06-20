import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ChartWidget = ({ dataPoints, label, unit, variant = "line", theme = "dark" }) => {
  const labels = dataPoints.map((point) => point.label);
  const values = dataPoints.map((point) => point.value);
  const data = {
    labels,
    datasets: [
      {
        label: unit,
        data: values,
        backgroundColor: '#3B82F6',
        borderColor: '#10B981',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: `${theme=='light'?"black":"white"}` },
      },
    },
    scales: {
      x: { ticks: { color: `${theme=='light'?"black":"white"}` } },
      y: { ticks: {  color: `${theme=='light'?"black":"white"}`} },
    },
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow-md col-span-1 md:col-span-2">
      <h3 className="text-black dark:text-white text-lg font-semibold mb-3">{label}</h3>
      {variant === "bar" ? (
        <Bar data={data} options={options} />
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
};


export default {
  type: "chart1", // тип устройства
  name: "Chart-component",
  component: ChartWidget
};
