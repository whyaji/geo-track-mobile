import { consoleTransport, logger } from 'react-native-logs';

const log = logger.createLogger({
    enabled: !!__DEV__,
    severity: __DEV__ ? 'debug' : 'info',
    levels: {
        Info: 0,
        Navigation: 1,
        Fetch: 2,
        FetchError: 3,
        FetchSuccess: 4,
        ReduxAction: 5,
        Warning: 6,
        Error: 7,
    },
    dateFormat: 'time',
    transport: consoleTransport,
    transportOptions: {
        colors: {
            Info: 'yellow',
            Navigation: 'blue',
            Fetch: 'cyan',
            FetchError: 'red',
            FetchSuccess: 'blueBright',
            ReduxAction: 'magenta',
            Warning: 'yellowBright',
            Error: 'redBright',
        },
    },
    async: true,
    printLevel: true,
    printDate: true,
});

export default log;
