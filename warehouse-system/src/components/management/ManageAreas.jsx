import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import { API_URL } from '../../utils/api';

const ManageAreas = ({ onAreaDeleted, loading, setLoading, triggerRefresh }) => {
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAreas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/areas`);
      const data = await response.json();
      console.log('Fetched areas:', data);
      setAreas(data);
    } catch (error) {
      console.error('Error fetching areas:', error);
      alert('Error loading areas. Check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and when triggerRefresh changes
  useEffect(() => {
    fetchAreas();
  }, [triggerRefresh]);

  const handleDelete = async (areaId, areaName) => {
    if (!window.confirm(`Delete "${areaName}" and all its empty slots?\n\n(Cannot be deleted if there are occupied slots).`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/areas/${areaId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        alert('Area deleted successfully!');
        fetchAreas();
        onAreaDeleted();
      } else {
        alert(data.message || 'Failed to delete area');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting area');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Existing Areas ({areas.length})</h2>
        <button
          onClick={fetchAreas}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-400 text-center py-8">Loading areas...</p>
      ) : areas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400">No areas found in database</p>
          <p className="text-slate-500 text-sm mt-2">Create an area above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {areas.sort((a, b) => a.name.localeCompare(b.name)).map(area => (
            <div
              key={area._id}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center justify-between hover:border-slate-600 transition"
            >
              <span className="font-medium text-sm truncate flex-1">{area.name}</span>
              <button
                onClick={() => handleDelete(area._id, area.name)}
                className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                disabled={loading}
                title="Delete area"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAreas;