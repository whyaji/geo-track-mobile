import type {
    BaseQueryApi,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import { router } from 'expo-router';
import log from '../config/logger.config';
import { clearUserData, reduxStorage } from './storage.helper';

const logResponse = (status: string, method: string, url: string, error?: string) => {
    const logType = error ? 'FetchError' : 'FetchSuccess';
    log[logType](
        `\n Status : ${status}\n`,
        `URL : ${url}\n`,
        `Method : ${method}\n`,
        error !== undefined ? `Error : ${error}\n` : ''
    );
};

export const handleResponse = async (
    path: string,
    result: any,
    Query: BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        object,
        FetchBaseQueryMeta
    >,
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: object
) => {
    const { data, meta, error } = result;
    const status = String(meta?.response?.status);
    const method = String(meta?.request?.method);
    const url = String(meta?.request?.url?.replaceAll('%3B', ';').replaceAll('%3A', ':'));

    if (status?.startsWith('2')) {
        logResponse(status, method, url);
        if (
            method === 'GET' ||
            (path.includes('"method":"POST","body":{"length":') && path.includes('"start":'))
        ) {
            try {
                await reduxStorage.setItem(`${path}`, JSON.stringify(data));
                log['Info']('Data saved', method, url);
            } catch (err) {
                log['Error'](`Error saving data to local storage for ${path}: ${err}`);
            }
        }
    } else {
        logResponse(status, method, url, JSON.stringify(error));
        log['Error'](error?.data?.message || 'Unknown error');
        if (status === '401') {
            await clearUserData();
            router.replace({
                pathname: '/login',
                params: { message: 'You have been logged out. Please login again.' },
            });
        }
    }

    return result;
};
