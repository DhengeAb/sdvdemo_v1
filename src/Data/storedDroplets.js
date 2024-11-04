export const fetchDroplets = async () => {
    const apiUrl = "https://mqk13rtrbl.execute-api.ap-south-1.amazonaws.com/dev/Scenario-Data";
  
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ "Type": "Scenario" }) // Request body as required
        });
  
        if (!response.ok) {
            throw new Error('Failed to fetch droplets');
        }
  
        const data = await response.json();
        
        // Check and retrieve 'body' if 'statusCode' is 200
        if (data.statusCode === 200 && Array.isArray(data.body)) {
            return data.body; // Extract and return the array of scenarios from 'body'
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        console.error('Error fetching droplets:', error);
        return [];
    }
};

  
export const addDroplet = async (dropletData) => {
    const apiUrl = "https://mqk13rtrbl.execute-api.ap-south-1.amazonaws.com/dev/Scenario-Data";

    try {
        console.log("Sending droplet data:", dropletData);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Type: "Create",
                body: dropletData // Include the droplet data within "body" field
            }),
            mode: 'cors',
        });

        // Check for a 200 status code to confirm success
        if (response.status !== 200) {
            const responseText = await response.text();
            console.error("Failed to add droplet:", responseText);
            throw new Error(`Failed to add droplet: ${responseText}`);
        }

        // Parse the response to handle the nested "body" field
        const responseData = await response.json();

        // Access the nested data within the "body" object
        const dropletResponseData = responseData.body;
        console.log("Droplet added successfully:", dropletResponseData);

        return dropletResponseData;
    } catch (error) {
        console.error('Error adding droplet:', error);
        return null;
    }
};


  
  // New function to update an existing droplet
  export const updateDroplet = async (requestBody) => {
    const apiUrl = "https://mqk13rtrbl.execute-api.ap-south-1.amazonaws.com/dev/Scenario-Data";

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            mode: 'cors',  // This can be omitted if CORS is not configured or not necessary
        });

        if (!response.ok) {
            throw new Error('Failed to update droplet: ' + response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating droplet:', error);
        return null;
    }
};

  
  // New function to delete a droplet
  export const deleteDroplet = async (scenarioID) => {
    const apiUrl = "https://mqk13rtrbl.execute-api.ap-south-1.amazonaws.com/dev/Scenario-Data";
  
    try {
        const response = await fetch(apiUrl, {
            method: 'POST', // Changed from DELETE to POST
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                "Type": "Delete",
                "ID": scenarioID // Use the scenarioID in the request body
            })
        });
  
        if (!response.ok) {
            throw new Error('Failed to delete droplet');
        }
  
        console.log('Droplet deleted successfully');
        return true;
    } catch (error) {
        console.error('Error deleting droplet:', error);
        return false;
    }
};

// Add this function to DropletBuilder.js or your API utility file
export const fetchDropletById = async (id) => {
    const apiUrl = "https://mqk13rtrbl.execute-api.ap-south-1.amazonaws.com/dev/Scenario-Data";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                "Type": "Scenario",
                "ID": id
            }) // Use the provided ID
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch droplet with ID ${id}`);
        }

        const data = await response.json();

        // Check and retrieve 'body' if 'statusCode' is 200
        if (data.statusCode === 200 && data.body) {
            return data.body; // Return the droplet data from 'body'
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        console.error("Error fetching droplet by ID:", error);
        return null;
    }
};

  