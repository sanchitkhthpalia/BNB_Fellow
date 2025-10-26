'use client'

import { useState, useEffect } from 'react'
import DistrictDashboard from './components/DistrictDashboard'
import DistrictSelector from './components/DistrictSelector'

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [districts, setDistricts] = useState([])

  useEffect(() => {
    // Fetch districts on mount
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/districts`)
      .then(res => res.json())
      .then(data => setDistricts(data.districts || []))
      .catch(err => console.error('Error fetching districts:', err))
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Our Voice, Our Rights
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            MGNREGA District Dashboard
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedDistrict ? (
          <DistrictSelector
            districts={districts}
            onSelect={setSelectedDistrict}
          />
        ) : (
          <DistrictDashboard
            districtId={selectedDistrict.id}
            districtName={selectedDistrict.name}
            onBack={() => setSelectedDistrict(null)}
          />
        )}
      </div>
    </main>
  )
}
