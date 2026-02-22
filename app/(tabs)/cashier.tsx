import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EmptyState from '../../components/EmptyState';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { useAuth } from '../../contexts/AuthContext';
import { cashierEntries, cashierStats } from '../../data/mockData';

export default function CashierScreen() {
    const { username } = useAuth();
    const [filter, setFilter] = useState('Все');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
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
                    <Text style={styles.userName}>{username || 'Пользователь'}</Text>
                    <Text style={styles.dateText}>{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                </View>

                {/* Cashier summary card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Ionicons name="wallet-outline" size={20} color={Colors.textWhite} />
                        <Text style={styles.summaryTitle}>В кассе:</Text>
                        <Text style={styles.summaryTotal}>{cashierStats.total} TMT</Text>
                    </View>
                    <View style={styles.summaryDetails}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Нал.:</Text>
                            <Text style={styles.summaryValue}>{cashierStats.cash} TMT</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Карта :</Text>
                            <Text style={styles.summaryValue}>{cashierStats.card} TMT</Text>
                        </View>
                    </View>
                </View>

                {/* Filter row */}
                <View style={styles.filterRow}>
                    <Text style={styles.historyTitle}>История</Text>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterLabel}>Оплата:</Text>
                        <Text style={styles.filterValue}>{filter}</Text>
                        <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Cashier entries */}
                {cashierEntries.length > 0 ? (
                    cashierEntries.map((entry) => (
                        <View key={entry.id} style={styles.entryCard}>
                            {/* Time */}
                            <View style={styles.timeRow}>
                                <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                                <Text style={styles.timeText}>{entry.timeSlot}</Text>
                            </View>

                            {/* Address */}
                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                                <Text style={styles.infoText}>{entry.address}</Text>
                            </View>

                            {/* Products */}
                            {entry.products.map((product) => (
                                <View key={product.id} style={styles.productRow}>
                                    <View style={[styles.infoRow, { flex: 1, marginRight: 8 }]}>
                                        <Ionicons name="water-outline" size={14} color={Colors.textSecondary} />
                                        <Text style={styles.infoText} numberOfLines={1}>
                                            {product.name} ({product.quantity}шт)
                                        </Text>
                                    </View>
                                    <Text style={styles.priceText}>{product.price} TMT</Text>
                                </View>
                            ))}

                            {/* Extra items badge */}
                            {entry.products.length > 1 && (
                                <View style={styles.extraBadge}>
                                    <Text style={styles.extraBadgeText}>+{entry.products.length - 1}</Text>
                                </View>
                            )}

                            {/* Payment tags */}
                            <View style={styles.paymentRow}>
                                <Text style={styles.paymentLabel}>Оплата:</Text>
                                {entry.paymentTypes.map((type, i) => (
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
                                                            : type === 'кредит'
                                                                ? Colors.warningLight
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
                                                                : type === 'кредит'
                                                                    ? Colors.warning
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
                    ))
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
