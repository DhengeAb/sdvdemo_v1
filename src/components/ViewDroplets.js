import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDroplets, deleteDroplet } from '../Data/storedDroplets';
import { CardContainer, CardBody, CardItem } from './3d-card';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions,IconButton ,CircularProgress} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import AppBarComponent from './AppBarComponents';  // Ensure the path is correct

const ViewDroplets = () => {
    const [droplets, setDroplets] = useState([]);
    const [selectedDroplet, setSelectedDroplet] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    // useEffect(() => {
    //     const getDroplets = async () => {
    //         const fetchedDroplets = await fetchDroplets();
    //         setDroplets(fetchedDroplets);
    //     };

    //     getDroplets();
    // }, []);

    useEffect(() => {
        const getDroplets = async () => {
            setIsLoading(true); // Set loading true before fetching
            const fetchedDroplets = await fetchDroplets();
            setDroplets(fetchedDroplets);
            setIsLoading(false); // Set loading false after fetching
        };
    
        getDroplets();
    }, []);

    const handleOpenDetails = (droplet) => {
        setSelectedDroplet(droplet);
        setIsDetailsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDetailsDialogOpen(false);
        setSelectedDroplet(null);
    };

    const handleEditDroplet = (droplet) => {
        navigate(`/build-droplet`, { state: { droplet } });
    };

    const handleLogout = () => {
        // Clear the authentication token from local storage
        localStorage.removeItem('authToken');
        
        // Redirect to login page or update the state to reflect that the user is logged out
        window.location.href = '/login'; // This line will reload the page and redirect to the login page.
      };

    

    const handleDelete = async (scenarioID) => {
        const isDeleted = await deleteDroplet(scenarioID);
        if (isDeleted) {
          alert('Droplet deleted successfully!');
          setDroplets(droplets.filter(droplet => droplet.ID !== scenarioID)); // Remove from UI
        } else {
          alert('Failed to delete droplet. Please try again.');
        }
      };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">

{isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' ,paddingLeft:'500px'}}>
                <CircularProgress />
            </div>
        ) : (
            droplets.map((droplet, index) => (
                
                <CardContainer key={index} containerClassName="w-full">

                    <CardBody className="bg-white  rounded-lg shadow-lg p-4 flex flex-col justify-between h-[400px] w-[300px] relative">

                        <CardItem translateZ={50} className="text-center mb-2">
                            <h3 className="text-xl font-bold mb-2">{droplet.scenario_name}</h3>
                        </CardItem>
                        <CardItem translateZ={30} className="text-black mb-4 h-12 overflow-hidden">
                            <p>{droplet.description}</p>
                        </CardItem>
                        <CardItem translateZ={10} className="flex justify-center items-center mb-4 flex-grow">
                            <img 
                                src={droplet.metadata?.image_url || "https://via.placeholder.com/150"} 
                                alt={droplet.scenario_name} 
                                className="w-4/5 h-32 object-contain"
                            />
                        </CardItem>
                        <CardItem translateZ={-20} className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            <p>Version: {droplet.version}</p>
                        </CardItem>

                        <div className="flex justify-between items-center">
    <CardItem translateZ={0}>
        <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenDetails(droplet)}
            size="small"
        >
            Details
        </Button>
    </CardItem>
    <CardItem translateZ={0}>
        <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => handleEditDroplet(droplet)}
            size="small"
        >
            Edit
        </Button>
    </CardItem>

    <CardItem translateZ={0}>
        <IconButton
            onClick={() => handleDelete(droplet.ID)}
        >
            <DeleteIcon color="error" />
        </IconButton>
    </CardItem>

</div>
                    </CardBody>
                </CardContainer>
            )))}

            {/* Details Dialog */}
            <Dialog open={isDetailsDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Droplet Details</DialogTitle>
                <DialogContent>
                    {selectedDroplet && (
                        <pre>{JSON.stringify(selectedDroplet, null, 2)}</pre>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewDroplets;
