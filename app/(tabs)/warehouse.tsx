import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import WarehouseActionCard from '../../components/WarehouseActionCard';
import WarehouseDetailModal from '../../components/WarehouseDetailModal';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { useAuth } from '../../contexts/AuthContext';
import { WarehouseAction } from '../../data/mockData';
import courierStocksService from '../../services/courierStocks';
import courierTransactionsService, { CourierTransaction } from '../../services/courierTransactions';

/** Map a backend CourierTransaction to the WarehouseAction shape the UI components expect */
function txToAction(tx: CourierTransaction): WarehouseAction {
    return {
        id: String(tx.id),
        time: new Date(tx.created_at).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        }),
        status: tx.operation_type === 'inventory_in' ? 'received' : 'transferred',
        person: tx.from_location_name ?? '—',
        items: [
            {
                name: [tx.product_name, tx.brand_name].filter(Boolean).join(' ') +
                    (tx.product_state_name ? ` (${tx.product_state_name})` : ''),
                type: tx.product_state_name ?? '',
                quantity: tx.quantity,
            },
        ],
        notes: tx.note ?? undefined,
    };
}

/** Today's date in YYYY-MM-DD format */
function todayStr(): string {
    return new Date().toISOString().split('T')[0];
}

export default function WarehouseScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedAction, setSelectedAction] = useState<WarehouseAction | null>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const insets = useSafeAreaInsets();

    // Real data from courier-specific API
    const [actions, setActions] = useState<WarehouseAction[]>([]);
    const [stockFull, setStockFull] = useState(0);
    const [stockEmpty, setStockEmpty] = useState(0);

    const loadData = useCallback(async () => {
        try {
            const [txList, stocksData] = await Promise.all([
                // Courier transactions for today
                courierTransactionsService.getByDate(todayStr()),
                // Courier-specific stocks (only this courier's car)
                courierStocksService.getMyStocks(),
            ]);

            setActions(txList.map(txToAction));

            let full = 0;
            let empty = 0;
            for (const s of stocksData) {
                const stateLower = (s.product_state_name ?? '').toLowerCase();
                if (stateLower.includes('полн') || stateLower.includes('full')) {
                    full += s.quantity;
                } else {
                    empty += s.quantity;
                }
            }
            setStockFull(full);
            setStockEmpty(empty);
        } catch (e) {
            console.warn('[Warehouse] Failed to load data:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
    }, [loadData]);

    const handleNewAction = () => router.push('/warehouse/new-action');

    const handleActionPress = (action: WarehouseAction) => {
        setSelectedAction(action);
        setDetailVisible(true);
    };

    const totalInCar = stockFull + stockEmpty;

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
                    <Text style={styles.dateText}>
                        {new Date().toLocaleDateString('ru-RU', {
                            day: 'numeric', month: 'long', year: 'numeric',
                        })}
                    </Text>
                </View>

                {/* Tary in car card */}
                <View style={styles.taryCard}>
                    {/* Decorative circles — matches StatCard */}
                    <View style={styles.bgCircles}>
                        <View style={styles.bgCircle1} />
                        <View style={styles.bgCircle2} />
                    </View>
                    <View style={styles.taryHeader}>
                        <Ionicons name="car-outline" size={20} color={Colors.textWhite} />
                        <Text style={styles.taryTitle}>Тары в машине:</Text>
                        <Text style={styles.taryTotal}>{totalInCar}</Text>
                    </View>
                    <View style={styles.taryDetails}>
                        <View style={styles.taryItem}>
                            <Text style={styles.taryLabel}>Полные:</Text>
                            <Text style={styles.taryValue}>{stockFull}</Text>
                        </View>
                        <View style={styles.taryItem}>
                            <Text style={styles.taryLabel}>Пустые:</Text>
                            <Text style={styles.taryValue}>{stockEmpty}</Text>
                        </View>
                    </View>
                </View>

                {/* New action button */}
                <View style={styles.newActionContainer}>
                    <Button
                        title="Новое действие"
                        onPress={handleNewAction}
                        variant="primary"
                        size="medium"
                        icon={<Ionicons name="add" size={18} color={Colors.textWhite} />}
                    />
                </View>

                {/* Action history */}
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 32 }} />
                ) : actions.length > 0 ? (
                    actions.map((action) => (
                        <WarehouseActionCard
                            key={action.id}
                            action={action}
                            onPress={() => handleActionPress(action)}
                        />
                    ))
                ) : (
                    <EmptyState
                        icon="cube-outline"
                        title="Нет действий сегодня"
                        subtitle="Добавьте первое действие нажав кнопку выше"
                    />
                )}

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* Detail modal */}
            <WarehouseDetailModal
                visible={detailVisible}
                onClose={() => setDetailVisible(false)}
                action={selectedAction}
            />
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
    taryCard: {
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
    taryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    taryTitle: {
        ...Typography.h5,
        color: Colors.textWhite,
        marginLeft: 8,
        flex: 1,
    },
    taryTotal: {
        ...Typography.h2,
        color: Colors.textWhite,
    },
    taryDetails: {
        flexDirection: 'row',
        gap: 8,
    },
    taryItem: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
    },
    taryLabel: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    taryValue: {
        ...Typography.h3,
        color: Colors.textWhite,
    },
    newActionContainer: {
        marginBottom: 16,
    },
});
