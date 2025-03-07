import React, { useState } from "react";
import {
  Apple,
  Search,
  Plus,
  Coffee,
  Utensils,
  Pizza,
  Salad,
  Beef,
  Egg,
  Flame,
  Target,
} from "lucide-react";
import { useUser } from "../context/UserContext";

const foodData = [
  {
    id: "1",
    name: "Grilled Chicken Breast",
    category: "Protein",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    imageUrl:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    servingSize: "100g",
  },
  {
    id: "2",
    name: "Brown Rice",
    category: "Carbs",
    calories: 112,
    protein: 2.6,
    carbs: 23.5,
    fat: 0.9,
    imageUrl:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    servingSize: "100g cooked",
  },
  {
    id: "3",
    name: "Avocado",
    category: "Fats",
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    imageUrl:
      "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    servingSize: "1/2 medium",
  },
  {
    id: "4",
    name: "Greek Yogurt",
    category: "Dairy",
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    servingSize: "100g",
  },
  {
    id: "5",
    name: "Salmon",
    category: "Protein",
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    imageUrl:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    servingSize: "100g",
  },
  {
    id: "6",
    name: "Broccoli",
    category: "Vegetables",
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    fat: 0.4,
    imageUrl:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    servingSize: "100g",
  },
  {
    id: "7",
    name: "Banana",
    category: "Fruits",
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    imageUrl:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    servingSize: "1 medium",
  },
  {
    id: "8",
    name: "Almonds",
    category: "Nuts",
    calories: 579,
    protein: 21.2,
    carbs: 21.7,
    fat: 49.9,
    imageUrl:
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    servingSize: "100g",
  },
  {
    id: "9",
    name: "Oatmeal",
    category: "Breakfast",
    calories: 68,
    protein: 2.4,
    carbs: 12,
    fat: 1.4,
    imageUrl:
      "https://images.unsplash.com/photo-1501432781167-c0ccfd492297?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    servingSize: "100g cooked",
  },
];

const Nutrition = () => {
  const { addNutritionLog, totalCaloriesConsumed, totalProteinConsumed } =
    useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingCount, setServingCount] = useState(1);
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);

  const categories = [
    "All",
    "Protein",
    "Carbs",
    "Fats",
    "Dairy",
    "Vegetables",
    "Fruits",
    "Nuts",
    "Breakfast",
  ];

  const filteredFoods = foodData.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === null ||
      selectedCategory === "All" ||
      food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const addFoodToLog = (food) => {
    const today = new Date().toISOString().split("T")[0];

    const nutritionLog = {
      id: Date.now().toString(),
      date: today,
      name: food.name,
      calories: food.calories * servingCount,
      protein: food.protein * servingCount,
      carbs: food.carbs * servingCount,
      fat: food.fat * servingCount,
    };

    console.log("Nutrition Log to be added:", nutritionLog); // Add this to debug

    addNutritionLog(nutritionLog); // Ensure this is called
    setSelectedFood(null);
    setServingCount(1);
  };

  const handleAddCustomFood = (foodData) => {
    const today = new Date().toISOString().split("T")[0];

    const nutritionLog = {
      id: Date.now().toString(),
      date: today,
      name: foodData.name,
      calories: parseFloat(foodData.calories),
      protein: parseFloat(foodData.protein),
      carbs: parseFloat(foodData.carbs),
      fat: parseFloat(foodData.fat),
    };

    addNutritionLog(nutritionLog);
    setIsCustomFoodModalOpen(false);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Protein":
        return <Beef className="h-4 w-4" />;
      case "Carbs":
        return <Pizza className="h-4 w-4" />;
      case "Fats":
        return <Egg className="h-4 w-4" />;
      case "Dairy":
        return <Coffee className="h-4 w-4" />;
      case "Vegetables":
      case "Fruits":
        return <Salad className="h-4 w-4" />;
      case "Breakfast":
        return <Utensils className="h-4 w-4" />;
      default:
        return <Apple className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Nutrition Tracker</h1>
        <button
          onClick={() => setIsCustomFoodModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Custom Food
        </button>
      </div>

      {/* Nutrition Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Calories
              </p>
              <p className="text-2xl font-bold mt-1">{totalCaloriesConsumed}</p>
              <p className="text-sm text-gray-500">kcal consumed</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <Flame className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Protein</p>
              <p className="text-2xl font-bold mt-1">{totalProteinConsumed}g</p>
              <p className="text-sm text-gray-500">protein consumed</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Beef className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Daily Goal</p>
              <p className="text-2xl font-bold mt-1">1500</p>
              <p className="text-sm text-gray-500">kcal goal</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center space-x-2 w-1/3">
          <Search className="absolute left-2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Food"
            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredFoods.map((food) => (
          <div key={food.id} className="bg-white rounded-xl shadow p-4">
            <div className="w-full h-48 overflow-hidden rounded-lg">
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {food.name}
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                {food.servingSize}
              </div>
              <div className="mt-2 text-sm text-gray-600">{food.category}</div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-gray-800">Calories: {food.calories} kcal</p>
                <button
                  onClick={() => {
                    setSelectedFood(food);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Add to Log
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Food Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-6 w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{selectedFood.name}</h3>
              <button
                onClick={() => setSelectedFood(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="w-full h-48 overflow-hidden rounded-lg mt-4">
              <img
                src={selectedFood.imageUrl}
                alt={selectedFood.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {selectedFood.servingSize}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {selectedFood.category}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-800">
                Calories: {selectedFood.calories} kcal
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setServingCount((prev) => prev - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                  disabled={servingCount <= 1}
                >
                  -
                </button>
                <span>{servingCount}x</span>
                <button
                  onClick={() => setServingCount((prev) => prev + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => addFoodToLog(selectedFood)}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
            >
              Add to Log
            </button>
          </div>
        </div>
      )}

      {/* Custom Food Modal */}
      <CustomFoodModal
        isOpen={isCustomFoodModalOpen}
        onClose={() => setIsCustomFoodModalOpen(false)}
        onSubmit={handleAddCustomFood}
      />
    </div>
  );
};

const CustomFoodModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow p-6 w-96">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add Custom Food</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Food Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Calories</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
            <input
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
            <input
              type="number"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
            <input
              type="number"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg"
          >
            Add to Log
          </button>
        </form>
      </div>
    </div>
  );
};

export default Nutrition;