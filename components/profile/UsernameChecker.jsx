'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RefreshCw, Sparkles } from 'lucide-react';
import { checkUsernameAvailability, generateUsernameSuggestion } from '@/lib/profile-utils';

export default function UsernameChecker({ userId, email, fullName, currentUsername, onUsernameSet }) {
  const [username, setUsername] = useState(currentUsername || '');
  const [status, setStatus] = useState({ available: null, message: '' });
  const [loading, setLoading] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useState('');

  // Debounce username input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  // Check availability when debounced value changes
  useEffect(() => {
    if (debouncedUsername && debouncedUsername.length >= 3) {
      checkAvailability(debouncedUsername);
    } else {
      setStatus({ available: null, message: '' });
    }
  }, [debouncedUsername]);

  const checkAvailability = useCallback(async (name) => {
    if (name === currentUsername) {
      setStatus({ available: true, message: 'This is your current username' });
      return;
    }
    setLoading(true);
    const result = await checkUsernameAvailability(name);
    setStatus(result);
    setLoading(false);
  }, [currentUsername]);

  const handleSuggestUsername = () => {
    const suggestion = generateUsernameSuggestion(email, fullName);
    setUsername(suggestion);
  };

  const handleSaveUsername = async () => {
    if (!status.available) return;
    const { setUsername: saveUsername } = await import('@/lib/profile-utils');
    const result = await saveUsername(userId, username);
    if (result.success && onUsernameSet) {
      onUsernameSet(username);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-400" />
        Choose Your Username
      </h3>

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              @
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="your_username"
              maxLength={30}
              className="input-field pl-8 pr-12"
            />
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                </motion.div>
              )}
              {!loading && status.available === true && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Check className="w-5 h-5 text-green-400" />
                </motion.div>
              )}
              {!loading && status.available === false && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-red-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Status message */}
        <AnimatePresence>
          {status.message && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm mt-2 ml-1 ${
                status.available ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {status.message}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSuggestUsername}
            className="btn-ghost text-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Suggest Username
          </button>
          {status.available && username !== currentUsername && (
            <button
              onClick={handleSaveUsername}
              className="btn-primary text-sm"
            >
              Save Username
            </button>
          )}
        </div>

        {/* Profile URL Preview */}
        {username && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-400">Your profile URL:</p>
            <p className="text-sm text-purple-400 font-mono">
              aivision.vercel.app/u/{username || '...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
