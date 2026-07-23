'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, User, Shield, Key, Palette, Bell,
  LogOut, Trash2, Download, ChevronRight, QrCode,
  Wallet, Users, MessageSquare, Activity, History
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/AuthProvider';
import UsernameChecker from '@/components/profile/UsernameChecker';
import ProfilePictureSection from '@/components/profile/ProfilePictureSection';
import AIBioGenerator from '@/components/profile/AIBioGenerator';
import QRCodeCard from '@/components/profile/QRCodeCard';
import SessionsManager from '@/components/profile/SessionsManager';
import BadgesDisplay from '@/components/profile/BadgesDisplay';
import PointWallet from '@/components/wallet/PointWallet';
import toast from 'react-hot-toast';

export default function ProfileSettingsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const sections = [
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
    { id: 'avatar', icon: <Palette className="w-5 h-5" />, label: 'Avatar' },
    { id: 'bio', icon: <Sparkles className="w-5 h-5" />, label: 'AI Bio' },
    { id: 'badges', icon: <Shield className="w-5 h-5" />, label: 'Badges' },
    { id: 'wallet', icon: <Wallet className="w-5 h-5" />, label: 'Wallet' },
    { id: 'qr', icon: <QrCode className="w-5 h-5" />, label: 'QR Code' },
    { id: 'sessions', icon: <Key className="w-5 h-5" />, label: 'Security' },
  ];

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/profile/export-data');
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aivision-export-${Date.now()}.json`;
      a.click();
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-400">
            Manage your identity, security, and preferences
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400">
              ID: {profile?.custom_id || 'Generating...'}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-4 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {section.icon}
                    {section.label}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}

              {/* Danger Zone */}
              <div className="pt-4 mt-4 border-t border-gray-800 space-y-2">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export My Data
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure? This cannot be undone.')) {
                      toast.error('Account deletion requires admin approval');
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <UsernameChecker
                    userId={user.id}
                    email={user.email}
                    fullName={profile?.full_name}
                    currentUsername={profile?.username}
                    onUsernameSet={(username) => {
                      toast.success(`Username set to @${username}`);
                    }}
                  />
                </motion.div>
              )}

              {activeSection === 'avatar' && (
                <motion.div
                  key="avatar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ProfilePictureSection
                    userId={user.id}
                    currentAvatar={profile?.avatar_url}
                    onAvatarUpdate={(url) => {
                      toast.success('Avatar updated!');
                    }}
                  />
                </motion.div>
              )}

              {activeSection === 'bio' && (
                <motion.div
                  key="bio"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <AIBioGenerator
                    userId={user.id}
                    currentBio={profile?.bio}
                    aiBio={profile?.ai_generated_bio}
                  />
                </motion.div>
              )}

              {activeSection === 'badges' && (
                <motion.div
                  key="badges"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <BadgesDisplay badges={profile?.badges || []} />
                </motion.div>
              )}

              {activeSection === 'wallet' && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <PointWallet userId={user.id} />
                </motion.div>
              )}

              {activeSection === 'qr' && (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <QRCodeCard
                    username={profile?.username}
                    customId={profile?.custom_id}
                    fullName={profile?.full_name}
                  />
                </motion.div>
              )}

              {activeSection === 'sessions' && (
                <motion.div
                  key="sessions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <SessionsManager userId={user.id} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to import AnimatePresence
import { AnimatePresence } from 'framer-motion';
