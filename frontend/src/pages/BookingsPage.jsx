import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  QrCode,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed, cancelled

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking reservation?')) return;
    try {
      await bookingService.cancelBooking(bookingId);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return b.status === 'active';
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-slate-200 font-medium">My Bookings</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Seat Reservations</h1>
          <p className="text-xs text-slate-400 mt-1">
            View pass passes, active seats, and reservation history across all libraries.
          </p>
        </div>

        <Link
          to="/libraries"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md self-start sm:self-auto"
        >
          Book New Seat
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        {[
          { id: 'all', label: `All (${bookings.length})` },
          { id: 'active', label: `Active (${bookings.filter((b) => b.status === 'active').length})` },
          { id: 'completed', label: `Completed (${bookings.filter((b) => b.status === 'completed').length})` },
          { id: 'cancelled', label: `Cancelled (${bookings.filter((b) => b.status === 'cancelled').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              filter === tab.id
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchBookings} />}

      {loading ? (
        <LoadingSpinner message="Fetching your reservations..." />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          message={
            filter === 'all'
              ? "You haven't reserved any library seats yet. Start by discovering a library!"
              : `No bookings matching '${filter}' status.`
          }
          actionText="Browse Libraries"
          onAction={() => (window.location.href = '/libraries')}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isActive = booking.status === 'active';
            const isCancelled = booking.status === 'cancelled';
            const isCompleted = booking.status === 'completed';

            return (
              <div
                key={booking._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Booking Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isCompleted
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Pass Code: <strong className="text-slate-200">#LIB-{booking._id.slice(-6).toUpperCase()}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {booking.library?.name || 'Partner Library'}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {booking.library?.address}, {booking.library?.city}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Reserved Date</span>
                      <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {booking.date}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Time Slot</span>
                      <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> {booking.startTime} - {booking.endTime}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Seat Code</span>
                      <span className="font-bold text-indigo-400 mt-0.5 block">
                        {booking.seat?.seatNumber || 'N/A'} ({booking.seat?.zone || 'Zone'})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Pass Fee</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">
                        ${booking.totalAmount || 0} (FREE)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action & Pass Badge */}
                <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0">
                  <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-xl border border-slate-700">
                    <QrCode className="w-10 h-10 text-indigo-400" />
                    <div className="text-[10px] text-slate-400 pr-2">
                      <span className="block font-bold text-slate-200">ENTRY PASS</span>
                      Show at entrance
                    </div>
                  </div>

                  {isActive && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-semibold rounded-lg transition-all"
                    >
                      Cancel Pass
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
