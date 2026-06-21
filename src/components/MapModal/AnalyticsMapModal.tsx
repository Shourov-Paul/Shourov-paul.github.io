'use client'

import React, { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { X, TrendingUp, Info } from 'lucide-react'

const geoUrl = '/world-110m.json'

// Coordinates: [longitude, latitude]
const markers = [
  { name: 'San Francisco', coordinates: [-122.4194, 37.7749] as [number, number] },
  { name: 'New York', coordinates: [-74.006, 40.7128] as [number, number] },
  { name: 'London', coordinates: [-0.1276, 51.5072] as [number, number] },
  { name: 'Paris', coordinates: [2.3522, 48.8566] as [number, number] },
  { name: 'Mumbai', coordinates: [72.8777, 19.076] as [number, number] },
  { name: 'Dubai', coordinates: [55.2708, 25.2048] as [number, number] },
]

// Potential cities for the random active user
const activeUserCities = [
  { name: 'Tokyo', coordinates: [139.6917, 35.6762] as [number, number] },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] as [number, number] },
  { name: 'London', coordinates: [-0.1276, 51.5072] as [number, number] },
  { name: 'New York', coordinates: [-74.006, 40.7128] as [number, number] },
  { name: 'São Paulo', coordinates: [-46.6333, -23.5505] as [number, number] },
  { name: 'Cairo', coordinates: [31.2357, 30.0444] as [number, number] },
  { name: 'Cape Town', coordinates: [18.4241, -33.9249] as [number, number] },
  { name: 'Vancouver', coordinates: [-123.1207, 49.2827] as [number, number] },
  { name: 'Mumbai', coordinates: [72.8777, 19.076] as [number, number] },
  { name: 'Reykjavik', coordinates: [-21.8277, 64.1265] as [number, number] },
]

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  views: number
}

const AnalyticsMapModal: React.FC<MapModalProps> = ({ isOpen, onClose, views }) => {
  const [mounted, setMounted] = useState(false)
  const [activeCity, setActiveCity] = useState(activeUserCities[0])
  const [percentage, setPercentage] = useState('+12.5%')
  const [activeGreenMarkers, setActiveGreenMarkers] = useState<typeof markers>([])

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      
      // Randomize the active user percentage growth between +5.0% and +25.0%
      const val = (5 + Math.random() * 20).toFixed(1)
      setPercentage(`+${val}%`)

      // Function to generate a random subset of green markers
      const getNewGreenMarkers = () => {
        const shuffled = [...markers].sort(() => 0.5 - Math.random())
        const count = Math.floor(Math.random() * 4) + 3 // 3 to 6 markers
        return shuffled.slice(0, count)
      }

      // Initialize green markers
      setActiveGreenMarkers(getNewGreenMarkers())

      // Periodically shift the active user to a random location every 4 seconds
      const userInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * activeUserCities.length)
        setActiveCity(activeUserCities[randomIndex])
      }, 4000)

      // Periodically shuffle and change the visible green markers every 2.5 seconds
      const markersInterval = setInterval(() => {
        setActiveGreenMarkers(getNewGreenMarkers())
      }, 2500)
      
      return () => {
        clearInterval(userInterval)
        clearInterval(markersInterval)
        document.body.style.overflow = 'unset'
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
      <div 
        className="relative w-full max-w-5xl rounded-xl border border-[#333] shadow-2xl overflow-hidden bg-[#242930]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white transition-colors bg-[#181d23] p-1.5 rounded-full border border-gray-700 hover:border-gray-500"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        <div className="relative w-full h-[600px] max-h-[80vh]">
          {/* Active Users Card Overlay */}
          <div className="absolute top-6 left-6 z-10 bg-[#12161b] border border-[#2a3036] rounded-xl p-5 shadow-lg">
            <h3 className="text-[#889098] text-xs font-semibold tracking-wider mb-2">ACTIVE USERS</h3>
            <div className="text-white text-4xl font-bold font-sans tracking-tight leading-none mb-3">
              {views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-[#10b981] text-sm font-medium">
              <TrendingUp className="size-4" />
              <span>{percentage}</span>
              <span className="text-[#889098] font-normal ml-1">vs last day</span>
            </div>
          </div>

          {/* Region Labels overlay */}
          <div className="absolute left-[15%] top-[60%] text-[#889098] font-semibold tracking-[0.2em] text-sm pointer-events-none opacity-80 z-0 text-center">
            NORTH<br/>AMERICA
          </div>
          <div className="absolute left-[58%] top-[62%] text-[#889098] font-semibold tracking-[0.2em] text-sm pointer-events-none opacity-80 z-0">
            EUROPE
          </div>
          <div className="absolute right-[12%] top-[62%] text-[#889098] font-semibold tracking-[0.2em] text-sm pointer-events-none opacity-80 z-0">
            ASIA
          </div>

          {/* Map Layer */}
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 120, center: [10, 20] }}
            width={800}
            height={400}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup center={[10, 20]} zoom={1} maxZoom={8}>
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1b2026"
                      stroke="#323a44"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: '#242a32', transition: 'all 250ms' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Render Static Markers with Glowing Pulse effect */}
              {activeGreenMarkers.map(({ name, coordinates }) => (
                <Marker key={name} coordinates={coordinates}>
                  <circle
                    r={8}
                    fill="rgba(16, 185, 129, 0.2)"
                    className="animate-ping-slow origin-center"
                    style={{ animationDuration: '3s', transformBox: 'fill-box' }}
                  />
                  <circle
                    r={4}
                    fill="rgba(16, 185, 129, 0.4)"
                    className="animate-ping origin-center"
                    style={{ animationDuration: '2s', transformBox: 'fill-box' }}
                  />
                  <circle r={2} fill="#10b981" />
                </Marker>
              ))}

              {/* Render Dynamic Live Active User Marker */}
              <Marker coordinates={activeCity.coordinates}>
                <circle
                  r={12}
                  fill="rgba(24, 242, 229, 0.25)"
                  className="animate-ping-slow origin-center"
                  style={{ animationDuration: '2.5s', transformBox: 'fill-box' }}
                />
                <circle
                  r={6}
                  fill="rgba(24, 242, 229, 0.5)"
                  className="animate-ping origin-center"
                  style={{ animationDuration: '1.5s', transformBox: 'fill-box' }}
                />
                <circle r={3.5} fill="#18f2e5" />
                <text
                  textAnchor="middle"
                  y={-14}
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fill: '#18f2e5',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                  }}
                >
                  Live User: {activeCity.name}
                </text>
              </Marker>
            </ZoomableGroup>
          </ComposableMap>

          {/* Info Icon overlay with custom Premium hover tooltip */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center justify-center">
            <div className="relative group/info">
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-black/90 text-white text-xs py-1.5 px-3 rounded-lg border border-gray-700 opacity-0 pointer-events-none group-hover/info:opacity-100 transition-opacity duration-200 shadow-xl z-30">
                developed by shourov paul
              </div>
              <div className="bg-white rounded-full p-0.5 shadow-lg flex items-center justify-center cursor-pointer">
                <Info className="size-5 text-black" fill="white" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-ping-slow {
          animation: mapPing 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes mapPing {
          75%, 100% {
            transform: scale(3.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default AnalyticsMapModal
