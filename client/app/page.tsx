"use client"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import hero from "@/public/image.png"

export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleGetStarted = () => {
    setLoading(true)
    setTimeout(() => {
      router.push("/signup")
    }, 500)
  }

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      router.push("/login")
    }, 500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">NutriTrack</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your personal calorie tracking companion for a healthier lifestyle.
          </p>

          <div className="relative w-full h-96 mb-8">
            <Image
              src = {hero}
              alt="Nutrition tracking illustration"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={handleGetStarted}
              className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 cursor-pointer text-white font-semibold rounded-lg transition duration-200 shadow-md"
              disabled={loading}
            >
              Get Started
            </button>

            <button
              onClick={handleLogin}
              className="w-full py-3 px-6 bg-white hover:bg-gray-100 cursor-pointer text-green-600 font-semibold rounded-lg border border-green-500 transition duration-200"
              disabled={loading}
            >
              Login
            </button>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Track your nutrition journey with ease</p>
          <p>Set goals. Monitor progress. Achieve results.</p>
        </div>
      </div>
    </main>
  )
}
