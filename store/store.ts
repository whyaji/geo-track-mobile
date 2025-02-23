import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import persistStore from 'redux-persist/es/persistStore';
import { persistedReducer } from './reducers/rootReducer';
import { middlewares } from '@/services/middleware/api.middleware';

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }).concat(...middlewares),
});

setupListeners(store.dispatch);

const persistor = persistStore(store);

export { store, persistor };

export type AppDispatch = typeof store.dispatch;
