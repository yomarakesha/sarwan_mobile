import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface StatCardProps {
    title: string;
    current: number;
    total: number;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
}

export default function StatCard({ title, current, total, icon, onPress }: StatCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={onPress ? 0.8 : 1}
            style={styles.card}
        >
            <View style={styles.bgCircles}>
                <View style={styles.bgCircle1} />
                <View style={styles.bgCircle2} />
            </View>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={18} color={Colors.textWhite} style={styles.icon} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>
                {current}/{total}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        overflow: 'hidden',
    },
    bgCircles: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    bgCircle1: {
        position: 'absolute',
        right: -20,
        top: -10,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 20,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    bgCircle2: {
        position: 'absolute',
        right: -40,
        top: 10,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 20,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    icon: {
        opacity: 0.9,
    },
    title: {
        ...Typography.bodyS,
        color: Colors.textWhite,
        marginBottom: 4,
        fontWeight: '500',
    },
    value: {
        ...Typography.h2,
        color: Colors.textWhite,
    },
});
