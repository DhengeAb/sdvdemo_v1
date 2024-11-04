export const vehicleAPIs = [
  {
    name: "Playback Control",
    vss_signal: "vehicle.media.playbackControl",
    description: "This API Controls the media player of vehicle, Valid Values are Play,Pause,Stop,NextTrack,PreviousTrack.",
    dataType:"string",
    value:"swdw",
    UUID:"1",
  },
  {
    name: "Volume Level",
    vss_signal: "vehicle.media.volume.level",
    description: "This API Controls the media player of vehicle, Valid Values are Play,Pause,Stop,NextTrack,PreviousTrack.",
    dataType:"string",
    value:"swdw",
    UUID:"2",
  },
  {
    name: "Mute",
    vss_signal: "vehicle.media.volume.isMuted",
    description: "This API Controls the media player of vehicle, Valid Values are Play,Pause,Stop,NextTrack,PreviousTrack.",
    dataType:"string",
    value:"swdw",
    UUID:"3",
  },
  // Add more API data as needed...
];

export const vehicleConditions = [
  {
    name: "Time",
    vss_signal: "vehicle.Time",
    description:"Set the Day Condition",
    dataType:"DateTime",
    value:"swdw",
    UUID:"25",
  },
  {
    name: "Day",
    vss_signal: "vehicle.Day",
    description:"Set the Day Condition",
    dataType:"DateTime",
    value:"swdw",
    UUID:"26",
  },
  {
    name: "Date",
    vss_signal: "vehicle.Date",
    description:"Set the Day Condition",
    dataType:"DateTime",
    value:"swdw",
    UUID:"127",
  },
  // Add more API data as needed...
];

export const vehicleTriggers = [
  {
    name: "Playback Control",
    vss_signal: "vehicle.media.playbackControl",
    actionParameter: { command: ["Play", "Pause", "Stop", "NextTrack", "PreviousTrack"] },
    description: "This API Controls the media player of vehicle, Valid Values are Play,Pause,Stop,NextTrack,PreviousTrack.",
    dataType:"string",
    UUID:"4",
    value:"swdw",
  },
  {
    name: "Volume Level",
    vss_signal: "vehicle.media.volume.level",
    actionParameter: { value: [0, 100] },
    description: "This API Controls the media player of vehicle, Valid Values are Play,Pause,Stop,NextTrack,PreviousTrack.",
    dataType:"string",
    UUID:"5",
    value:"swdw",
  },
  {
    name: "Mute",
    vss_signal: "vehicle.media.volume.isMuted",
    actionParameter: { value: [true, false] },
    description: "This API Controls the media player of vehicle, Valid Values are Play,Pause,Stop,NextTrack,PreviousTrack.",
    dataType:"string",
    UUID:"6",
    
  },
  // Add more API data as needed...
];