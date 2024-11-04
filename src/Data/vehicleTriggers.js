export const triggerAPIs = [
    {
      name: "Playback Control",
      vssPath: "vehicle.media.playbackControl",
      actionParameter: { command: ["Play", "Pause", "Stop", "NextTrack", "PreviousTrack"] },
    },
    {
      name: "Volume Level",
      vssPath: "vehicle.media.volume.level",
      actionParameter: { value: [0, 100] },
    },
    {
      name: "Mute",
      vssPath: "vehicle.media.volume.isMuted",
      actionParameter: { value: [true, false] },
    },
    // Add more API data as needed...
  ];
  