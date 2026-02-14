import React, { useState } from 'react';
import CreateArea from './CreateArea';
import CreateSlots from './CreateSlots';
import ManageExistingSlots from './ManageExistingSlots';
import ManageAreas from './ManageAreas';

const ManageSlotsAreas = ({ slots, onRefresh, loading, setLoading }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <CreateArea
        onAreaCreated={handleRefresh}
        loading={loading}
        setLoading={setLoading}
      />

      <ManageAreas
        onAreaDeleted={handleRefresh}
        loading={loading}
        setLoading={setLoading}
        triggerRefresh={refreshTrigger}
      />

      <CreateSlots
        slots={slots}
        onSlotsCreated={handleRefresh}
        loading={loading}
        setLoading={setLoading}
        triggerRefresh={refreshTrigger}
      />

      <ManageExistingSlots
        slots={slots}
        onSlotDeleted={handleRefresh}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ManageSlotsAreas;