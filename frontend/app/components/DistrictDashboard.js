'use client'

import { useState, useEffect } from 'react'

export default function DistrictDashboard({ districtId, districtName, onBack }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/districts/${districtId}/latest`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching data:', err)
        setLoading(false)
      })
  }, [districtId])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 font-semibold mb-4"
        >
          ← Back to District Select
        </button>
        <h2 className="text-3xl font-bold text-gray-900">
          {districtName} - MGNREGA Dashboard
        </h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon="👷"
          label="Workdays"
          value={data?.workdays?.toLocaleString() || '0'}
          trend="up"
        />
        <MetricCard
          icon="💰"
          label="Wages Paid"
          value={`₹${(data?.wages_paid / 10000000).toFixed(2)} Cr`}
          trend="up"
        />
        <MetricCard
          icon="👥"
          label="People Benefited"
          value={data?.people_benefited?.toLocaleString() || '0'}
          trend="up"
        />
        <MetricCard
          icon="⏱️"
          label="Payment Delay"
          value={`${data?.payment_delay_days || 0} days`}
          trend="down"
        />
      </div>

      {/* Hear Summary Button */}
      <div className="mb-8">
        <HearSummaryButton data={data} districtName={districtName} />
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">State:</div>
            <div className="text-xl font-bold text-gray-900">{data?.state_name || 'Maharashtra'}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="text-sm text-gray-600 mb-1">Month:</div>
            <div className="text-xl font-bold text-gray-900">
              {data?.month ? `${data.month}/${data.year}` : 'October 2024'}
            </div>
          </div>
        </div>
        
        {/* Data freshness indicator */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Last Updated:</strong> {data?.data_timestamp ? 
              new Date(data.data_timestamp).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : 
              'Sample Data'
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, trend }) {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600'
  const trendIcon = trend === 'up' ? '↑' : '↓'

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-blue-300">
      <div className="text-6xl mb-4 text-center">{icon}</div>
      <div className="text-4xl font-bold mb-3 text-center text-gray-900">{value}</div>
      <div className="flex items-center justify-between">
        <div className="text-gray-700 font-bold text-lg">{label}</div>
        <div className={`${trendColor} font-bold text-2xl`}>{trendIcon}</div>
      </div>
    </div>
  )
}

function HearSummaryButton({ data, districtName }) {
  const speakSummary = () => {
    const utterance = new SpeechSynthesisUtterance(
      `In ${districtName}, this month: ${data?.workdays} workdays, ${(data?.wages_paid / 10000000).toFixed(2)} crores rupees paid to ${data?.people_benefited} people. Payment delay is ${data?.payment_delay_days} days.`
    )
    utterance.lang = 'en-IN'
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  return (
    <button
      onClick={speakSummary}
      className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      aria-label="Hear summary in audio"
    >
      🔊 Hear Summary
    </button>
  )
}
