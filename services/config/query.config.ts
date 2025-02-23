import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { offlineHandler } from '../helper/offlineHandler.helper';
import { handleResponse } from '../helper/response.helper';
import { getStorageData } from '../helper/storage.helper';
import { ConnectionService } from './connection.config';
import log from './logger.config';

const Query = (baseUrl: string) =>
    fetchBaseQuery({
        baseUrl: baseUrl + 'v1/parent/',
        prepareHeaders: async (headers) => {
            try {
                const accessToken = await getStorageData('auth', 'accessToken');
                if (accessToken) {
                    log['Info'](`Access token found: ${accessToken}`);
                    headers.set('Authorization', `Bearer ${accessToken}`);
                } else {
                    log['Info']('No access token found, setting default Accept header');
                }
            } catch (error) {
                log['Error'](`Error retrieving access token: ${error}`);
            }
            headers.set('Accept', 'application/json');
            return headers;
        },
    });

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const url = await getStorageData('applicationConfig', 'currentEnvironment');
    const path = `${JSON.stringify(args).replace(url ?? '', '')}`;
    const connectionService = new ConnectionService();
    const connectionStatus = await connectionService.checkConnection();

    log['Info'](`Connection status: ${connectionStatus ? 'online' : 'offline'}`);

    if (connectionStatus) {
        const query = Query(url);
        try {
            log['Fetch'](`Fetching data from API for ${path}`);
            const result = await query(args, api, extraOptions);
            return handleResponse(path, result, query, args, api, extraOptions);
        } catch (error) {
            log['Error'](`Error fetching data for ${path}: ${error}`);
            throw error;
        }
    } else {
        log['Info'](`Fetching data from offline storage for ${path}`);
        return offlineHandler(path);
    }
};
