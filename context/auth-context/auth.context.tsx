import React from 'react';
import { useStorageState } from './auth-context.hook';

const AuthContext = React.createContext<{
    signIn: () => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider(props: React.PropsWithChildren<Readonly<{}>>) {
    const [[isLoading, session], setSession] = useStorageState('token');
    const contextValue = React.useMemo(
        () => ({
            signIn: () => {
                // Add your login logic here
                // For example purposes, we'll just set a fake session in storage
                //This likely would be a JWT token or other session data
                setSession('Token');
            },
            signOut: () => {
                setSession(null);
            },
            session,
            isLoading,
        }),
        [session, isLoading]
    );

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
}
