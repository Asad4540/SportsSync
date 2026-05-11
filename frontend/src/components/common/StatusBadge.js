import React from 'react';

/**
 * StatusBadge - Color-coded status pill
 */
const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    approved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
    upcoming: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    ongoing: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    completed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[status] || styles.pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'pending' ? 'bg-amber-400' :
        status === 'approved' || status === 'ongoing' ? 'bg-emerald-400' :
        status === 'rejected' ? 'bg-red-400' :
        status === 'upcoming' ? 'bg-blue-400' :
        'bg-gray-400'
      }`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
