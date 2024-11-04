import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const EditDroplet = ({ droplet, open, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [version, setVersion] = useState('');
    const [iconUrl, setIconUrl] = useState('');

    // Use effect to set state when a valid droplet is passed
    useEffect(() => {
        if (droplet) {
            setName(droplet.name || '');
            setDescription(droplet.description || '');
            setVersion(droplet.version || '');
            setIconUrl(droplet.metadata?.iconUrl || '');
        }
    }, [droplet]);

    const handleSave = () => {
        if (droplet) {
            const updatedDroplet = {
                ...droplet,
                name,
                description,
                version,
                metadata: {
                    ...droplet.metadata,
                    iconUrl,
                }
            };
            onSave(updatedDroplet);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Droplet</DialogTitle>
            <DialogContent>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label="Version"
                    fullWidth
                    margin="normal"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                />
                <TextField
                    label="Icon URL"
                    fullWidth
                    margin="normal"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDroplet;
