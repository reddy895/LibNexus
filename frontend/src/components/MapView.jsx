import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Fix Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically adjust map center when libraries change
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapView = ({ libraries = [], center = [12.9716, 77.5946], zoom = 12, height = '500px' }) => {
  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <RecenterMap center={center} />

        {/* Reliable CartoDB Voyager Tiles (Zero 403 Errors) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {libraries.map((lib) => {
          const libId = lib._id || lib.id;
          const lat = lib.latitude;
          const lng = lib.longitude;

          if (!lat || !lng) return null;

          const isOpen = (lib.status || '').toLowerCase() === 'open';

          return (
            <Marker key={libId} position={[lat, lng]}>
              <Popup>
                <div className="p-1 max-w-[220px] font-sans">
                  <h4 className="font-extrabold text-sm text-gray-900 mb-1">{lib.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{lib.address}</p>
                  
                  <div className="flex items-center justify-between text-xs mb-3 bg-slate-50 p-2 rounded border border-slate-200 font-semibold">
                    <span className={isOpen ? 'text-emerald-600' : 'text-rose-600'}>
                      {isOpen ? 'OPEN NOW' : 'CLOSED'}
                    </span>
                    <span className="text-gray-700">
                      🪑 {lib.availableSeats ?? 0} seats
                    </span>
                  </div>

                  <Link
                    to={`/libraries/${libId}`}
                    className="block w-full text-center py-1.5 px-3 bg-[#9F2D2D] hover:bg-[#852525] text-white text-xs font-bold rounded transition-colors"
                  >
                    View Library
                  </Link>
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
