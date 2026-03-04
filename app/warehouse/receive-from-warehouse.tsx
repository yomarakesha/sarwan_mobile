import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import Input from '../../components/Input';
import SelectModal from '../../components/SelectModal';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { useAuth } from '../../contexts/AuthContext';
import productStatesService from '../../services/productStates';
import productsService from '../../services/products';
import warehouseLocationsService from '../../services/warehouseLocations';
import warehouseTransactionsService from '../../services/warehouseTransactions';
import { Location, Product, ProductState } from '../../types/models';

interface ProductEntry {
    id: string;
    productId: number | null;
    productName: string;
    stateId: number | null;
    stateName: string;
    quantity: number;
}

export default function ReceiveFromWarehouseScreen() {
    const router = useRouter();
    const { user } = useAuth();

    // Meta data
    const [warehouses, setWarehouses] = useState<Location[]>([]);
    const [courierLocations, setCourierLocations] = useState<Location[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [productStates, setProductStates] = useState<ProductState[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [fromWarehouseId, setFromWarehouseId] = useState<number | null>(null);
    const [fromWarehouseName, setFromWarehouseName] = useState('');
    const [toLocationId, setToLocationId] = useState<number | null>(null);
    const [toLocationName, setToLocationName] = useState('');
    const [notes, setNotes] = useState('');

    // Modal visibility
    const [warehouseModalVisible, setWarehouseModalVisible] = useState(false);
    const [courierLocModalVisible, setCourierLocModalVisible] = useState(false);
    const [activeEntryForProduct, setActiveEntryForProduct] = useState<string | null>(null);
    const [activeEntryForState, setActiveEntryForState] = useState<string | null>(null);

    const [entries, setEntries] = useState<ProductEntry[]>([
        { id: '1', productId: null, productName: '', stateId: null, stateName: '', quantity: 1 },
    ]);

    useEffect(() => {
        const load = async () => {
            try {
                const [warehousesData, courierLocsData, productsData, statesData] = await Promise.all([
                    warehouseLocationsService.getWarehouses(),
                    warehouseLocationsService.getCouriers(),
                    productsService.getAll(),
                    productStatesService.getAll(),
                ]);

                setWarehouses(warehousesData);
                setCourierLocations(courierLocsData);

                const activeProducts = productsData.filter((p: Product) => p.is_active);
                const activeStates = statesData.filter((s: ProductState) => s.is_active);
                setProducts(activeProducts);
                setProductStates(activeStates);

                // Pre-fill first product entry
                const firstProduct = activeProducts[0];
                const firstState = activeStates[0];
                setEntries([{
                    id: '1',
                    productId: firstProduct?.id ?? null,
                    productName: firstProduct?.name ?? '',
                    stateId: firstState?.id ?? null,
                    stateName: firstState?.name ?? '',
                    quantity: 1,
                }]);

                // Auto-select my courier location by matching user's full_name or id
                const myLoc = courierLocsData.find(
                    (l: Location) =>
                        l.name?.toLowerCase().includes(user?.full_name?.toLowerCase() ?? '') ||
                        l.name?.toLowerCase().includes(user?.username?.toLowerCase() ?? '')
                );
                if (myLoc) {
                    setToLocationId(myLoc.id);
                    setToLocationName(myLoc.name);
                }
            } catch (e) {
                console.warn('[ReceiveFromWarehouse] Failed to load meta:', e);
                Alert.alert('Ошибка', 'Не удалось загрузить данные');
            } finally {
                setLoadingMeta(false);
            }
        };
        load();
    }, [user]);

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
        if (!fromWarehouseId) {
            Alert.alert('Ошибка', 'Выберите склад-источник');
            return;
        }
        if (!toLocationId) {
            Alert.alert('Ошибка', 'Выберите локацию вашей машины');
            return;
        }
        if (entries.some(e => !e.productId || !e.stateId)) {
            Alert.alert('Ошибка', 'Выберите продукт и состояние для каждого товара');
            return;
        }

        setSaving(true);
        try {
            for (const e of entries) {
                await warehouseTransactionsService.create({
                    from_location_id: fromWarehouseId,
                    to_location_id: toLocationId,
                    product_id: e.productId!,
                    product_state_id: e.stateId!,
                    quantity: e.quantity,
                    operation_type: 'inventory_in',
                    note: notes || undefined,
                });
            }
            Alert.alert('Успешно', 'Товар получен со склада', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (e: any) {
            console.warn('[ReceiveFromWarehouse] Save failed:', e);
            Alert.alert('Ошибка', e?.message || 'Не удалось создать транзакцию');
        } finally {
            setSaving(false);
        }
    };

    const warehouseOptions = warehouses.map(w => ({ label: w.name, value: String(w.id) }));
    const courierLocOptions = courierLocations.map(l => ({ label: l.name, value: String(l.id) }));
    const productOptions = products.map(p => ({ label: p.name, value: String(p.id) }));
    const stateOptions = productStates.map(s => ({ label: s.name, value: String(s.id) }));

    if (loadingMeta) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Получить со склада</Text>
                    <View style={{ width: 32 }} />
                </View>
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Получить со склада</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Source warehouse */}
                <Text style={styles.sectionTitle}>Откуда</Text>
                <Text style={styles.fieldLabel}>Склад</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setWarehouseModalVisible(true)}>
                    <Text style={[styles.dropdownText, !fromWarehouseName && styles.placeholder]}>
                        {fromWarehouseName || 'Выберите склад'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>

                {/* Destination: courier's car */}
                <Text style={styles.sectionTitle}>Куда</Text>
                <Text style={styles.fieldLabel}>Ваша машина / локация</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setCourierLocModalVisible(true)}>
                    <Text style={[styles.dropdownText, !toLocationName && styles.placeholder]}>
                        {toLocationName || 'Выберите вашу локацию'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>

                {/* Product entries */}
                <Text style={styles.sectionTitle}>Товары</Text>
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

                        {/* Product + State */}
                        <View style={styles.typeRow}>
                            <View style={styles.typeItem}>
                                <Text style={styles.typeLabel}>Продукт</Text>
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
                            <View style={styles.typeItem}>
                                <Text style={styles.typeLabel}>Состояние</Text>
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
                    numberOfLines={3}
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
                    title={saving ? 'Сохранение...' : 'Получить товар'}
                    onPress={handleSave}
                    variant="primary"
                    size="medium"
                    fullWidth={false}
                    style={{ paddingHorizontal: 30 }}
                />
            </View>

            {/* Modals */}
            <SelectModal
                visible={warehouseModalVisible}
                title="Выберите склад"
                options={warehouseOptions}
                selectedValue={fromWarehouseId ? String(fromWarehouseId) : ''}
                onSelect={(val) => {
                    const w = warehouses.find(x => String(x.id) === val);
                    if (w) { setFromWarehouseId(w.id); setFromWarehouseName(w.name); }
                    setWarehouseModalVisible(false);
                }}
                onClose={() => setWarehouseModalVisible(false)}
            />
            <SelectModal
                visible={courierLocModalVisible}
                title="Ваша локация (машина)"
                options={courierLocOptions}
                selectedValue={toLocationId ? String(toLocationId) : ''}
                onSelect={(val) => {
                    const l = courierLocations.find(x => String(x.id) === val);
                    if (l) { setToLocationId(l.id); setToLocationName(l.name); }
                    setCourierLocModalVisible(false);
                }}
                onClose={() => setCourierLocModalVisible(false)}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    backButton: { padding: 4 },
    headerTitle: {
        ...Typography.h4,
        color: Colors.textPrimary,
        flex: 1,
        textAlign: 'center',
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        ...Typography.h5,
        color: Colors.primary,
        marginBottom: 10,
        marginTop: 4,
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
        marginBottom: 20,
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
    placeholder: { color: Colors.textSecondary },
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
    typeItem: { flex: 1 },
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
