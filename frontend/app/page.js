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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      <header className="bg-white shadow-lg border-b-2 border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            Our Voice, Our Rights
          </h1>
          <p className="mt-3 text-xl text-gray-700 text-center font-medium">
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
