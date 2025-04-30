"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const response = await axios.post("http://localhost:4000/api/login", formData)
    console.log(response.data)

    if (response.data.status === 200) {
      localStorage.setItem("token", response.data.token)
      setLoading(false)
      router.push(`/dashboard?id=${response.data.user._id}&caloriegoal=${response.data.user.calorieGoal}`)
    } else {
      setLoading(false)
      alert(response.data.message)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to continue your nutrition journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-200 shadow-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center mt-4 text-md text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-green-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}