import { combineReducers, type UnknownAction } from 'redux';
import { persistReducer } from 'redux-persist';
import { rootApi } from '@/services/api/rootApi';
import { reduxStorage } from '@/services/helper/storage.helper';

const persistConfig = {
    key: 'root',
    storage: reduxStorage,
};

const reducers = {
    [rootApi.reducerPath]: rootApi.reducer,
};

const combinedReducers = combineReducers(reducers);

const rootReducer = (state: RootStateType | undefined, action: UnknownAction) => {
    if (action.type === 'LOGOUT') {
        state = undefined;
    }
    return combinedReducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootStateType = ReturnType<typeof combinedReducers>;
export { persistedReducer, rootReducer };
