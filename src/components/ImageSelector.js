import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Grid } from '@mui/material';

const S3_BUCKET_URL = 'https://oscar-demo.s3.ap-south-1.amazonaws.com/Icons/';

const imageFilenames = [
  'Anti-Stress_Mode_icon.png', 'Celebration_Mode_icon.png', 'Commute_to_Work_icon.png','Country_Music_icon.png' ,
  'Deep_Breathing_Exercise_Mode_icon.png','Digital_Detox_Drive_icon.png','Eco-Conscious_Mode_icon.png',
  'Energise_Mode_icon.png','Fresh_Air_Mode_icon.png','Hydration_Reminder_icon.png','Interactive_Learning_Mode_icon.png',// Add known filenames here
  'Location_Based_offers_icon.png','Low-Sleep_Alert_icon.png','Memory_Lane_Mode_icon.png','Mindfulness_Meditation_Mode_icon.png',
  'Mobile_Mindset_Shifter_icon.png',
];

const ImageSelector = ({ onSelectImage, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Select an Image</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {imageFilenames.map((filename) => (
            <Grid item xs={4} key={filename}>
              <img
                src={`${S3_BUCKET_URL}${filename}`}
                alt="Selectable"
                style={{ width: '100%', cursor: 'pointer', borderRadius: '8px' }}
                onClick={() => {
                  onSelectImage(`${S3_BUCKET_URL}${filename}`);
                  onClose();
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector;
