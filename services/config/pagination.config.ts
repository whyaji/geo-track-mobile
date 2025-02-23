import type { Data, DefaultResponseType } from '@/interface/response';

type QueryType = {
    length?: string;
    start?: string;
    [key: string]: any | undefined;
};

export const paginationConfig = <T>() => {
    return {
        ...forceRefetchConfig(),
        ...paginationSerializeIdConfig(),
        ...paginationMergeConfig<T>(),
    };
};

export const paginationSerializeIdConfig = () => {
    return {
        serializeQueryArgs: ({
            endpointName,
            queryArgs,
        }: {
            endpointName: string;
            queryArgs: QueryType;
        }) => {
            return `${endpointName}-${JSON.stringify({
                ...queryArgs,
                start: undefined,
                length: undefined,
            } as QueryType)}`;
        },
    };
};

export const forceRefetchConfig = () => {
    return {
        forceRefetch({
            currentArg,
            previousArg,
        }: {
            currentArg: QueryType | undefined;
            previousArg: QueryType | undefined;
        }) {
            return currentArg !== previousArg;
        },
    };
};

export const paginationMergeConfig = <T>() => {
    return {
        merge: (
            currentCacheData: DefaultResponseType<Data<T[]>>,
            responseData: DefaultResponseType<Data<T[]>>,
            { arg }: { arg: QueryType }
        ) => {
            if (arg.start === '0') {
                currentCacheData.data = responseData.data;
            } else if (
                arg.start !== '0' &&
                currentCacheData.data.recordsFiltered ===
                    Number(arg.start) + responseData.data.recordsFiltered
            ) {
                currentCacheData.data.recordsFiltered = -1;
            } else if (
                responseData.data.recordsTotal >=
                currentCacheData.data.recordsFiltered + responseData.data.recordsFiltered
            ) {
                currentCacheData.data.recordData.push(...responseData.data.recordData);
                currentCacheData.data.recordsFiltered =
                    currentCacheData.data.recordsFiltered + responseData.data.recordsFiltered;
            }
        },
    };
};
