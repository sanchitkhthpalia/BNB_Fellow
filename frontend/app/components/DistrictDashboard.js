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
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600">State:</span>{' '}
            <span className="font-semibold">{data?.state_name}</span>
          </div>
          <div>
            <span className="text-gray-600">Month:</span>{' '}
            <span className="font-semibold">{data?.month}/{data?.year}</span>
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
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="flex items-center justify-between">
        <div className="text-gray-600 font-semibold">{label}</div>
        <div className={`${trendColor} font-bold`}>{trendIcon}</div>
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
