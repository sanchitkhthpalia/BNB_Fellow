'use client'

import { useState, useEffect } from 'react'

export default function DistrictSelector({ districts, onSelect }) {
  const [locationError, setLocationError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // Find nearest district
        // This is simplified - in production, use proper distance calculation
        console.log('Location:', latitude, longitude)
        setLocationError('Geolocation not implemented yet. Please select manually.')
      },
      (error) => {
        setLocationError('Unable to get your location. Please select manually.')
      }
    )
  }

  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    district.state_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Select Your District
        </h2>

        {/* Geo-location button */}
        <button
          onClick={handleGeolocation}
          className="w-full mb-6 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Auto-detect my location"
        >
          📍 Detect My Location
        </button>

        {locationError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            {locationError}
          </div>
        )}

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by district or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Districts list */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredDistricts.map((district) => (
            <button
              key={district.id}
              onClick={() => onSelect(district)}
              className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="font-semibold text-lg">{district.name}</div>
              <div className="text-sm text-gray-600">{district.state_name}</div>
            </button>
          ))}
        </div>

        {filteredDistricts.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No districts found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}
