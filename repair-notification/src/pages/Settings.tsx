
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Save } from 'lucide-react';
import Swal from 'sweetalert2';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accountSettings, setAccountSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifyEmail: true,
    notifySMS: false,
    darkMode: false,
    language: 'english'
  });

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setAccountSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your settings have been updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
    }, 800);
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Account Settings</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSaveSettings}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={accountSettings.name}
                    onChange={handleAccountChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={accountSettings.email}
                    onChange={handleAccountChange}
                  />
                </div>
              </div>
              
              <h3 className="text-md font-medium mb-3">Notification Preferences</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyEmail"
                    name="notifyEmail"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={accountSettings.notifyEmail}
                    onChange={handleAccountChange}
                  />
                  <label htmlFor="notifyEmail" className="ml-2 block text-sm text-gray-700">
                    Receive email notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifySMS"
                    name="notifySMS"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={accountSettings.notifySMS}
                    onChange={handleAccountChange}
                  />
                  <label htmlFor="notifySMS" className="ml-2 block text-sm text-gray-700">
                    Receive SMS notifications
                  </label>
                </div>
              </div>
              
              <h3 className="text-md font-medium mb-3">Appearance</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="darkMode"
                    name="darkMode"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={accountSettings.darkMode}
                    onChange={handleAccountChange}
                  />
                  <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                    Dark mode
                  </label>
                </div>
                
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    id="language"
                    name="language"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={accountSettings.language}
                    onChange={handleAccountChange}
                  >
                    <option value="english">English</option>
                    <option value="thai">Thai</option>
                    <option value="chinese">Chinese</option>
                    <option value="japanese">Japanese</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {user?.role === 'admin' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">System Settings</h2>
            </div>
            
            <div className="p-6">
              <form>
                <h3 className="text-md font-medium mb-3">Email Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700 mb-1">SMTP Server</label>
                    <input
                      type="text"
                      id="smtpServer"
                      name="smtpServer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="smtp.example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                    <input
                      type="text"
                      id="smtpPort"
                      name="smtpPort"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="587"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="emailUsername" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      id="emailUsername"
                      name="emailUsername"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="notifications@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="emailPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      id="emailPassword"
                      name="emailPassword"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="••••••••••••"
                    />
                  </div>
                </div>
                
                <h3 className="text-md font-medium mb-3">Backup Settings</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoBackup"
                      name="autoBackup"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
                      Enable automatic backups
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                    <select
                      id="backupFrequency"
                      name="backupFrequency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="daily"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save System Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
