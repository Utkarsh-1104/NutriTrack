"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock history data - in a real app, this would come from an API/database
const mockHistoryData = [
  {
    date: "2023-04-27",
    totalCalories: 1850,
    targetCalories: 2000,
    foods: [
      { id: 1, name: "Oatmeal with Banana", calories: 350, time: "08:30 AM" },
      { id: 2, name: "Grilled Chicken Salad", calories: 420, time: "12:45 PM" },
      { id: 3, name: "Protein Shake", calories: 180, time: "03:15 PM" },
      { id: 4, name: "Salmon with Vegetables", calories: 550, time: "07:00 PM" },
      { id: 5, name: "Greek Yogurt", calories: 150, time: "09:30 PM" },
    ],
  },
  {
    date: "2023-04-26",
    totalCalories: 2000,
    targetCalories: 2000,
    foods: [
      { id: 1, name: "Avocado Toast", calories: 320, time: "08:00 AM" },
      { id: 2, name: "Turkey Sandwich", calories: 450, time: "12:30 PM" },
      { id: 3, name: "Protein Bar", calories: 220, time: "03:30 PM" },
      { id: 4, name: "Pasta with Meatballs", calories: 780, time: "07:15 PM" },
      { id: 5, name: "Dark Chocolate", calories: 180, time: "09:45 PM" },
    ],
  },
  {
    date: "2023-04-25",
    totalCalories: 1920,
    targetCalories: 2000,
    foods: [
      { id: 1, name: "Smoothie Bowl", calories: 380, time: "08:15 AM" },
      { id: 2, name: "Quinoa Salad", calories: 410, time: "12:30 PM" },
      { id: 3, name: "Apple with Almond Butter", calories: 210, time: "03:45 PM" },
      { id: 4, name: "Grilled Tofu with Vegetables", calories: 520, time: "06:45 PM" },
      { id: 5, name: "Herbal Tea with Honey", calories: 40, time: "09:15 PM" },
    ],
  },
  {
    date: "2023-04-24",
    totalCalories: 2250,
    targetCalories: 2000,
    foods: [
      { id: 1, name: "Breakfast Burrito", calories: 520, time: "08:30 AM" },
      { id: 2, name: "Chicken Wrap", calories: 480, time: "12:45 PM" },
      { id: 3, name: "Trail Mix", calories: 250, time: "04:00 PM" },
      { id: 4, name: "Beef Stir Fry", calories: 650, time: "07:30 PM" },
      { id: 5, name: "Ice Cream", calories: 350, time: "10:00 PM" },
    ],
  },
  {
    date: "2023-04-23",
    totalCalories: 1780,
    targetCalories: 2000,
    foods: [
      { id: 1, name: "Egg White Omelette", calories: 280, time: "07:45 AM" },
      { id: 2, name: "Lentil Soup with Bread", calories: 420, time: "12:15 PM" },
      { id: 3, name: "Banana", calories: 105, time: "03:30 PM" },
      { id: 4, name: "Grilled Fish with Rice", calories: 580, time: "06:30 PM" },
      { id: 5, name: "Chamomile Tea", calories: 0, time: "09:00 PM" },
    ],
  },
]

export default function HistoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [historyData, setHistoryData] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      setHistoryData(mockHistoryData)
      setSelectedDay(mockHistoryData[0])
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleDaySelect = (day: any) => {
    setSelectedDay(day)
  }

  // Format date for display
  const formatDate = (dateString: any) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Calculate progress percentage
  const calculateProgress = (consumed: any, target: any) => {
    return Math.min(Math.round((consumed / target) * 100), 100)
  }

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
                <Link href="/dashboard" className="text-green-600 text-[1.2rem] hover:text-green-700">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-green-600 text-[1.2rem] hover:text-green-700">
                  Profile
                </Link>
              </nav>
            </div>
          </header>

          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Nutrition History</h2>

            {/* Date Selector */}
            <div className="flex overflow-x-auto pb-4 mb-6 gap-2">
              {historyData.map((day) => (
                <button
                  key={day.date}
                  onClick={() => handleDaySelect(day)}
                  className={`px-4 py-2 cursor-pointer rounded-lg whitespace-nowrap ${
                    selectedDay && selectedDay.date === day.date
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700 hover:bg-green-100"
                  }`}
                >
                  {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </button>
              ))}
            </div>

            {selectedDay && (
              <>
                {/* Day Summary */}
                <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{formatDate(selectedDay.date)}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Daily Target</p>
                      <p className="text-2xl font-bold text-green-600">{selectedDay.targetCalories} cal</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Consumed</p>
                      <p className="text-2xl font-bold text-green-600">{selectedDay.totalCalories} cal</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Difference</p>
                      <p
                        className={`text-2xl font-bold ${
                          selectedDay.totalCalories > selectedDay.targetCalories ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {selectedDay.totalCalories > selectedDay.targetCalories
                          ? "+" + (selectedDay.totalCalories - selectedDay.targetCalories)
                          : selectedDay.targetCalories - selectedDay.totalCalories}{" "}
                        cal
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily Progress</span>
                      <span>{calculateProgress(selectedDay.totalCalories, selectedDay.targetCalories)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedDay.totalCalories > selectedDay.targetCalories ? "bg-red-500" : "bg-green-500"
                        }`}
                        style={{
                          width: `${calculateProgress(selectedDay.totalCalories, selectedDay.targetCalories)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </section>

                {/* Food List */}
                <section className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Food Consumed</h3>

                  {/* Mobile view - Card layout */}
                  <div className="md:hidden space-y-4">
                    {selectedDay.foods.map((item) => (
                      <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.time}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-gray-900">{item.calories} cal</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-green-100 p-4 rounded-lg mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="font-bold text-gray-900">{selectedDay.totalCalories} cal</span>
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
                            Time
                          </th>
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
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedDay.foods.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.calories} cal</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            {selectedDay.totalCalories} cal
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>

                {/* Weekly Summary - Fixed Chart */}
                <section className="bg-white rounded-lg shadow-md p-6 mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Overview</h3>

                  <div className="relative h-60">
                    {/* Target line */}
                    {/* <div className="absolute w-full border-t border-dashed border-gray-400 z-10" style={{ top: "20%" }}>
                      <span className="absolute -top-6 right-0 text-xs text-gray-500">
                        Target: {selectedDay.targetCalories} cal
                      </span>
                    </div> */}

                    {/* Chart bars */}
                    <div className="flex items-end justify-between h-48 gap-2 px-2 relative">
                      {historyData.map((day) => {
                        // Calculate height based on percentage of the highest value
                        const maxCalories = Math.max(...historyData.map((d) => d.totalCalories))

                        const heightPercentage = (day.totalCalories / maxCalories) * 100
                        console.log("Height Percentage: ", heightPercentage)
                        const isOverTarget = day.totalCalories > day.targetCalories
                        console.log("Is Over Target: ", isOverTarget)

                        return (
                          <div key={day.date} className="h-[100%] flex flex-col items-center flex-1">
                            <div className="w-full h-full flex flex-col justify-end">
                              <div className={`w-full rounded-t-sm  ${isOverTarget ? "bg-red-400" : "bg-green-400"}`}
                                style={{ height: `${heightPercentage}%` }}
                              >
                                <div className="text-xs text-white text-center font-bold mt-1 truncate">
                                  {day.totalCalories}
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-sm mr-2"></div>
                        <span className="text-sm text-gray-600">Within Target</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-400 rounded-sm mr-2"></div>
                        <span className="text-sm text-gray-600">Exceeded Target</span>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </>
      )}
    </main>
  )
}
