import axios from 'axios';
import clientConfig from './clientConfig.json' assert { type: 'json' };
import logger from '../utils/logger/logger.js';



const restaurantClient = {
    getRestaurantByCreatorId : async (creatorId) => {
        try {
            const axiosReq = axios.create({
                baseURL: `http://${clientConfig.restaurantURL}:${clientConfig.restaurantPORT}`,
                });
            
            const response = await axiosReq.get(`${clientConfig.restaurantPREFIX}${clientConfig.restaurantGetByCreatorId}/${creatorId}`);
            return response.data; 
         } catch (error) {
            logger.log('error', 'Error lors de la récupération du restaurant pour l\'utilisateur: ', {creatorId: creatorId});
            return null;
        }
    },
};

export default restaurantClient;
