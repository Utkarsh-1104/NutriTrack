"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import axios from "axios"


// Mock initial food items - in a real app, this would come from an API/database
const initialFoodItems = [
  { id: 1, name: "Oatmeal with Banana", calories: 350 },
  { id: 2, name: "Grilled Chicken Salad", calories: 420 },
]

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [foodItems, setFoodItems] = useState([])
  const [newFood, setNewFood] = useState("")
  const [totalCalories, setTotalCalories] = useState(0)
  
  const searchParams = useSearchParams()
  const userId = searchParams.get("id")
  const dailyCalorieTarget = Number(searchParams.get("caloriegoal"))


  //fetch food log from server
  useEffect(() => {
    const fetchFoodLog = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/todaycal", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setFoodItems(res.data.todayLog.foods)
        setTotalCalories(res.data.todayLog.totalCalories)
        console.log(res.data.todayLog.foods)
      } catch (error) {
        console.error("Error fetching food log:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFoodLog()
  }, [])

  // Calculate total calories whenever food items chang


  const handleAddFood = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    if (!newFood) return

    const appId = process.env.NEXT_PUBLIC_X_APP_ID;
    const appKey = process.env.NEXT_PUBLIC_X_APP_KEY;
  
    try {
      // Step 1: Get calorie info from Nutritionix
      const nutritionRes = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: newFood },
        {
          headers: {
            "x-app-id": appId,
            "x-app-key": appKey,
            "Content-Type": "application/json"
          }
        }
      );
  
      const foods = nutritionRes.data.foods;
      console.log(foods[0].nf_calories)

      for (let food of foods) {
        const res = await axios.post(
          "http://localhost:4000/api/add",
          {
            foodName: food.food_name,
            calories: food.nf_calories
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log(res.data)
      }
  
      setNewFood("")

    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      setLoading(false);
      return;
    }

    setLoading(false) 
    window.location.reload()
  }

  const handleDeleteFood = (id: any) => {
    setFoodItems((prev) => prev.filter((item) => item._id !== id))
  }

  // Calculate progress percentage
  const progressPercentage = Math.min(Math.round((totalCalories / dailyCalorieTarget) * 100), 100)
  const isExceeded = totalCalories > dailyCalorieTarget

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                NutriTrack
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/history" className="text-green-600 text-[1.2rem] hover:text-green-700">
                  History
                </Link>
                <Link href="/profile" className="text-green-600 text-[1.2rem] hover:text-green-700">
                  Profile
                </Link>
              </nav>
            </div>
          </header>

          <div className="max-w-4xl mx-auto p-4">
            {/* Daily Summary */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Daily Target</p>
                  <p className="text-2xl font-bold text-green-600">{dailyCalorieTarget} cal</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Consumed</p>
                  <p className="text-2xl font-bold text-green-600">{totalCalories.toFixed(2)} cal</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className={`text-2xl font-bold ${isExceeded ? "text-red-500" : "text-green-600"}`}>
                    {isExceeded
                      ? "+" + (totalCalories - dailyCalorieTarget).toFixed(2)
                      : (dailyCalorieTarget - totalCalories).toFixed(2)}{" "}
                    cal
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Daily Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isExceeded ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                {isExceeded && (
                  <p className="text-red-500 text-sm mt-1">
                    You've exceeded your daily calorie target by {totalCalories - dailyCalorieTarget}{" "}
                    calories
                  </p>
                )}
              </div>
            </section>

            {/* Add Food Form */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Food</h2>

              <form onSubmit={handleAddFood} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="food-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Food Name
                    </label>
                    <input
                      id="food-name"
                      name="name"
                      type="text"
                      required
                      value={newFood}
                      onChange={(e) => setNewFood(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Grilled Chicken Salad"
                    />
                  </div>
                  <button
                    type="submit"
                    className="ml-auto mt-auto w-full md:w-auto px-6 py-2 bg-green-500 hover:bg-green-700 cursor-pointer text-white font-medium rounded-lg transition duration-200"
                  >
                    Add Food
                  </button>
                </div>

              </form>
            </section>

            {/* Today's Food List */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Food</h2>

              {foodItems.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No food items added today</p>
              ) : (
                <>
                  {/* Mobile view - Card layout */}
                  <div className="md:hidden space-y-4">
                    {foodItems.map((item) => (
                      <div key={item._id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.foodName}</h3>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-gray-900">{item.calories} cal</span>
                            <button
                              onClick={() => handleDeleteFood(item._id)}
                              className="text-red-600 text-sm mt-2 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-green-100 p-4 rounded-lg mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="font-bold text-gray-900">{totalCalories.toFixed(2)} cal</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop view - Table layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Food
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Calories
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {foodItems.map((item) => (
                          <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.foodName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.calories} cal</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDeleteFood(item._id)}
                                className="text-red-600 cursor-pointer hover:text-red-900 hover:underline hover:underline-offset-2"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Total
                          </td>
                          <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            {totalCalories.toFixed(2)} cal
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </section>
          </div>
        </>
      )}
    </main>
  )
}