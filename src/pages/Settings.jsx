import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiUser, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { getHrProfile, updateHrProfile } from '../api/hr';
import { logout } from '../api/auth';
import { useToast } from '../components/ToastContainer';

function Settings() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
  });
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await getHrProfile();
      
      // Split name into first and last name
      const nameParts = profile.fullName?.split(' ') || ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const userData = {
        firstName,
        lastName,
        email: profile.email,
        phone: profile.phone || '',
        designation: profile.designation || '',
      };
      
      setFormData(userData);
      setOriginalData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      
      // Use cached data immediately as fallback
      if (user.name && user.email) {
        const nameParts = user.name.split(' ');
        const cachedData = {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email,
          phone: user.phone || '',
          designation: '',
        };
        
        setFormData(cachedData);
        setOriginalData(cachedData);
        setLoading(false);
      }
      
      // Fetch fresh data from API
      fetchUserData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate, fetchUserData]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showToast('First name and last name are required', 'error');
      return;
    }
    
    try {
      setSaving(true);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      await updateHrProfile({
        fullName,
        phone: formData.phone,
        designation: formData.designation,
      });
      
      // Update localStorage cache with new data
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          user.name = fullName;
          user.phone = formData.phone;
          localStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          console.error('Error updating localStorage:', e);
        }
      }
      
      setOriginalData(formData);
      showToast('Changes saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving changes:', error);
      showToast(error.response?.data?.message || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
          Settings
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary, #6b7280)' }}>
          Manage your account and preferences
        </p>
      </div>

      {loading ? (
        <div
          className="rounded-lg p-8 text-center"
          style={{
            backgroundColor: 'var(--color-bg-card, #ffffff)',
            border: '1px solid var(--color-border-primary, #e5e7eb)',
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#3b82f6', borderTopColor: 'transparent' }}
            />
            <p style={{ color: 'var(--color-text-secondary, #6b7280)' }}>Loading user data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Profile Information Card */}
          <div
            className="rounded-lg p-6 sm:p-8 mb-6"
            style={{
              backgroundColor: 'var(--color-bg-card, #ffffff)',
              border: '1px solid var(--color-border-primary, #e5e7eb)',
            }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
              <FiUser className="w-6 h-6" style={{ color: '#3b82f6' }} />
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                Profile Information
              </h2>
            </div>

            {/* Profile Photo Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b" style={{ borderColor: 'var(--color-border-primary, #e5e7eb)' }}>
              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: '#3b82f6' }}
              >
                <span>{getInitials(formData.firstName, formData.lastName)}</span>
              </div>

              {/* Name and Email */}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary, #6b7280)' }}>
                  {formData.email}
                </p>
                {formData.designation && (
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary, #6b7280)' }}>
                    {formData.designation}
                  </p>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* First Name and Last Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--color-input-bg, #f9fafb)',
                      borderColor: 'var(--color-input-border, #e5e7eb)',
                      color: 'var(--color-input-text, #1f2937)',
                    }}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--color-input-bg, #f9fafb)',
                      borderColor: 'var(--color-input-border, #e5e7eb)',
                      color: 'var(--color-input-text, #1f2937)',
                    }}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-all pr-24 cursor-not-allowed opacity-60"
                    style={{
                      backgroundColor: 'var(--color-bg-tertiary, #f3f4f6)',
                      borderColor: 'var(--color-input-border, #e5e7eb)',
                      color: 'var(--color-text-secondary, #6b7280)',
                    }}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                    }}
                  >
                    Verified
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-input-bg, #f9fafb)',
                    borderColor: 'var(--color-input-border, #e5e7eb)',
                    color: 'var(--color-input-text, #1f2937)',
                  }}
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g., HR Manager"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-input-bg, #f9fafb)',
                    borderColor: 'var(--color-input-border, #e5e7eb)',
                    color: 'var(--color-input-text, #1f2937)',
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border-primary, #e5e7eb)' }}>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-bg-tertiary, #f3f4f6)',
                  color: 'var(--color-text-primary, #1f2937)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="px-6 py-3 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: '#3b82f6' }}
              >
                {saving && (
                  <div
                    className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'white', borderTopColor: 'transparent' }}
                  />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Preferences & Account Actions Section */}
          <div
            className="rounded-lg p-6 sm:p-8"
            style={{
              backgroundColor: 'var(--color-bg-card, #ffffff)',
              border: '1px solid var(--color-border-primary, #e5e7eb)',
            }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <FiSettings className="w-6 h-6" style={{ color: '#3b82f6' }} />
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                Preferences & Account
              </h2>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg mb-4" style={{ backgroundColor: 'var(--color-bg-secondary, #f9fafb)' }}>
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <FiMoon className="w-5 h-5" style={{ color: 'var(--color-text-secondary, #6b7280)' }} />
                ) : (
                  <FiSun className="w-5 h-5" style={{ color: 'var(--color-text-secondary, #6b7280)' }} />
                )}
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                    Dark Mode
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary, #6b7280)' }}>
                    {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: isDarkMode ? '#3b82f6' : '#d1d5db',
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Divider */}
            <div className="border-t my-6" style={{ borderColor: 'var(--color-border-primary, #e5e7eb)' }} />

            {/* Logout Button */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary, #1f2937)' }}>
                Account Actions
              </h3>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                }}
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Settings;

