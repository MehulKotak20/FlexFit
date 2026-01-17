import React, { useMemo } from "react";
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
  LineChart,
  Line,
} from "recharts";
import { Weight, Dumbbell, Apple, Target, Medal, Utensils } from "lucide-react";
import { useUser } from "../context/UserContext";

// fallback palette used in cells
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F"];

// ---- utils (IST-safe + number guards)
const toISTDateStr = (d) => {
  const date = new Date(d);
  // shift by IST offset (UTC+5:30 = 330 mins)
  const istDate = new Date(
    date.getTime() + (330 + date.getTimezoneOffset()) * 60000
  );
  return istDate.toISOString().split("T")[0]; // YYYY-MM-DD
};

const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const asNum = (v, def = 0) => (isNum(v) ? v : def);
const clampNonNeg = (n) => (n < 0 || !isNum(n) ? 0 : n);
const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

const toMMDD = (enCADate) => {
  if (typeof enCADate !== "string") return "";
  const parts = enCADate.split("-");
  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : enCADate;
};

const TodaysFitnessCharts = () => {
  const {
    user,
    exerciseLogs,
    nutritionLogs,
    totalCaloriesBurned,
    totalCaloriesConsumed,
    totalProteinConsumed,
    streak,
    calculateBMI,
    loading,
  } = useUser();

  const exLogs = useMemo(() => safeArray(exerciseLogs), [exerciseLogs]);
  const nutLogs = useMemo(() => safeArray(nutritionLogs), [nutritionLogs]);

  console.log("Exercise Logs:", exLogs);
  console.log("Nutrition Logs:", nutLogs);

  const todayStr = useMemo(() => toISTDateStr(new Date()), []);

  // ---- Today burned
  const caloriesBurnedToday = useMemo(() => {
    return exLogs
      .filter((log) => toISTDateStr(log?.date) === todayStr)
      .reduce((sum, log) => sum + asNum(log?.caloriesBurned, 0), 0);
  }, [exLogs, todayStr]);

  // ---- Today nutrition (macros + calories)
  const {
    proteinToday,
    carbsToday,
    fatToday,
    caloriesConsumedToday,
    nutritionData,
    macroPercentages,
  } = useMemo(() => {
    const todayLogs = nutLogs.filter((l) => toISTDateStr(l?.date) === todayStr);

    const protein = todayLogs.reduce((t, l) => t + asNum(l?.protein, 0), 0);
    const carbs = todayLogs.reduce((t, l) => t + asNum(l?.carbs, 0), 0);
    const fat = todayLogs.reduce((t, l) => t + asNum(l?.fat, 0), 0);

    console.log("Today's Nutrition Logs:", todayLogs);
    console.log("Today's Nutrition Data:", { protein, carbs, fat });

    const caloriesFromLogs = todayLogs.reduce(
      (t, l) => t + asNum(l?.calories, 0),
      0
    );

    const caloriesFromMacros = protein * 4 + carbs * 4 + fat * 9;

    const consumed =
      caloriesFromLogs > 0 ? caloriesFromLogs : clampNonNeg(caloriesFromMacros);

    const nutritionArr = [
      { name: "Protein", value: clampNonNeg(protein), color: COLORS[0] },
      { name: "Carbs", value: clampNonNeg(carbs), color: COLORS[1] },
      { name: "Fat", value: clampNonNeg(fat), color: COLORS[2] },
    ];

    const total = nutritionArr.reduce((s, i) => s + i.value, 0);
    const macrosPct =
      total > 0
        ? nutritionArr.map((it) => ({
            ...it,
            percent: Math.round((it.value / total) * 100),
          }))
        : nutritionArr.map((it) => ({ ...it, percent: 0 }));

    return {
      proteinToday: protein,
      carbsToday: carbs,
      fatToday: fat,
      caloriesConsumedToday: consumed,
      nutritionData: nutritionArr,
      macroPercentages: macrosPct,
    };
  }, [nutLogs, todayStr]);

  // ---- BMI (safe)
  const bmiInfo = useMemo(() => {
    const height = asNum(user?.height, 0);
    const weight = asNum(user?.weight, 0);

    let bmiVal =
      typeof calculateBMI === "function" ? asNum(calculateBMI(), 0) : 0;

    if (!bmiVal && height > 0 && weight > 0) {
      const hM = height / 100;
      bmiVal = clampNonNeg(parseFloat((weight / (hM * hM)).toFixed(1)));
    }

    let cat = "Unknown";
    if (bmiVal > 0) {
      if (bmiVal < 18.5) cat = "Underweight";
      else if (bmiVal < 25) cat = "Normal";
      else if (bmiVal < 30) cat = "Overweight";
      else cat = "Obese";
    }
    return { bmi: bmiVal, category: cat };
  }, [user?.height, user?.weight, calculateBMI]);

  // ---- Weekly trend (last 7 days)
  const weeklyData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return toISTDateStr(d);
    });

    return days.map((dateStr) => {
      const burned = exLogs
        .filter((l) => toISTDateStr(l?.date) === dateStr)
        .reduce((s, l) => s + asNum(l?.caloriesBurned, 0), 0);

      const dayNut = nutLogs.filter((l) => toISTDateStr(l?.date) === dateStr);
      const dayProtein = dayNut.reduce((t, l) => t + asNum(l?.protein, 0), 0);
      const dayCarbs = dayNut.reduce((t, l) => t + asNum(l?.carbs, 0), 0);
      const dayFat = dayNut.reduce((t, l) => t + asNum(l?.fat, 0), 0);

      const calsLogged = dayNut.reduce((t, l) => t + asNum(l?.calories, 0), 0);
      const calsFromMacros = dayProtein * 4 + dayCarbs * 4 + dayFat * 9;
      const consumed =
        calsLogged > 0 ? calsLogged : clampNonNeg(calsFromMacros);

      return {
        date: toMMDD(dateStr),
        Burned: clampNonNeg(burned),
        Consumed: clampNonNeg(consumed),
      };
    });
  }, [exLogs, nutLogs]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading progress...</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Fitness Progress Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Current Weight",
            value: isNum(user?.weight) ? `${user.weight} kg` : "-",
            icon: <Weight className="h-6 w-6" />,
            bg: "bg-blue-100",
          },
          {
            label: "Calories Burned Today",
            value: `${clampNonNeg(caloriesBurnedToday)} kcal`,
            icon: <Dumbbell className="h-6 w-6" />,
            bg: "bg-green-100",
          },
          {
            label: "Calories Consumed Today",
            value: `${clampNonNeg(caloriesConsumedToday)} kcal`,
            icon: <Apple className="h-6 w-6" />,
            bg: "bg-red-100",
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
            <div className={`${card.bg} p-2 rounded-lg`}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Extra Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Streak",
            value: `${clampNonNeg(asNum(streak, 0))} days`,
            icon: <Medal className="h-6 w-6" />,
            bg: "bg-yellow-100",
          },
          {
            label: "BMI",
            value:
              bmiInfo.bmi > 0 ? `${bmiInfo.bmi} (${bmiInfo.category})` : "-",
            icon: <Target className="h-6 w-6" />,
            bg: "bg-purple-100",
          },
          {
            label: "Total Protein Consumed",
            value: `${clampNonNeg(asNum(totalProteinConsumed, 0))} g`,
            icon: <Utensils className="h-6 w-6" />,
            bg: "bg-pink-100",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-start"
          >
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-xl font-bold">{card.value}</p>
            </div>
            <div className={`${card.bg} p-2 rounded-lg`}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Nutrition Breakdown */}
      <ChartCard title="Today's Nutrition Breakdown">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Grams">
                {nutritionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Macronutrient Pie */}
      <ChartCard title="Macronutrient Distribution">
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macroPercentages}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${Math.round(percent || 0)}%`
                }
              >
                {macroPercentages.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}g`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Weekly Burned vs Consumed */}
      <ChartCard title="Weekly Calories Burned vs Consumed">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Burned"
                stroke="#82ca9d"
                strokeWidth={2}
                dot
              />
              <Line
                type="monotone"
                dataKey="Consumed"
                stroke="#ff7300"
                strokeWidth={2}
                dot
              />
            </LineChart>
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
