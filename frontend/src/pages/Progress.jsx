import React, { useState } from "react";
import { format, subDays, subMonths } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Weight,
  Dumbbell,
  Apple,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useUser } from "../context/UserContext";

const Progress = () => {
  const {
    user,
    weightHistory = [],
    exerciseLogs = [],
    nutritionLogs=[],
    addWeightLog,
  } = useUser(); // Default exerciseLogs to an empty array
  // Default to an empty array if weightHistory is undefined
  const [timeRange, setTimeRange] = useState("month");
  const [newWeight, setNewWeight] = useState(user.weight);
  const [showAddWeight, setShowAddWeight] = useState(false);

  const getWeightData = () => {
    if (!weightHistory.length) {
      const today = new Date();
      return Array.from({ length: 10 }, (_, i) => ({
        date: format(subDays(today, i * 3), "MMM dd"),
        weight: user.weight - Math.random() * 0.5 * i,
      })).reverse();
    }
    return [...weightHistory]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((log) => ({
        date: format(new Date(log.date), "MMM dd"),
        weight: log.weight,
      }));
  };

  const getExerciseData = () => {
    const today = new Date();
    const startDate =
      timeRange === "week"
        ? subDays(today, 7)
        : timeRange === "month"
        ? subMonths(today, 1)
        : subMonths(today, 12);

    const filteredLogs = exerciseLogs.filter(
      (log) => new Date(log.date) >= startDate && log.completed
    );

    const groupedData = {};
    filteredLogs.forEach((log) => {
      const dateStr = format(new Date(log.date), "MMM dd");
      groupedData[dateStr] = (groupedData[dateStr] || 0) + log.caloriesBurned;
    });

    return Object.entries(groupedData).map(([date, calories]) => ({
      date,
      calories,
    }));
  };

  const getNutritionData = () => {
    const today = new Date();
    const startDate =
      timeRange === "week"
        ? subDays(today, 7)
        : timeRange === "month"
        ? subMonths(today, 1)
        : subMonths(today, 12);

    const filteredLogs = nutritionLogs.filter(
      (log) => new Date(log.date) >= startDate
    );

    const groupedData = {};
    filteredLogs.forEach((log) => {
      const dateStr = format(new Date(log.date), "MMM dd");
      if (!groupedData[dateStr]) {
        groupedData[dateStr] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }
      groupedData[dateStr].calories += log.calories;
      groupedData[dateStr].protein += log.protein;
      groupedData[dateStr].carbs += log.carbs;
      groupedData[dateStr].fat += log.fat;
    });

    return Object.entries(groupedData).map(([date, data]) => ({
      date,
      ...data,
    }));
  };

  const handleAddWeight = () => {
    if (newWeight > 0) {
      addWeightLog(newWeight);
      setShowAddWeight(false);
    }
  };

  const weightData = getWeightData();
  const exerciseData = getExerciseData();
  const nutritionData = getNutritionData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Progress Tracking</h1>
        <div className="flex space-x-2">
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === range
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Current Weight",
            value: `${user.weight} kg`,
            icon: <Weight />,
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            label: "Calories Burned",
            value: `${exerciseData.reduce(
              (sum, item) => sum + item.calories,
              0
            )} kcal`,
            icon: <Dumbbell />,
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            label: "Calories Consumed",
            value: `${nutritionData.reduce(
              (sum, item) => sum + item.calories,
              0
            )} kcal`,
            icon: <Apple />,
            bg: "bg-red-100",
            color: "text-red-600",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-start"
          >
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <div className={`${card.bg} p-2 rounded-lg`}>
              <div className={`h-6 w-6 ${card.color}`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Weight Chart */}
      <ChartCard
        title="Weight History"
        showAdd
        onAdd={() => setShowAddWeight(!showAddWeight)}
      >
        {showAddWeight && (
          <div className="mb-4 flex gap-2">
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(+e.target.value)}
              className="border p-2 rounded"
            />
            <button
              className="bg-indigo-600 text-white px-3 py-2 rounded"
              onClick={handleAddWeight}
            >
              Save
            </button>
          </div>
        )}
        <ChartWrapper data={weightData} dataKey="weight" color="#4f46e5" />
      </ChartCard>

      {/* Calories Burned */}
      <ChartCard title="Calories Burned">
        <ChartWrapper
          data={exerciseData}
          dataKey="calories"
          type="bar"
          color="#22c55e"
        />
      </ChartCard>

      {/* Nutrition Breakdown */}
      <ChartCard title="Nutrition Breakdown">
        <ChartWrapper data={nutritionData} stacked />
      </ChartCard>
    </div>
  );
};

const ChartCard = ({ title, children, showAdd, onAdd }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold">{title}</h3>
      {showAdd && (
        <button
          className="bg-indigo-600 text-white px-3 py-1 rounded"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </button>
      )}
    </div>
    {children}
  </div>
);

const ChartWrapper = ({ data, dataKey, type = "line", color, stacked }) => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      {type === "line" ? (
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} />
        </LineChart>
      ) : (
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {stacked ? (
            ["protein", "carbs", "fat"].map((key) => (
              <Bar key={key} dataKey={key} stackId="a" />
            ))
          ) : (
            <Bar dataKey={dataKey} fill={color} />
          )}
        </BarChart>
      )}
    </ResponsiveContainer>
  </div>
);

export default Progress;
