import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import { OrderNote } from '../../data/mockData';
import courierOrdersService, { CourierOrder } from '../../services/courierOrders';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [order, setOrder] = useState<CourierOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [emptyBottles, setEmptyBottles] = useState(0);
    const [orderStatus, setOrderStatus] = useState<string>('waiting');
    const [notes, setNotes] = useState<OrderNote[]>([]);

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                const data = await courierOrdersService.getById(Number(id));
                setOrder(data);
                setEmptyBottles(data.empty_bottles_collected ?? 0);
                setOrderStatus(data.status);
            } catch (e) {
                console.warn('[OrderDetail] Failed to load order:', e);
                Alert.alert('Ошибка', 'Не удалось загрузить заказ');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleStatusChange = async (newStatus: OrderStatus) => {
        setOrderStatus(newStatus);
        if (!id) return;
        try {
            await courierOrdersService.updateStatus(Number(id), newStatus);
        } catch (e) {
            console.warn('[OrderDetail] Failed to update status:', e);
        }
    };

    const handleAddNote = async (text: string) => {
        const newNote: OrderNote = {
            id: Date.now().toString(),
            author: 'Курьер',
            role: 'Курьер',
            date: new Date().toLocaleString('ru-RU', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            }),
            text,
        };
        setNotes(prev => [...prev, newNote]);
        setShowNoteModal(false);
        if (id) {
            try {
                await courierOrdersService.addNote(Number(id), text);
            } catch (e) {
                console.warn('[OrderDetail] Failed to save note:', e);
            }
        }
    };

    const handleSave = async () => {
        if (!id) return;
        setSaving(true);
        try {
            await courierOrdersService.updateStatus(Number(id), orderStatus);
            router.back();
        } catch (e) {
            console.warn('[OrderDetail] Failed to save:', e);
            Alert.alert('Ошибка', 'Не удалось сохранить изменения');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Загрузка...</Text>
                    <View style={{ width: 32 }} />
                </View>
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Заказ не найден</Text>
                    <View style={{ width: 32 }} />
                </View>
            </SafeAreaView>
        );
    }

    const allNotes = [...notes];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Заказ №{order.id}</Text>
                <TouchableOpacity
                    onPress={() => setShowNoteModal(true)}
                    style={styles.noteButton}
                >
                    <Ionicons name="create-outline" size={22} color={Colors.primary} />
                    {allNotes.length > 0 && (
                        <View style={styles.noteBadge}>
                            <Text style={styles.noteBadgeText}>{allNotes.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Section: General Info */}
                <Text style={styles.sectionTitle}>Общая информация</Text>

                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{order.client_phone}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>{order.client_name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>
                        {[order.city_name, order.district_name, order.address_line]
                            .filter(Boolean).join(', ')}
                    </Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Section: Order Details */}
                <Text style={styles.sectionTitle}>Детали заказа</Text>

                {order.items.map((item, index) => (
                    <View key={item.id} style={styles.productItem}>
                        <View style={styles.productHeader}>
                            <Text style={styles.productLabel}>
                                Товар{order.items.length > 1 ? ` ${index + 1}` : ''}:
                            </Text>
                            <View style={styles.productDropdown}>
                                <Text style={styles.productName}>{item.service_name}</Text>
                            </View>
                        </View>
                        <QuantitySelector
                            label="Количество:"
                            value={item.quantity}
                            onChange={() => { }}
                        />
                    </View>
                ))}

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

                <View style={styles.paymentRow}>
                    <View style={styles.checkboxRow}>
                        <View style={[styles.checkbox, order.payment_cash > 0 && styles.checkboxActive]}>
                            {order.payment_cash > 0 && (
                                <Ionicons name="checkmark" size={14} color={Colors.white} />
                            )}
                        </View>
                        <Text style={styles.paymentLabel}>Наличные:</Text>
                    </View>
                    <Text style={styles.paymentAmount}>{order.payment_cash}</Text>
                    <Text style={styles.paymentCurrency}>TMT</Text>
                </View>
                <View style={styles.paymentRow}>
                    <View style={styles.checkboxRow}>
                        <View style={[styles.checkbox, order.payment_card > 0 && styles.checkboxActive]}>
                            {order.payment_card > 0 && (
                                <Ionicons name="checkmark" size={14} color={Colors.white} />
                            )}
                        </View>
                        <Text style={styles.paymentLabel}>Карта:</Text>
                    </View>
                    <Text style={styles.paymentAmount}>{order.payment_card}</Text>
                    <Text style={styles.paymentCurrency}>TMT</Text>
                </View>

                <View style={styles.paymentRow}>
                    <View style={styles.checkboxRow}>
                        <View style={[styles.checkbox, (order.payment_credit ?? 0) > 0 && styles.checkboxActive]}>
                            {(order.payment_credit ?? 0) > 0 && (
                                <Ionicons name="checkmark" size={14} color={Colors.white} />
                            )}
                        </View>
                        <Text style={styles.paymentLabel}>Кредит (Оплата воды):</Text>
                    </View>
                    <Text style={styles.paymentAmount}>{order.payment_credit ?? 0}</Text>
                    <Text style={styles.paymentCurrency}>TMT</Text>
                </View>

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Итого:</Text>
                    <Text style={styles.totalAmount}>{order.total} TMT</Text>
                </View>

                {/* Note */}
                {order.note ? (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.sectionTitle}>Заметка</Text>
                        <Text style={styles.noteText}>{order.note}</Text>
                    </>
                ) : null}

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
                        onStatusChange={handleStatusChange}
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
                notes={allNotes}
                onSave={handleAddNote}
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
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        marginTop: 4,
    },
    addProductText: {
        ...Typography.button,
        color: Colors.primary,
        marginLeft: 8,
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
    noteText: {
        ...Typography.bodyM,
        color: Colors.textSecondary,
        fontStyle: 'italic',
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
