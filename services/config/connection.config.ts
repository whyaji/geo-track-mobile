import NetInfo from '@react-native-community/netinfo';
import log from './logger.config';


interface IConnectionService {
    checkConnection: () => void;
    connectionInfoProvider: typeof NetInfo;
    subscribeToConnectionChanges: (callback: (isConnected: boolean) => void) => void;
}

export class ConnectionService implements IConnectionService {
    connectionInfoProvider = NetInfo;

    async checkConnection() {
        try {
            const connectionStatus = await this.connectionInfoProvider.fetch();
            return connectionStatus.isConnected;
        } catch (err) {
            log.Error('Error while checking connection status.', err);
        }
    }

    subscribeToConnectionChanges(callback: (isConnected: boolean) => void) {
        const unsubscribe = this.connectionInfoProvider.addEventListener((state) => {
            callback(state.isConnected ?? false);
        });

        return () => {
            unsubscribe();
        };
    }
}

export const checkConnection = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
        return state.isConnected ?? true;
    });
    return () => unsubscribe();
};
