import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { WarehouseAction } from '../data/mockData';

interface WarehouseActionCardProps {
    action: WarehouseAction;
    onPress?: () => void;
}

export default function WarehouseActionCard({ action, onPress }: WarehouseActionCardProps) {
    const isReceived = action.status === 'received';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            style={styles.card}
        >
            {/* Header row */}
            <View style={styles.headerRow}>
                <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.timeText}>{action.time}</Text>
                </View>
                <Text style={[styles.statusText, { color: isReceived ? Colors.success : Colors.orangePromo }]}>
                    {isReceived ? 'Принято' : 'Передано'}
                </Text>
            </View>

            {/* Person */}
            <View style={styles.row}>
                <Ionicons name="person-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.personLabel}>
                    {isReceived ? 'От кого' : 'Кому'}
                </Text>
                <Text style={styles.personName}>{action.person}</Text>
            </View>

            {/* Items */}
            {action.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                    <View style={styles.row}>
                        <Ionicons name="water-outline" size={14} color={Colors.textSecondary} />
                        <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>
            ))}

            {/* Extra badge if more than 2 items */}
            {action.items.length > 2 && (
                <View style={styles.extraBadge}>
                    <Text style={styles.extraBadgeText}>+{action.items.length - 2}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        ...Typography.bodyS,
        color: Colors.primary,
        fontWeight: '500',
        marginLeft: 6,
    },
    statusText: {
        ...Typography.label,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    personLabel: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
        marginLeft: 6,
    },
    personName: {
        ...Typography.bodyS,
        color: Colors.textPrimary,
        fontWeight: '500',
        marginLeft: 'auto' as any,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemText: {
        ...Typography.bodyS,
        color: Colors.textPrimary,
        marginLeft: 6,
    },
    quantityText: {
        ...Typography.bodyS,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    extraBadge: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    extraBadgeText: {
        ...Typography.micro,
        color: Colors.primary,
        fontWeight: '600',
    },
});
