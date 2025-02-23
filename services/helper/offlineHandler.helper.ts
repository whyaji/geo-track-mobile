import log from '../config/logger.config';
import { reduxStorage } from './storage.helper';

export const offlineHandler = async (path: string) => {
    try {
        const cachedData = await reduxStorage.getItem(path);
        if (!cachedData) {
            log.Info(`No cached data found for ${path}`);
            return {
                success: false,
                message: 'No internet connection',
                data: { message: 'No internet connection' },
            };
        }
        log.Info(`Cached data found for ${path}, using offline data`);
        return { data: JSON.parse(cachedData) };
    } catch (error) {
        log.Error(`Error retrieving data from local storage for ${path}: ${error}`);
        return {
            success: false,
            message: 'Error retrieving data',
            data: { message: 'Error retrieving data' },
        };
    }
};
