import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import courierOrdersService, { CourierOrder } from '../services/courierOrders';
import Button from './Button';
import StatusDropdown, { OrderStatus } from './StatusDropdown';

interface OrderCardProps {
    order: CourierOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
    const router = useRouter();
    const [status, setStatus] = useState<string>(order.status);

    const handlePress = () => {
        router.push(`/order/${order.id}`);
    };

    const handleCall = () => {
        const phone = order.client_phone?.replace(/\s/g, '') ?? '';
        if (phone) Linking.openURL(`tel:${phone}`);
    };

    const handleStatusChange = async (newStatus: OrderStatus) => {
        setStatus(newStatus);
        try {
            await courierOrdersService.updateStatus(order.id, newStatus);
        } catch (e) {
            console.warn('[OrderCard] Failed to update status:', e);
        }
    };

    // Format time from ISO created_at
    const timeStr = order.created_at
        ? new Date(order.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        : '—';

    // Build address string
    const address = [order.city_name, order.district_name, order.address_line]
        .filter(Boolean).join(', ') || '—';

    // Determine if we should show the compact (filled) layout
    const isFilled = status === 'in_transit' || status === 'В пути' ||
        status === 'delivered' || status === 'Доставлено';

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.card}>
            {/* Time slot */}
            <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.timeText}>{timeStr}</Text>
                <Text style={styles.clientName}> · {order.client_name}</Text>
            </View>

            {/* Address */}
            <View style={styles.row}>
                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.infoText} numberOfLines={1}>{address}</Text>
            </View>

            {/* Items */}
            {order.items.slice(0, 2).map((item) => (
                <View key={item.id} style={styles.productRow}>
                    <View style={[styles.row, { flex: 1, marginRight: 8 }]}>
                        <Ionicons name="water-outline" size={14} color={Colors.textSecondary} />
                        <Text style={styles.infoText} numberOfLines={1}>
                            {item.service_name} ({item.quantity}шт)
                        </Text>
                    </View>
                    <Text style={styles.priceText}>{item.price * item.quantity} TMT</Text>
                </View>
            ))}

            {/* Extra items indicator */}
            {order.items.length > 2 && (
                <View style={styles.extraBadge}>
                    <Text style={styles.extraBadgeText}>+{order.items.length - 2}</Text>
                </View>
            )}

            {/* Bottom: Status dropdown + Call button */}
            <View style={styles.bottomRow}>
                {isFilled ? (
                    <>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <StatusDropdown
                                currentStatus={status}
                                onStatusChange={handleStatusChange}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleCall}
                            style={styles.callIconButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="call-outline" size={18} color={Colors.primary} />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <StatusDropdown
                            currentStatus={status}
                            onStatusChange={handleStatusChange}
                        />
                        <Button
                            title="Позвонить"
                            onPress={handleCall}
                            variant="primary"
                            size="small"
                            fullWidth={false}
                            icon={<Ionicons name="call-outline" size={14} color={Colors.textWhite} />}
                            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                        />
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    timeText: {
        ...Typography.bodyS,
        color: Colors.primary,
        fontWeight: '500',
        marginLeft: 6,
    },
    clientName: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        ...Typography.bodyS,
        color: Colors.textPrimary,
        marginLeft: 6,
        flex: 1,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    priceText: {
        ...Typography.bodyS,
        color: Colors.textPrimary,
        fontWeight: '500',
        flexShrink: 0,
    },
    extraBadge: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 4,
        marginBottom: 8,
    },
    extraBadgeText: {
        ...Typography.micro,
        color: Colors.primary,
        fontWeight: '600',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    callIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
