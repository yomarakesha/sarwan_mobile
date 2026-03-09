import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import SelectModal from '../../components/SelectModal';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import courierTransactionsService from '../../services/courierTransactions';
import { couriersService } from '../../services/couriers';
import productStatesService from '../../services/productStates';
import productsService from '../../services/products';
import { Product, ProductState } from '../../types/models';

interface ProductEntry {
    id: string;
    /** product_id (real ID) */
    productId: number | null;
    productName: string;
    /** product_state_id (real ID) */
    stateId: number | null;
    stateName: string;
    quantity: number;
}

interface CourierOption {
    id: number;
    name: string;
}

export default function NewWarehouseActionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Meta loaded from backend
    const [couriers, setCouriers] = useState<CourierOption[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [productStates, setProductStates] = useState<ProductState[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [toCourierId, setToCourierId] = useState<number | null>(null);
    const [toCourierName, setToCourierName] = useState('');
    const [notes, setNotes] = useState('');

    // Modal visibility
    const [courierModalVisible, setCourierModalVisible] = useState(false);
    const [activeEntryForProduct, setActiveEntryForProduct] = useState<string | null>(null);
    const [activeEntryForState, setActiveEntryForState] = useState<string | null>(null);

    const [entries, setEntries] = useState<ProductEntry[]>([
        { id: '1', productId: null, productName: '', stateId: null, stateName: '', quantity: 1 },
    ]);

    const [actionStatus, setActionStatus] = useState<'transferred' | 'received'>('transferred');
    const [statusModalVisible, setStatusModalVisible] = useState(false);

    // Load couriers, products, product states from backend
    useEffect(() => {
        const load = async () => {
            try {
                const [couriersData, productsData, statesData] = await Promise.all([
                    couriersService.getFullList(),
                    productsService.getAll(),
                    productStatesService.getAll(),
                ]);

                const courierOptions: CourierOption[] = couriersData.map((c: any) => ({
                    id: c.id,
                    name: c.full_name ?? c.username ?? `Курьер ${c.id}`,
                }));
                setCouriers(courierOptions);
                setProducts(productsData.filter((p: Product) => p.is_active));
                setProductStates(statesData.filter((s: ProductState) => s.is_active));

                // Pre-select first product + first state for the default entry
                const firstProduct = productsData.find((p: Product) => p.is_active);
                const firstState = statesData.find((s: ProductState) => s.is_active);
                setEntries([{
                    id: '1',
                    productId: firstProduct?.id ?? null,
                    productName: firstProduct?.name ?? '',
                    stateId: firstState?.id ?? null,
                    stateName: firstState?.name ?? '',
                    quantity: 1,
                }]);
            } catch (e) {
                console.warn('[NewAction] Failed to load meta:', e);
                Alert.alert('Ошибка', 'Не удалось загрузить данные');
            } finally {
                setLoadingMeta(false);
            }
        };
        load();
    }, []);

    const addEntry = () =>
        setEntries(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                productId: products[0]?.id ?? null,
                productName: products[0]?.name ?? '',
                stateId: productStates[0]?.id ?? null,
                stateName: productStates[0]?.name ?? '',
                quantity: 1,
            },
        ]);

    const removeEntry = (id: string) =>
        setEntries(prev => prev.filter(e => e.id !== id));

    const updateQuantity = (id: string, delta: number) =>
        setEntries(prev =>
            prev.map(e => e.id === id ? { ...e, quantity: Math.max(1, e.quantity + delta) } : e)
        );

    const handleSave = async () => {
        if (!toCourierId) {
            Alert.alert('Ошибка', 'Выберите курьера');
            return;
        }
        if (entries.some(e => !e.productId || !e.stateId)) {
            Alert.alert('Ошибка', 'Выберите тип тары и её состояние (полные/пустые) для каждого товара');
            return;
        }
        if (actionStatus === 'received') {
            Alert.alert('Информация', 'Прием товаров пока не поддерживается сервером напрямую для курьеров (только передача).');
            return;
        }
        setSaving(true);
        try {
            for (const e of entries) {
                await courierTransactionsService.transferToCourier({
                    to_user_id: toCourierId,
                    product_id: e.productId!,
                    product_state_id: e.stateId!,
                    quantity: e.quantity,
                    note: notes || undefined,
                });
            }
            router.back();
        } catch (e: any) {
            console.warn('[NewAction] Save failed:', e);
            Alert.alert('Ошибка', e?.message || 'Не удалось создать транзакцию');
        } finally {
            setSaving(false);
        }
    };

    const courierOptions = couriers.map(c => ({ label: c.name, value: String(c.id) }));
    const productOptions = products.map(p => ({ label: p.name, value: String(p.id) }));
    const stateOptions = productStates.map(s => ({ label: s.name, value: String(s.id) }));

    if (loadingMeta) {
        return (
            <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Новое действие</Text>
                </View>
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Новое действие</Text>
                </View>

                <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                    {/* Статус */}
                    <Text style={styles.fieldLabel}>Статус</Text>
                    <TouchableOpacity style={styles.dropdown} onPress={() => setStatusModalVisible(true)}>
                        <Text style={styles.dropdownText}>
                            {actionStatus === 'transferred' ? 'Передано' : 'Принято'}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Кому / От кого */}
                    <Text style={styles.fieldLabel}>
                        {actionStatus === 'transferred' ? 'Кому' : 'От кого'}
                    </Text>
                    <TouchableOpacity style={styles.dropdown} onPress={() => setCourierModalVisible(true)}>
                        <Text style={[styles.dropdownText, !toCourierName && styles.placeholder]}>
                            {toCourierName || 'Выберите курьера'}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Product entries */}
                    {entries.map((entry, index) => (
                        <View key={entry.id} style={styles.productSection}>
                            <View style={styles.productHeaderRow}>
                                <Text style={styles.productTitle}>Товар {index + 1}:</Text>
                                {entries.length > 1 && (
                                    <TouchableOpacity onPress={() => removeEntry(entry.id)}>
                                        <Ionicons name="trash-outline" size={18} color={Colors.error} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Product + State row (Тары + Тип тары) */}
                            <View style={styles.typeRow}>
                                <View style={styles.typeItem}>
                                    <Text style={styles.typeLabel}>Тары</Text>
                                    <TouchableOpacity
                                        style={styles.dropdownSmall}
                                        onPress={() => setActiveEntryForState(entry.id)}
                                    >
                                        <Text style={[styles.dropdownText, !entry.stateName && styles.placeholder]} numberOfLines={1}>
                                            {entry.stateName || 'Выберите'}
                                        </Text>
                                        <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.typeItem}>
                                    <Text style={styles.typeLabel}>Тип тары</Text>
                                    <TouchableOpacity
                                        style={styles.dropdownSmall}
                                        onPress={() => setActiveEntryForProduct(entry.id)}
                                    >
                                        <Text style={[styles.dropdownText, !entry.productName && styles.placeholder]} numberOfLines={1}>
                                            {entry.productName || 'Выберите'}
                                        </Text>
                                        <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Quantity */}
                            <Text style={styles.typeLabel}>Количество</Text>
                            <View style={styles.quantityRow}>
                                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(entry.id, -1)}>
                                    <Ionicons name="remove" size={18} color={Colors.primary} />
                                </TouchableOpacity>
                                <Text style={styles.qtyValue}>{entry.quantity}</Text>
                                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(entry.id, 1)}>
                                    <Ionicons name="add" size={18} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Add entry */}
                    <TouchableOpacity style={styles.addProductButton} onPress={addEntry}>
                        <Ionicons name="add" size={18} color={Colors.success} />
                        <Text style={styles.addProductText}>Добавить товар</Text>
                    </TouchableOpacity>

                    {/* Notes */}
                    <Input
                        label="Заметки:"
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Нет заметок"
                        multiline
                        numberOfLines={4}
                        style={{ marginTop: 16 }}
                    />

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom bar */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                        <Text style={styles.cancelText}>Отмена</Text>
                    </TouchableOpacity>
                    <Button
                        title={saving ? 'Сохранение...' : 'Сохранить'}
                        onPress={handleSave}
                        variant="primary"
                        size="medium"
                        fullWidth={false}
                        style={{ paddingHorizontal: 40 }}
                    />
                </View>
            </KeyboardAvoidingView>

            {/* Modals */}
            <SelectModal
                visible={statusModalVisible}
                title="Выберите статус"
                options={[
                    { label: 'Передано', value: 'transferred' },
                    { label: 'Принято', value: 'received' },
                ]}
                selectedValue={actionStatus}
                onSelect={(val) => {
                    setActionStatus(val as 'transferred' | 'received');
                    setStatusModalVisible(false);
                }}
                onClose={() => setStatusModalVisible(false)}
            />
            <SelectModal
                visible={courierModalVisible}
                title={actionStatus === 'transferred' ? 'Выберите кому передать' : 'Выберите от кого принято'}
                options={courierOptions}
                selectedValue={toCourierId ? String(toCourierId) : ''}
                onSelect={(val) => {
                    const c = couriers.find(x => String(x.id) === val);
                    if (c) { setToCourierId(c.id); setToCourierName(c.name); }
                    setCourierModalVisible(false);
                }}
                onClose={() => setCourierModalVisible(false)}
            />
            <SelectModal
                visible={activeEntryForProduct !== null}
                title="Выберите продукт"
                options={productOptions}
                selectedValue={entries.find(e => e.id === activeEntryForProduct)?.productId
                    ? String(entries.find(e => e.id === activeEntryForProduct)!.productId)
                    : ''}
                onSelect={(val) => {
                    const product = products.find(p => String(p.id) === val);
                    if (activeEntryForProduct && product) {
                        setEntries(prev => prev.map(e =>
                            e.id === activeEntryForProduct
                                ? { ...e, productId: product.id, productName: product.name }
                                : e
                        ));
                    }
                    setActiveEntryForProduct(null);
                }}
                onClose={() => setActiveEntryForProduct(null)}
            />
            <SelectModal
                visible={activeEntryForState !== null}
                title="Выберите состояние"
                options={stateOptions}
                selectedValue={entries.find(e => e.id === activeEntryForState)?.stateId
                    ? String(entries.find(e => e.id === activeEntryForState)!.stateId)
                    : ''}
                onSelect={(val) => {
                    const state = productStates.find(s => String(s.id) === val);
                    if (activeEntryForState && state) {
                        setEntries(prev => prev.map(e =>
                            e.id === activeEntryForState
                                ? { ...e, stateId: state.id, stateName: state.name }
                                : e
                        ));
                    }
                    setActiveEntryForState(null);
                }}
                onClose={() => setActiveEntryForState(null)}
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
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    headerTitle: {
        ...Typography.h4,
        color: Colors.textPrimary,
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    fieldLabel: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
    },
    dropdownSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    dropdownText: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        flex: 1,
    },
    placeholder: {
        color: Colors.textSecondary,
    },
    productSection: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    productHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    productTitle: {
        ...Typography.h5,
        color: Colors.orangePromo,
    },
    typeRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    typeItem: {
        flex: 1,
    },
    typeLabel: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        overflow: 'hidden',
    },
    qtyBtn: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.background,
    },
    qtyValue: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        flex: 1,
        textAlign: 'center',
    },
    addProductButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.success,
        borderRadius: 10,
        paddingVertical: 12,
        backgroundColor: Colors.successLight,
        marginTop: 4,
        marginBottom: 8,
    },
    addProductText: {
        ...Typography.button,
        color: Colors.success,
        marginLeft: 6,
        fontWeight: '600',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        backgroundColor: Colors.white,
        gap: 12,
    },
    cancelButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cancelText: {
        ...Typography.button,
        color: Colors.textSecondary,
    },
});
