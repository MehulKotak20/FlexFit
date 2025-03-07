import React, { useState, useEffect } from 'react';
import { Scale, Info } from 'lucide-react';
import { useUser } from '../context/UserContext';

const BMICalculator = () => {
  const { user, updateUser, calculateBMI } = useUser();
  
  const [height, setHeight] = useState(user.height);
  const [weight, setWeight] = useState(user.weight);
  const [bmi, setBmi] = useState(calculateBMI());
  
  useEffect(() => {
    const calculatedBMI = parseFloat((weight / ((height / 100) * (height / 100))).toFixed(1));
    setBmi(calculatedBMI);
  }, [height, weight]);
  
  const handleSave = () => {
    updateUser({ height, weight });
  };
  
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'bg-blue-500', description: 'You may need to gain some weight. Consult with a healthcare professional.' };
    if (bmi < 25) return { category: 'Normal weight', color: 'bg-green-500', description: 'Your BMI is within a healthy range. Maintain your current weight.' };
    if (bmi < 30) return { category: 'Overweight', color: 'bg-yellow-500', description: 'You may need to lose some weight. Focus on healthy eating and regular exercise.' };
    return { category: 'Obese', color: 'bg-red-500', description: 'Your BMI indicates obesity. Consider consulting a healthcare professional for a weight management plan.' };
  };
  
  const bmiInfo = getBMICategory(bmi);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">BMI Calculator</h1>
        <p className="text-gray-600">
          Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center mb-4">
            <Scale className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Calculate Your BMI</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={handleSave}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Save Measurements
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your BMI Result</h2>
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-36 h-36 rounded-full border-8 border-gray-200 flex items-center justify-center">
              <span className="text-4xl font-bold">{bmi}</span>
            </div>
            
            <div className="text-center">
              <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${bmiInfo.color}`}>
                {bmiInfo.category}
              </div>
              <p className="mt-2 text-gray-600">{bmiInfo.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <div className="flex items-center mb-4">
          <Info className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold">BMI Categories</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BMI Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Risk
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Below 18.5
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Underweight
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Malnutrition risk
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  18.5 - 24.9
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Normal weight
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Low risk
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  25.0 - 29.9
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Overweight
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Increased risk
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  30.0 and above
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Obese
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  High risk
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> BMI is a screening tool, not a diagnostic tool. Factors such as muscle mass, bone density, overall body composition, and other factors are not accounted for in BMI calculations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;