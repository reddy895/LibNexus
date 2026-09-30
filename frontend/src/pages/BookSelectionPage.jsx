import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import seatService from '../services/seatService';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  Zap,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ZONES = ['All', 'Quiet Zone', 'Reading Room', 'Computer Lab', 'Group Study'];

const BookSelectionPage = () => {
  const { id: libraryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [library, setLibrary] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Time & Filter state
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');

  // Zone & Feature filters
  const [selectedZone, setSelectedZone] = useState('All');
  const [requirePower, setRequirePower] = useState(false);
  const [requireWindow, setRequireWindow] = useState(false);

  // Fetch Library info on mount
  useEffect(() => {
    const fetchLibraryInfo = async () => {
      setLoading(true);
      try {
        const libData = await libraryService.getLibraryById(libraryId);
        setLibrary(libData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load library info');
      } finally {
        setLoading(false);
      }
    };
    if (libraryId) fetchLibraryInfo();
  }, [libraryId]);

  // Fetch Seats availability when date or times change
  const fetchSeatAvailability = async () => {
    if (!libraryId || !date || !startTime || !endTime) return;
    setSeatsLoading(true);
    try {
      const data = await seatService.getLibraryAvailability(libraryId, {
        date,
        startTime,
        endTime
      });
      setSeats(data);
      // Reset selected seat if no longer available
      if (selectedSeat) {
        const matchingSeat = data.find((s) => s._id === selectedSeat._id);
        if (!matchingSeat || matchingSeat.status !== 'available') {
          setSelectedSeat(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch seat availability:', err);
    } finally {
      setSeatsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatAvailability();
  }, [libraryId, date, startTime, endTime]);

  // Filter seats based on selected options
  const filteredSeats = seats.filter((seat) => {
    if (selectedZone !== 'All' && seat.zone !== selectedZone) return false;
    if (requirePower && !seat.hasPower) return false;
    if (requireWindow && !seat.hasWindowView) return false;
    return true;
  });

  const handleBookingSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/libraries/${libraryId}/seats` } } });
      return;
    }

    if (!selectedSeat) {
      setError('Please select an available seat first.');
      return;
    }

    setBookingLoading(true);
    setError(null);

    try {
      const bookingData = {
        libraryId,
        seatId: selectedSeat._id,
        date,
        startTime,
        endTime
      };

      const result = await bookingService.createBooking(bookingData);
      setBookingSuccess(result);

      // Redirect to bookings after 2 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. The seat might have been booked by someone else.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading library seat map..." />;
  if (!library) return <ErrorMessage message="Library not found" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <Link to="/libraries" className="hover:text-white transition-colors">Libraries</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <Link to={`/libraries/${library._id}`} className="hover:text-white transition-colors">{library.name}</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-slate-200 font-medium">Reserve Seat</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Floor Plan & Seat Reservation
          </span>
          <h1 className="text-2xl font-extrabold text-white">{library.name}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {library.address}, {library.city}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Operating Hours</span>
            <span className="text-xs font-medium text-slate-200">{library.operatingHours || '08:00 AM - 10:00 PM'}</span>
          </div>
        </div>
      </div>

      {bookingSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-emerald-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Booking Confirmed!</h4>
            <p className="text-xs text-emerald-400/90">
              Your seat reservation has been created. Redirecting to your bookings page...
            </p>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Main Seat Reservation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Date & Time Selector + Interactive Seat Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Slot Selection Controls */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" /> 1. Select Date & Time Slot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Start Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  End Time
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Zone & Feature Filters */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              {/* Zone Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {ZONES.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      selectedZone === zone
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>

              {/* Amenity Toggles */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requirePower}
                    onChange={(e) => setRequirePower(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                  />
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Power
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requireWindow}
                    onChange={(e) => setRequireWindow(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                  />
                  <Eye className="w-3.5 h-3.5 text-sky-400" /> Window View
                </label>
              </div>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" /> 2. Choose Your Seat
              </h3>
              <span className="text-xs text-slate-400">
                {seatsLoading ? 'Refreshing availability...' : `${filteredSeats.length} seats shown`}
              </span>
            </div>

            {seatsLoading ? (
              <LoadingSpinner message="Checking real-time seat status..." />
            ) : (
              <SeatGrid
                seats={filteredSeats}
                selectedSeat={selectedSeat}
                onSelectSeat={(seat) => setSelectedSeat(seat)}
              />
            )}
          </div>
        </div>

        {/* Right Column: Checkout Summary Box */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 sticky top-24 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Reservation Summary
            </h3>

            {selectedSeat ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/80 rounded-xl border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      Selected Seat
                    </span>
                    <span className="px-2.5 py-1 rounded bg-indigo-600 text-white text-xs font-bold">
                      {selectedSeat.seatNumber}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Zone:</span>
                      <span className="font-semibold text-white">{selectedSeat.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Features:</span>
                      <span className="font-medium text-slate-200">
                        {[
                          selectedSeat.hasPower && 'Power Outlet',
                          selectedSeat.hasWindowView && 'Window View',
                          !selectedSeat.hasPower && !selectedSeat.hasWindowView && 'Standard Seat'
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date:</span>
                      <span className="font-medium text-slate-200">{date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time Slot:</span>
                      <span className="font-medium text-slate-200">{startTime} - {endTime}</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs border-t border-b border-slate-800 py-3">
                  <div className="flex justify-between text-slate-400">
                    <span>Seat Reservation Fee</span>
                    <span className="text-emerald-400 font-semibold">FREE / Included</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Access Duration</span>
                    <span className="text-slate-200 font-medium">{startTime} to {endTime}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800/60">
                    <span>Total Amount</span>
                    <span className="text-emerald-400">$0.00</span>
                  </div>
                </div>

                {!user && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>You need to sign in to confirm this reservation.</span>
                  </div>
                )}

                <button
                  onClick={handleBookingSubmit}
                  disabled={bookingLoading || !!bookingSuccess}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    'Confirming Booking...'
                  ) : user ? (
                    'Confirm & Reserve Seat'
                  ) : (
                    'Sign In to Complete Booking'
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2 border border-dashed border-slate-800 rounded-xl p-4">
                <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Please click on an available seat (emerald color) from the floor plan to inspect details and proceed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSelectionPage;
