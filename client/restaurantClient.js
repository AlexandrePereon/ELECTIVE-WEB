import axios from 'axios';
import clientConfig from './clientConfig.json' assert { type: 'json' };


const restaurantClient = {
    getRestaurantByCreatorId : async (creatorId) => {
        try {
            const axiosReq = axios.create({
                baseURL: `http://${clientConfig.restaurantURL}:${clientConfig.restaurantPORT}`,
                });
            
            const response = await axiosReq.get(`${clientConfig.restaurantPREFIX}${clientConfig.restaurantGetByCreatorId}/${creatorId}`);
            return response.data; 
         } catch (error) {
            return null;
        }
    },
};

export default restaurantClient;
