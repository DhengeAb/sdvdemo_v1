// DropletJsonPreview.js
import React, { useEffect } from 'react';
import { TextField } from '@mui/material';

const DropletJsonPreview = ({
  dropletMetadata,
  selectedAPIs,
  selectedTriggers,
  selectedConditions,
  selectedVehicles,
  jsonContent,
  setJsonContent
}) => {
  useEffect(() => {
    // Update the JSON content whenever the props change
    const updatedJson = {
      ID: dropletMetadata.id || null,
      scenario_name: dropletMetadata.name || null,
      Type:"Scenario",
      description: dropletMetadata.description || null,
      version: null,
      created_time: null,
      updated_time: null,
      triggers: selectedTriggers.map(trigger => ({
        type: 'VSSSignalTrigger',
        vss_signal: trigger.vssPath || null,
        operator: trigger.operator || null,
        value: trigger.value || null
      })),
      conditions: selectedConditions.map(condition => ({
        type: 'TimeCondition',
        parameters: condition.parameters || { defaultParam: 'exampleValue' }
      })),
      actions: selectedAPIs.map((api, index) => ({
        id: `action_${index.toString().padStart(3, '0')}`,
        type: 'VSSSignalAction',
        vss_signal: api.vss_signal || "default_signal_path",
        value: typeof api.value,
        target: "telematics"
    }))
    ,
      metadata: {
        icon_url: dropletMetadata.pictureUrl || null,
      },
      vehicles: selectedVehicles.length > 0 ? selectedVehicles : null
    };
    setJsonContent(JSON.stringify(updatedJson, null, 2));
  }, [dropletMetadata, selectedAPIs, selectedTriggers, selectedConditions, selectedVehicles, setJsonContent]);

  const handleJsonChange = (e) => {
    setJsonContent(e.target.value);
  };

  return (
    <TextField
      fullWidth
      multiline
      minRows={20}
      variant="outlined"
      value={jsonContent}
      onChange={handleJsonChange}
    />
  );
};

export default DropletJsonPreview;
