import type { Storage as StorageType } from 'redux-persist';
import log from '../config/logger.config';
import Storage from 'expo-sqlite/kv-store';

export const reduxStorage: StorageType = {
    setItem: async (key, value) => {
        try {
            await Storage.setItem(key, value);
            return Promise.resolve(true);
        } catch (err) {
            log['Error']('Error while setting item in storage', err);
            return Promise.reject(err instanceof Error ? err : new Error(String(err)));
        }
    },
    getItem: async (key) => {
        try {
            const value = await Storage.getItem(key);
            return Promise.resolve(value);
        } catch (err) {
            log['Error']('Error while getting item from storage', err);
            return Promise.reject(err instanceof Error ? err : new Error(String(err)));
        }
    },
    removeItem: async (key) => {
        try {
            log['Info'](`Removing ${key}`);
            await Storage.removeItem(key);
            return Promise.resolve();
        } catch (err) {
            log['Error']('Error while removing item from storage', err);
            return Promise.reject(err instanceof Error ? err : new Error(String(err)));
        }
    },
};

export const getStorageData = async (itemName: string, key: string) => {
    try {
        const dataString = await reduxStorage.getItem(`persist:${itemName}`);
        if (dataString) {
            const data = JSON.parse(dataString);
            return data[key]?.replace(/"/g, '') || null;
        }
    } catch (err) {
        console.error('Error while getting storage data', err);
    }
    return null;
};

export const setStorageData = async (itemName: string, key: string, value: any) => {
    console.log('Setting storage data', itemName, key, value);
    try {
        const dataString = await reduxStorage.getItem(`persist:${itemName}`);
        const data = dataString ? JSON.parse(dataString) : {};
        data[key] = JSON.stringify(value);
        await reduxStorage.setItem(`persist:${itemName}`, JSON.stringify(data));
    } catch (err) {
        console.error('Error while setting storage data', err);
    }
};

export const deleteStorageData = async (itemName: string, key: string) => {
    console.log('Deleting storage data', itemName, key);
    try {
        const dataString = await reduxStorage.getItem(`persist:${itemName}`);
        if (dataString) {
            const data = JSON.parse(dataString);
            delete data[key];
            await reduxStorage.setItem(`persist:${itemName}`, JSON.stringify(data));
        }
    } catch (err) {
        console.error('Error while deleting storage data', err);
    }
};

export const clearUserData = async () => {
    await setStorageData('auth', 'user', null);
    await setStorageData('auth', 'accessToken', null);
};
