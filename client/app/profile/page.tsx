"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState()

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/")
        return
      }

      const response = await axios.get("http://localhost:4000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (response.status === 200) {
        setUserData(response.data.data)
        setLoading(false)
      } else {
        console.error("Failed to fetch user data")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  console.log(userData)

  const getInitials = (name: any) => {
    return name
      .split(" ")
      .map((n: any) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleLogout = () => {
    setLoading(true)
    localStorage.removeItem("token")
    setLoading(false)
    router.push("/")
    // window.location.reload
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
                <Link href="/history" className="text-green-600 text-[1.2rem] hover:text-green-700">
                  History
                </Link>
              </nav>
            </div>
          </header>

          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex flex-col items-center mb-8">
                {/* User Avatar with Initials */}
                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {getInitials(userData.name)}
                </div>

                <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                <p className="text-gray-500">{userData.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Weight Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Weight</p>
                      <p className="text-xl font-bold text-gray-900">{userData.currentWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Target Weight</p>
                      <p className="text-xl font-bold text-gray-900">{userData.targetWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight to {(userData.currentWeight > userData.targetWeight) ? "Lose" : "Gain"}</p>
                      <p className="text-xl font-bold text-green-600">
                        {(userData.currentWeight - userData.targetWeight) > 0 ? (userData.currentWeight - userData.targetWeight) : (userData.currentWeight - userData.targetWeight) * -1 } kg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Nutrition Goals</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Daily Calorie Target</p>
                      <p className="text-xl font-bold text-gray-900">{userData.calorieGoal} calories</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recommended Protein</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(userData.currentWeight * 1.2)} g
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recommended Water</p>
                      <p className="text-xl font-bold text-gray-900">
                        {(userData.currentWeight * 0.035).toFixed(2)} L
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-6 bg-white hover:bg-gray-200 cursor-pointer text-red-600 font-semibold rounded-lg border border-red-500 transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
