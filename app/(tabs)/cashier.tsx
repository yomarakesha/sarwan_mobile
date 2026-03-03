import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { useAuth } from '../../contexts/AuthContext';
import courierOrdersService, { CourierOrder, todayStr } from '../../services/courierOrders';

const PAYMENT_FILTERS = ['Все', 'Наличные', 'Карта', 'Смешанная'];

function getPaymentTypes(order: CourierOrder): string[] {
    const types: string[] = [];
    if (order.payment_cash > 0) types.push('наличные');
    if (order.payment_card > 0) types.push('карта');
    if (types.length === 0) types.push('бесплатно');
    return types;
}

export default function CashierScreen() {
    const { user } = useAuth();
    const [filter, setFilter] = useState('Все');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<CourierOrder[]>([]);
    const insets = useSafeAreaInsets();

    const loadOrders = useCallback(async () => {
        try {
            const data = await courierOrdersService.getByDate(todayStr());
            // Show only delivered orders in cashier view
            setOrders(data.filter(o => o.status === 'delivered' || o.payment_cash > 0 || o.payment_card > 0));
        } catch (e) {
            console.warn('[Cashier] Failed to load orders:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { loadOrders(); }, [loadOrders]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadOrders();
    }, [loadOrders]);

    // Compute cashier stats from real orders
    const totalCash = orders.reduce((sum, o) => sum + (o.payment_cash ?? 0), 0);
    const totalCard = orders.reduce((sum, o) => sum + (o.payment_card ?? 0), 0);
    const totalAmount = totalCash + totalCard;

    // Apply filter
    const filteredOrders = orders.filter(o => {
        if (filter === 'Все') return true;
        if (filter === 'Наличные') return o.payment_cash > 0 && o.payment_card === 0;
        if (filter === 'Карта') return o.payment_card > 0 && o.payment_cash === 0;
        if (filter === 'Смешанная') return o.payment_cash > 0 && o.payment_card > 0;
        return true;
    });

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                        tintColor={Colors.primary}
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.userName}>{user?.full_name || user?.username || 'Пользователь'}</Text>
                    <Text style={styles.dateText}>{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                </View>

                {/* Cashier summary card */}
                <View style={styles.summaryCard}>
                    {/* Decorative circles — matches StatCard */}
                    <View style={styles.bgCircles}>
                        <View style={styles.bgCircle1} />
                        <View style={styles.bgCircle2} />
                    </View>
                    <View style={styles.summaryHeader}>
                        <Ionicons name="wallet-outline" size={20} color={Colors.textWhite} />
                        <Text style={styles.summaryTitle}>В кассе:</Text>
                        <Text style={styles.summaryTotal}>{totalAmount} TMT</Text>
                    </View>
                    <View style={styles.summaryDetails}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Нал.:</Text>
                            <Text style={styles.summaryValue}>{totalCash} TMT</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Карта :</Text>
                            <Text style={styles.summaryValue}>{totalCard} TMT</Text>
                        </View>
                    </View>
                </View>

                {/* Filter row */}
                <View style={styles.filterRow}>
                    <Text style={styles.historyTitle}>История</Text>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => {
                            const idx = PAYMENT_FILTERS.indexOf(filter);
                            setFilter(PAYMENT_FILTERS[(idx + 1) % PAYMENT_FILTERS.length]);
                        }}
                    >
                        <Text style={styles.filterLabel}>Оплата:</Text>
                        <Text style={styles.filterValue}>{filter}</Text>
                        <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Cashier entries */}
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 32 }} />
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                        const payTypes = getPaymentTypes(order);
                        const time = new Date(order.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                        return (
                            <View key={order.id} style={styles.entryCard}>
                                {/* Time */}
                                <View style={styles.timeRow}>
                                    <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                                    <Text style={styles.timeText}>{time}</Text>
                                </View>

                                {/* Address */}
                                <View style={styles.infoRow}>
                                    <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                                    <Text style={styles.infoText}>{order.address_line || '—'}</Text>
                                </View>

                                {/* Client */}
                                <View style={styles.infoRow}>
                                    <Ionicons name="person-outline" size={14} color={Colors.textSecondary} />
                                    <Text style={styles.infoText}>{order.client_name}</Text>
                                </View>

                                {/* Products */}
                                {order.items.map((item) => (
                                    <View key={item.id} style={styles.productRow}>
                                        <View style={[styles.infoRow, { flex: 1, marginRight: 8 }]}>
                                            <Ionicons name="water-outline" size={14} color={Colors.textSecondary} />
                                            <Text style={styles.infoText} numberOfLines={1}>
                                                {item.service_name} ({item.quantity}шт)
                                            </Text>
                                        </View>
                                        <Text style={styles.priceText}>{item.price * item.quantity} TMT</Text>
                                    </View>
                                ))}

                                {/* Payment tags */}
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>Оплата:</Text>
                                    {payTypes.map((type, i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.paymentTag,
                                                {
                                                    backgroundColor:
                                                        type === 'наличные'
                                                            ? Colors.infoBlueLight
                                                            : type === 'карта'
                                                                ? Colors.successLight
                                                                : Colors.primaryLight,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.paymentTagText,
                                                    {
                                                        color:
                                                            type === 'наличные'
                                                                ? Colors.infoBlue
                                                                : type === 'карта'
                                                                    ? Colors.success
                                                                    : Colors.primary,
                                                    },
                                                ]}
                                            >
                                                {type}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <EmptyState
                        icon="cash-outline"
                        title="Нет записей"
                        subtitle="История оплат появится здесь"
                    />
                )}

                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        marginBottom: 16,
    },
    userName: {
        ...Typography.h4,
        color: Colors.textPrimary,
    },
    dateText: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
    },
    summaryCard: {
        backgroundColor: Colors.primary,
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
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
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 22,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    bgCircle2: {
        position: 'absolute',
        right: -40,
        top: 15,
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 22,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryTitle: {
        ...Typography.h5,
        color: Colors.textWhite,
        marginLeft: 8,
        flex: 1,
    },
    summaryTotal: {
        ...Typography.h2,
        color: Colors.textWhite,
    },
    summaryDetails: {
        flexDirection: 'row',
        gap: 8,
    },
    summaryItem: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
    },
    summaryLabel: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    summaryValue: {
        ...Typography.h4,
        color: Colors.textWhite,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    historyTitle: {
        ...Typography.h5,
        color: Colors.textPrimary,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    filterLabel: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
    },
    filterValue: {
        ...Typography.bodyS,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    entryCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
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
    infoRow: {
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
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    paymentLabel: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
    },
    paymentTag: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 6,
    },
    paymentTagText: {
        ...Typography.tag,
        fontWeight: '600',
    },
});
