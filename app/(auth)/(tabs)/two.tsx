import { useSession } from '@/context/auth-context/auth.context';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function TabTwoScreen() {
    const { signOut, session } = useSession();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab Two</Text>
            <View style={styles.separator} />
            <Text>Open up app/(auth)/(tabs)/two.tsx to start working on your app!</Text>
            <View style={styles.separator} />
            <Button
                mode="contained"
                onPress={() => {
                    // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                    signOut();
                }}>
                Sign Out
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
