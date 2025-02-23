import * as React from 'react';
import { Platform } from 'react-native';
import {
    deleteStorageData,
    getStorageData,
    reduxStorage,
    setStorageData,
    storage,
} from '@/services/helper/storage.helper';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
    return React.useReducer(
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [
            false,
            action,
        ],
        initialValue
    ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
    if (value == null) {
        await deleteStorageData('session', key);
    } else {
        await setStorageData('session', key, value);
    }
}

export function useStorageState(key: string): UseStateHook<string> {
    // Public
    const [state, setState] = useAsyncState<string>();

    // Get
    React.useEffect(() => {
        const fetchData = async () => {
            const value = await getStorageData('session', key);
            console.log(value);
            setState(value ?? null);
        };
        fetchData();
    }, [key]);

    // Set
    const setValue = React.useCallback(
        (value: string | null) => {
            setState(value);
            setStorageItemAsync(key, value);
        },
        [key]
    );

    return [state, setValue];
}
