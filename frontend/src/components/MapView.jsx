import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, Navigation, Layers, Maximize2, ExternalLink, MapPin } from 'lucide-react';

// Fix Leaflet default icon paths in React (fallback)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Tile Layer Configurations (All 100% Free - Zero API Key Required & Zero Watermarks)
const TILE_LAYERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  esriStreet: {
    name: 'Esri Street',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, TomTom'
  },
  hot: {
    name: 'Humanitarian',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://www.hotosm.org/">HOT</a>'
  },
  topo: {
    name: 'Terrain Topo',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP'
  }
};

// Calculate Haversine distance in km
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

// Helper component to center map when selection changes and fix container invalidation
const MapController = ({ center, zoom, libraries }) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate size on load to ensure map renders smoothly inside dynamic containers
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);

  return null;
};

// Create dynamic HTML DivIcon marker for each library with live seat count badge
const createCustomLibraryIcon = (lib, isSelected = false) => {
  const isOpen = (lib.status || '').toLowerCase() === 'open';
  const availableSeats = lib.availableSeats ?? Math.max(0, (lib.totalSeats || 0) - (lib.occupiedSeats || 0));
  const statusBg = isOpen ? '#10B981' : '#EF4444';
  const badgeBg = isOpen ? '#D6FFCB' : '#FEE2E2';
  const badgeText = isOpen ? '#042F32' : '#991B1B';
  const pinBg = isSelected ? '#042F32' : '#FFFFFF';
  const textColor = isSelected ? '#FFFFFF' : '#042F32';
  const borderColor = isSelected ? '#D6FFCB' : '#042F32';
  const shadow = isSelected
    ? '0 0 0 3px rgba(4, 47, 50, 0.4), 0 8px 20px rgba(0,0,0,0.3)'
    : '0 4px 14px rgba(0,0,0,0.18)';

  const libNameShort = lib.name.length > 20 ? lib.name.substring(0, 18) + '...' : lib.name;

  const html = `
    <div style="
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: ${pinBg};
      color: ${textColor};
      border: 2px solid ${borderColor};
      border-radius: 9999px;
      box-shadow: ${shadow};
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 800;
      white-space: nowrap;
      transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
    ">
      <span style="
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background-color: ${statusBg};
        display: inline-block;
        box-shadow: 0 0 6px ${statusBg};
        flex-shrink: 0;
      "></span>
      <span style="letter-spacing: -0.01em;">${libNameShort}</span>
      <span style="
        background: ${badgeBg};
        color: ${badgeText};
        padding: 2px 7px;
        border-radius: 9999px;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.02em;
        flex-shrink: 0;
      ">${availableSeats} free</span>
      <div style="
        position: absolute;
        bottom: -7px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid ${borderColor};
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-library-marker',
    iconSize: [160, 40],
    iconAnchor: [80, 40],
    popupAnchor: [0, -42]
  });
};

// Custom User Geolocation Marker Icon
const createUserLocationIcon = () => {
  const html = `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(16, 185, 129, 0.35);
        animation: pulse-ring 1.8s infinite;
      "></div>
      <div style="
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #042F32;
        border: 3px solid #D6FFCB;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'user-location-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const MapView = ({
  libraries = [],
  center = [12.9716, 77.5946],
  zoom = 12,
  height = '500px',
  onSelectLibrary,
  selectedLibraryId = null
}) => {
  const [activeTile, setActiveTile] = useState('osm');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  // Request browser live GPS location
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setLocating(false);
        if (mapInstance) {
          mapInstance.flyTo(coords, 14, { duration: 1.2 });
        }
      },
      (err) => {
        setLocating(false);
        alert('Could not get your location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fit bounds to show all library pins
  const handleFitAllBounds = () => {
    if (!mapInstance || libraries.length === 0) return;
    const validCoords = libraries
      .filter(l => l.latitude && l.longitude)
      .map(l => [l.latitude, l.longitude]);
    if (userLocation) validCoords.push(userLocation);

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  };

  const tile = TILE_LAYERS[activeTile] || TILE_LAYERS.osm;

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border-2 border-[#042F32] relative z-0 shadow-sharp group">
      
      {/* Dynamic Keyframes for Geolocation Radar Pulse */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          padding: 0 !important;
          border: 2px solid #042F32 !important;
          box-shadow: 0 10px 25px -5px rgba(4, 47, 50, 0.3) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 260px !important;
        }
        .leaflet-popup-tip {
          background: #042F32 !important;
        }
      `}</style>

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        {/* Layer / Tile Switcher Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Switch Map Tiles"
            className="p-2.5 bg-[#042F32] hover:bg-[#143F40] text-[#D6FFCB] rounded-xl border-2 border-[#042F32] shadow-sharp transition-all flex items-center gap-1.5 text-xs font-black uppercase font-heading"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{tile.name}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-[#042F32] rounded-xl shadow-sharp overflow-hidden py-1">
              <div className="px-3 py-1 text-[10px] font-black uppercase text-[#143F40]/70 border-b border-[#DFE8DC]">
                Map Style (No API Key Required)
              </div>
              {Object.entries(TILE_LAYERS).map(([key, layer]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveTile(key);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors flex items-center justify-between ${
                    activeTile === key ? 'bg-[#042F32] text-[#D6FFCB]' : 'text-[#042F32] hover:bg-[#F7FAF5]'
                  }`}
                >
                  {layer.name}
                  {activeTile === key && <span className="w-2 h-2 rounded-full bg-[#D6FFCB]"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Locate User GPS Button */}
        <button
          type="button"
          onClick={handleLocateUser}
          disabled={locating}
          title="Find My Location"
          className="p-2.5 bg-white hover:bg-[#F7FAF5] text-[#042F32] rounded-xl border-2 border-[#042F32] shadow-sharp transition-all flex items-center justify-center font-bold text-xs"
        >
          <Navigation className={`w-4 h-4 text-[#042F32] ${locating ? 'animate-spin' : ''}`} />
        </button>

        {/* Fit Bounds Button */}
        <button
          type="button"
          onClick={handleFitAllBounds}
          title="Fit All Libraries on Map"
          className="p-2.5 bg-white hover:bg-[#F7FAF5] text-[#042F32] rounded-xl border-2 border-[#042F32] shadow-sharp transition-all flex items-center justify-center font-bold text-xs"
        >
          <Maximize2 className="w-4 h-4 text-[#042F32]" />
        </button>
      </div>

      {/* Main Leaflet Map Container */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        ref={setMapInstance}
      >
        <MapController center={center} zoom={zoom} libraries={libraries} />

        <TileLayer
          key={activeTile}
          url={tile.url}
          attribution={tile.attribution}
          subdomains={tile.subdomains || 'abc'}
          maxZoom={19}
        />

        {/* User Geolocation Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={createUserLocationIcon()}>
            <Popup>
              <div className="p-3 bg-[#042F32] text-white rounded-xl">
                <p className="text-xs font-black text-[#D6FFCB] flex items-center gap-1 font-heading">
                  <Compass className="w-3.5 h-3.5 text-[#D6FFCB]" /> YOUR LIVE LOCATION
                </p>
                <p className="text-[11px] text-[#B6C8C5] mt-1">
                  Showing study hubs near you.
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Library Markers */}
        {libraries.map((lib) => {
          const libId = lib._id || lib.id;
          const lat = lib.latitude;
          const lng = lib.longitude;

          if (!lat || !lng) return null;

          const isSelected = selectedLibraryId === libId || (center[0] === lat && center[1] === lng);
          const isOpen = (lib.status || '').toLowerCase() === 'open';
          const availableSeats = lib.availableSeats ?? Math.max(0, (lib.totalSeats || 0) - (lib.occupiedSeats || 0));
          const totalSeats = lib.totalSeats || 180;
          const distanceKm = userLocation ? getDistanceKm(userLocation[0], userLocation[1], lat, lng) : null;

          return (
            <Marker
              key={libId}
              position={[lat, lng]}
              icon={createCustomLibraryIcon(lib, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectLibrary) onSelectLibrary(lib);
                }
              }}
            >
              <Popup>
                <div className="bg-white rounded-xl overflow-hidden font-sans">
                  
                  {/* Popup Header Image */}
                  {lib.image && (
                    <div className="h-28 relative overflow-hidden bg-[#042F32]">
                      <img src={lib.image} alt={lib.name} className="w-full h-full object-cover" />
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${isOpen ? 'bg-[#D6FFCB] text-[#042F32]' : 'bg-rose-500 text-white'}`}>
                        {isOpen ? 'OPEN NOW' : 'CLOSED'}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#042F32] leading-snug font-heading">{lib.name}</h4>
                      <p className="text-[11px] text-[#143F40]/80 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#042F32] shrink-0" />
                        <span className="truncate">{lib.address}</span>
                      </p>
                    </div>

                    {/* Live Occupancy Gauge Card */}
                    <div className="bg-[#F7FAF5] p-2.5 rounded-xl border border-[#DFE8DC] space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[#042F32]">
                        <span className="font-semibold text-[11px]">Available Seats:</span>
                        <span className="font-black text-[#10B981]">{availableSeats} / {totalSeats}</span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full h-2 bg-[#DFE8DC] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.round((availableSeats / totalSeats) * 100))}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-[10px] text-[#143F40]/70 pt-0.5 font-semibold">
                        <span>📚 Catalog: {lib.totalBooks ? lib.totalBooks.toLocaleString() : 'N/A'}</span>
                        {distanceKm && <span className="text-[#042F32] font-black">📍 {distanceKm} km away</span>}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to={`/libraries/${libId}`}
                        className="py-2 px-2 bg-[#042F32] hover:bg-[#143F40] text-[#D6FFCB] text-[11px] font-black uppercase text-center rounded-lg transition-colors font-heading flex items-center justify-center gap-1"
                      >
                        Details →
                      </Link>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2 bg-[#F7FAF5] hover:bg-[#EEF4EC] text-[#042F32] border border-[#042F32] text-[11px] font-bold uppercase text-center rounded-lg transition-colors flex items-center justify-center gap-1 font-heading"
                      >
                        Directions <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;

