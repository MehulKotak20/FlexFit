import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Weight, Dumbbell, Apple } from "lucide-react";

const TodaysFitnessCharts = () => {
  // Today's data for calories burned
  const caloriesBurnedToday = 1500; // Total calories burned today

  // Today's weight
  const currentWeight = 76;

  // Today's nutrition data
  const nutritionData = [
    { name: "Protein", value: 92, color: "#8884d8" },
    { name: "Carbs", value: 125, color: "#82ca9d" },
    { name: "Fat", value: 47, color: "#ffc658" },
  ];

  // Today's macronutrient percentages for pie chart
  const totalNutrition = nutritionData.reduce((sum, item) => sum + item.value, 0);
  const macroPercentages = nutritionData.map(item => ({
    ...item,
    percent: Math.round((item.value / totalNutrition) * 100)
  }));

  // Calculate calories consumed
  const totalCaloriesConsumed = 
    (nutritionData[0].value * 4) + // Protein (4 cal/g)
    (nutritionData[1].value * 4) + // Carbs (4 cal/g)
    (nutritionData[2].value * 9);  // Fat (9 cal/g)

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Today's Fitness Summary</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Current Weight",
            value: `${currentWeight} kg`,
            icon: <Weight />,
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            label: "Calories Burned Today",
            value: `${caloriesBurnedToday} kcal`,
            icon: <Dumbbell />,
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            label: "Calories Consumed Today",
            value: `${totalCaloriesConsumed} kcal`,
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

      {/* Nutrition Breakdown Chart */}
      <ChartCard title="Today's Nutrition Breakdown">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Grams">
                {nutritionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Macronutrient Distribution Pie Chart */}
      <ChartCard title="Today's Macronutrient Distribution">
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macroPercentages}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${percent}%`}
              >
                {macroPercentages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}g`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow mb-6">
    <div className="mb-4">
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    {children}
  </div>
);

export default TodaysFitnessCharts;