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

// Helper component to center map when selected library changes
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapView = ({ libraries = [], center = [12.9716, 77.5946], zoom = 12, height = '500px', onSelectLibrary }) => {
  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-[#E4DFD5] relative z-0 shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <RecenterMap center={center} />

        {/* CartoDB Voyager Tiles */}
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
          const availableSeats = lib.availableSeats ?? Math.max(0, (lib.totalSeats || 0) - (lib.occupiedSeats || 0));

          return (
            <Marker
              key={libId}
              position={[lat, lng]}
              eventHandlers={{
                click: () => {
                  if (onSelectLibrary) onSelectLibrary(lib);
                }
              }}
            >
              <Popup>
                <div className="p-1 max-w-[220px] font-sans">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mb-1 inline-block ${isOpen ? 'bg-[#159A70] text-white' : 'bg-[#B93434] text-white'}`}>
                    {isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                  <h4 className="font-extrabold text-sm text-[#151A2B] mb-1">{lib.name}</h4>
                  <p className="text-xs text-slate-500 mb-2 truncate">{lib.address}</p>

                  <div className="bg-[#F7F5F1] p-2 rounded border border-[#E4DFD5] mb-3 text-xs space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span className="font-semibold">Seats Available:</span>
                      <span className="font-bold text-[#159A70]">{availableSeats}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span className="font-semibold">Catalog Books:</span>
                      <span className="font-bold">{lib.totalBooks ? lib.totalBooks.toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>

                  <Link
                    to={`/libraries/${libId}`}
                    className="block w-full text-center py-1.5 px-3 bg-[#151A2B] hover:bg-[#1E253B] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    View Details →
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
