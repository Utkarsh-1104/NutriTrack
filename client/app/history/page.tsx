"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function HistoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [historyData, setHistoryData] = useState()
  const [selectedDay, setSelectedDay] = useState(null)
  const [targetCalories, setTargetCalories] = useState()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }

    async function fetchHistory() {
      try {
        const response = await axios.get("http://localhost:4000/api/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = response.data
        setHistoryData(data.data.calorieLogs)
        setTargetCalories(data.data.calorieGoal)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching history data:", error)
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  useEffect(() => {
    if (historyData && historyData.length > 0) {
      setSelectedDay(historyData[0])
    }
  }
  , [historyData])

  const handleDaySelect = (day: any) => {
    setSelectedDay(day)
  }

  const formatDate = (dateString: any) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

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
              {historyData?.map((day: any) => (
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
                      <p className="text-2xl font-bold text-green-600">{targetCalories} cal</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Consumed</p>
                      <p className="text-2xl font-bold text-green-600">{selectedDay.totalCalories.toFixed(2)} cal</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Difference</p>
                      <p
                        className={`text-2xl font-bold ${
                          selectedDay.totalCalories > targetCalories ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {selectedDay.totalCalories > targetCalories
                          ? "+" + (selectedDay.totalCalories - targetCalories).toFixed(2)
                          : targetCalories - selectedDay.totalCalories.toFixed(2)}{" "}
                        cal
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily Progress</span>
                      <span>{calculateProgress(selectedDay.totalCalories, targetCalories)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedDay.totalCalories > targetCalories ? "bg-red-500" : "bg-green-500"
                        }`}
                        style={{
                          width: `${calculateProgress(selectedDay.totalCalories, targetCalories)}%`,
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
                      <div key={item._id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{item.foodName}</h3>
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
                        <span className="font-bold text-gray-900">{(selectedDay.totalCalories).toFixed(2)} cal</span>
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
                            className="px-6 py-3 w-[50%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                          <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.foodName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.calories} cal</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan={1} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            {(selectedDay.totalCalories).toFixed(2)} cal
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
                                  {(day.totalCalories).toFixed(2)} cal
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
