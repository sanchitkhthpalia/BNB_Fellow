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

    setLocationError('Getting your location...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        console.log('Location:', latitude, longitude)
        
        // Find nearest district using simple distance calculation
        let nearestDistrict = null
        let minDistance = Infinity
        
        districts.forEach(district => {
          if (district.latitude && district.longitude) {
            const distance = Math.sqrt(
              Math.pow(latitude - district.latitude, 2) + 
              Math.pow(longitude - district.longitude, 2)
            )
            if (distance < minDistance) {
              minDistance = distance
              nearestDistrict = district
            }
          }
        })
        
        if (nearestDistrict) {
          setLocationError(`Found nearest district: ${nearestDistrict.name}, ${nearestDistrict.state_name}`)
          // Auto-select the nearest district
          setTimeout(() => {
            onSelect(nearestDistrict)
          }, 1000)
        } else {
          setLocationError('Could not find nearby districts. Please select manually.')
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location. Please select manually.'
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location access denied. Please allow location access or select manually.'
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable. Please select manually.'
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out. Please select manually.'
        }
        setLocationError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
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
              className="w-full text-left px-6 py-4 bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md"
            >
              <div className="font-bold text-xl text-gray-900">{district.name}</div>
              <div className="text-base text-gray-700 font-medium">{district.state_name}</div>
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
