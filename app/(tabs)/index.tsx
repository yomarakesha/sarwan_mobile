import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
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
import { orders, ordersStats } from '../../data/mockData';

export default function OrdersScreen() {
  const router = useRouter();
  const { username } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAddOrder = () => {
    router.push('/order/add-order');
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

        {/* Stats cards */}
        <View style={styles.statsRow}>
          <StatCard
            title="Заказы"
            current={ordersStats.completedOrders}
            total={ordersStats.totalOrders}
            icon="time-outline"
          />
          <StatCard
            title="Тары"
            current={ordersStats.collectedTary}
            total={ordersStats.totalTary}
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
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
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
