'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Wrench, X } from 'lucide-react';

const statusConfig = {
  operational: {
    icon: CheckCircle,
    text: 'All Systems Operational',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    dot: 'bg-green-400'
  },
  degraded: {
    icon: AlertTriangle,
    text: 'Partial Service Disruption',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400'
  },
  maintenance: {
    icon: Wrench,
    text: 'Scheduled Maintenance',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    dot: 'bg-blue-400'
  }
};

export default function StatusBadge() {
  const [visible, setVisible] = useState(true);
  const [status] = useState('operational');
  const config = statusConfig[status];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={`flex items-center space-x-3 px-4 py-2 ${config.bg} ${config.border} border rounded-full backdrop-blur-md shadow-lg`}>
            <span className={`w-2 h-2 ${config.dot} rounded-full animate-pulse`} />
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className={`text-sm font-medium ${config.color}`}>{config.text}</span>
            <button
              onClick={() => setVisible(false)}
              className="p-0.5 hover:bg-gray-700/50 rounded-full transition-colors"
            >
              <X className={`w-3.5 h-3.5 ${config.color}`} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
