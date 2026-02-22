import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../../components/Button';
import NoteModal from '../../components/NoteModal';
import QuantitySelector from '../../components/QuantitySelector';
import StatusDropdown, { OrderStatus } from '../../components/StatusDropdown';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { orders } from '../../data/mockData';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const order = orders.find((o) => o.id === id) || orders[0];

    const [showNoteModal, setShowNoteModal] = useState(false);
    const [emptyBottles, setEmptyBottles] = useState(order.emptyBottlesCollected);
    const [orderStatus, setOrderStatus] = useState<string>(order.status);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Заказ №{order.orderNumber}</Text>
                <TouchableOpacity
                    onPress={() => setShowNoteModal(true)}
                    style={styles.noteButton}
                >
                    <Ionicons name="create-outline" size={22} color={Colors.primary} />
                    {order.notes.length > 0 && (
                        <View style={styles.noteBadge}>
                            <Text style={styles.noteBadgeText}>{order.notes.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Section: General Info */}
                <Text style={styles.sectionTitle}>Общая информация</Text>

                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{order.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{order.customerName}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{order.address}{'\n'}{order.apartment}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="layers-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{order.floor}</Text>
                </View>

                {/* Promo badge */}
                {order.promoText && (
                    <View style={styles.promoCard}>
                        <Ionicons name="pricetag-outline" size={16} color={Colors.success} />
                        <View style={styles.promoInfo}>
                            <Text style={styles.promoText}>{order.promoText}</Text>
                            {order.promoProgress && (
                                <Text style={styles.promoProgress}>Осталось: {order.promoProgress}</Text>
                            )}
                        </View>
                    </View>
                )}

                {/* Divider */}
                <View style={styles.divider} />

                {/* Section: Order Details */}
                <Text style={styles.sectionTitle}>Детали заказа</Text>

                {order.products.map((product, index) => (
                    <View key={product.id} style={styles.productItem}>
                        <View style={styles.productHeader}>
                            <Text style={styles.productLabel}>Товар{order.products.length > 1 ? ` ${index + 1}` : ''}:</Text>
                            <View style={styles.productDropdown}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                            </View>
                        </View>
                        <QuantitySelector
                            label="Количество:"
                            value={product.quantity}
                            onChange={() => { }}
                        />
                    </View>
                ))}

                {/* Add product button */}
                <TouchableOpacity style={styles.addProductButton}>
                    <Ionicons name="add" size={18} color={Colors.success} />
                    <Text style={styles.addProductText}>Добавить товар</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Section: Empty bottles */}
                <Text style={styles.sectionTitle}>Пустые тары</Text>
                <QuantitySelector
                    label="Забрано:"
                    value={emptyBottles}
                    onChange={setEmptyBottles}
                />

                {/* Divider */}
                <View style={styles.divider} />

                {/* Section: Payment */}
                <Text style={styles.sectionTitle}>Оплата</Text>

                {order.paymentType === 'free' ? (
                    <Text style={styles.freeText}>Бесплатно</Text>
                ) : order.paymentType === 'credit_no_pay' ? (
                    <Text style={styles.creditText}>Кредит (Без оплаты)</Text>
                ) : (
                    <>
                        <View style={styles.paymentRow}>
                            <View style={styles.checkboxRow}>
                                <View style={[styles.checkbox, order.paymentCash > 0 && styles.checkboxActive]}>
                                    {order.paymentCash > 0 && (
                                        <Ionicons name="checkmark" size={14} color={Colors.white} />
                                    )}
                                </View>
                                <Text style={styles.paymentLabel}>Наличные:</Text>
                            </View>
                            <Text style={styles.paymentAmount}>{order.paymentCash}</Text>
                            <Text style={styles.paymentCurrency}>TMT</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <View style={styles.checkboxRow}>
                                <View style={[styles.checkbox, order.paymentCard > 0 && styles.checkboxActive]}>
                                    {order.paymentCard > 0 && (
                                        <Ionicons name="checkmark" size={14} color={Colors.white} />
                                    )}
                                </View>
                                <Text style={styles.paymentLabel}>Карта:</Text>
                            </View>
                            <Text style={styles.paymentAmount}>{order.paymentCard}</Text>
                            <Text style={styles.paymentCurrency}>TMT</Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Итого:</Text>
                            <Text style={styles.totalAmount}>{order.total} TMT</Text>
                        </View>
                    </>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom action bar */}
            <View style={styles.bottomBar}>
                {(orderStatus === 'delivered' || orderStatus === 'Доставлено') ? (
                    <TouchableOpacity style={styles.deliveredButton} activeOpacity={0.8}>
                        <Text style={styles.deliveredText}>Доставлено</Text>
                    </TouchableOpacity>
                ) : (
                    <StatusDropdown
                        currentStatus={orderStatus}
                        onStatusChange={(s: OrderStatus) => setOrderStatus(s)}
                    />
                )}
                <Button
                    title="Позвонить"
                    onPress={() => { }}
                    variant="primary"
                    size="medium"
                    fullWidth={false}
                    icon={<Ionicons name="call-outline" size={16} color={Colors.textWhite} />}
                    style={{ paddingHorizontal: 24 }}
                />
            </View>

            {/* Note Modal */}
            <NoteModal
                visible={showNoteModal}
                onClose={() => setShowNoteModal(false)}
                notes={order.notes}
                onSave={(text) => {
                    setShowNoteModal(false);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        ...Typography.h4,
        color: Colors.textPrimary,
        flex: 1,
        textAlign: 'center',
    },
    noteButton: {
        padding: 4,
        position: 'relative',
    },
    noteBadge: {
        position: 'absolute',
        top: -2,
        right: -4,
        backgroundColor: Colors.error,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noteBadgeText: {
        ...Typography.micro,
        color: Colors.white,
        fontSize: 10,
        fontWeight: '700',
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    sectionTitle: {
        ...Typography.h5,
        color: Colors.primary,
        marginBottom: 14,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    infoText: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        marginLeft: 10,
        flex: 1,
    },
    promoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.successLight,
        padding: 12,
        borderRadius: 10,
        marginTop: 8,
        marginBottom: 4,
    },
    promoInfo: {
        marginLeft: 10,
        flex: 1,
    },
    promoText: {
        ...Typography.bodyS,
        color: Colors.success,
        fontWeight: '600',
    },
    promoProgress: {
        ...Typography.caption,
        color: Colors.success,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: 20,
    },
    productItem: {
        marginBottom: 12,
    },
    productHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    productLabel: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
    },
    productDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flex: 1,
        marginLeft: 12,
    },
    productName: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        flex: 1,
    },
    addProductButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.success,
        borderRadius: 10,
        paddingVertical: 12,
        marginTop: 4,
        backgroundColor: Colors.successLight,
    },
    addProductText: {
        ...Typography.button,
        color: Colors.success,
        marginLeft: 6,
        fontWeight: '600',
    },
    freeText: {
        ...Typography.bodyM,
        color: Colors.success,
        fontWeight: '600',
    },
    creditText: {
        ...Typography.bodyM,
        color: Colors.warning,
        fontWeight: '600',
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkboxActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    paymentLabel: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
    },
    paymentAmount: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        fontWeight: '500',
        minWidth: 40,
        textAlign: 'right',
    },
    paymentCurrency: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
        marginLeft: 6,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    totalLabel: {
        ...Typography.h4,
        color: Colors.textPrimary,
    },
    totalAmount: {
        ...Typography.h3,
        color: Colors.textPrimary,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        backgroundColor: Colors.white,
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveredButton: {
        backgroundColor: Colors.success,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    deliveredText: {
        ...Typography.bodyS,
        color: Colors.textWhite,
        fontWeight: '600',
    },
});
