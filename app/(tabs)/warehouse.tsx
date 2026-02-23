import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
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
import { WarehouseAction, warehouseActions, warehouseStats } from '../../data/mockData';

export default function WarehouseScreen() {
    const router = useRouter();
    const { username } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedAction, setSelectedAction] = useState<WarehouseAction | null>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const insets = useSafeAreaInsets();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const handleNewAction = () => {
        router.push('/warehouse/new-action');
    };

    const handleActionPress = (action: WarehouseAction) => {
        setSelectedAction(action);
        setDetailVisible(true);
    };

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
                    <Text style={styles.userName}>{username || 'Пользователь'}</Text>
                    <Text style={styles.dateText}>{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                </View>

                {/* Tary in car card */}
                <View style={styles.taryCard}>
                    <View style={styles.taryHeader}>
                        <Ionicons name="car-outline" size={20} color={Colors.textWhite} />
                        <Text style={styles.taryTitle}>Тары в машине:</Text>
                        <Text style={styles.taryTotal}>{warehouseStats.totalTaryInCar}</Text>
                    </View>
                    <View style={styles.taryDetails}>
                        <View style={styles.taryItem}>
                            <Text style={styles.taryLabel}>Полные:</Text>
                            <Text style={styles.taryValue}>{warehouseStats.full}</Text>
                        </View>
                        <View style={styles.taryItem}>
                            <Text style={styles.taryLabel}>Пустые:</Text>
                            <Text style={styles.taryValue}>{warehouseStats.empty}</Text>
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
                {warehouseActions.length > 0 ? (
                    warehouseActions.map((action) => (
                        <WarehouseActionCard
                            key={action.id}
                            action={action}
                            onPress={() => handleActionPress(action)}
                        />
                    ))
                ) : (
                    <EmptyState
                        icon="cube-outline"
                        title="Нет действий"
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
