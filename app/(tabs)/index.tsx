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
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import OrderCard from '../../components/OrderCard';
import StatCard from '../../components/StatCard';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { useAuth } from '../../contexts/AuthContext';
import courierOrdersService, { CourierOrder, todayStr } from '../../services/courierOrders';

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<CourierOrder[]>([]);
  const insets = useSafeAreaInsets();

  const loadOrders = useCallback(async () => {
    try {
      const data = await courierOrdersService.getByDate(todayStr());
      setOrders(data);
    } catch (e) {
      console.warn('[Orders] Failed to load orders:', e);
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

  const handleAddOrder = () => {
    router.push('/order/add-order');
  };

  // Compute stats from real data
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const totalOrders = orders.length;
  const totalEmptyBottles = orders.reduce((sum, o) => sum + (o.empty_bottles_collected ?? 0), 0);

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

        {/* Stats cards */}
        <View style={styles.statsRow}>
          <StatCard
            title="Заказы"
            current={completedOrders}
            total={totalOrders}
            icon="time-outline"
          />
          <StatCard
            title="Пустые тары"
            current={totalEmptyBottles}
            total={totalEmptyBottles}
            icon="water-outline"
          />
        </View>

        {/* Add order button */}
        <View style={styles.addOrderContainer}>
          <Button
            title="Добавить заказ"
            onPress={handleAddOrder}
            variant="primary"
            size="medium"
            icon={<Ionicons name="add" size={18} color={Colors.textWhite} />}
          />
        </View>

        {/* Order list */}
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 32 }} />
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={String(order.id)} order={order} />
          ))
        ) : (
          <EmptyState
            icon="document-text-outline"
            title="Нет заказов"
            subtitle="Добавьте первый заказ нажав кнопку выше"
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
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 16,
  },
  addOrderContainer: {
    marginBottom: 16,
  },
});
