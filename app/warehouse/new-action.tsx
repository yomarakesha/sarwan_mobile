import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import brandsService from '../../services/brands';
import courierTransactionsService from '../../services/courierTransactions';
import { couriersService } from '../../services/couriers';
import { Brand } from '../../types/models';

interface ProductEntry {
    id: string;
    /** product_state label shown to user */
    type: string;
    /** brand name (display only) */
    brand: string;
    quantity: number;
}

const TARY_TYPES = [
    { label: 'Полные', value: 'Полные' },
    { label: 'Пустые', value: 'Пустые' },
];

interface CourierOption {
    id: number;
    name: string;
}

export default function NewWarehouseActionScreen() {
    const router = useRouter();

    // Meta loaded from backend
    const [couriers, setCouriers] = useState<CourierOption[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [toCourierId, setToCourierId] = useState<number | null>(null);
    const [toCourierName, setToCourierName] = useState('');
    const [notes, setNotes] = useState('');

    // Modal visibility
    const [courierModalVisible, setCourierModalVisible] = useState(false);
    const [activeProductForType, setActiveProductForType] = useState<string | null>(null);
    const [activeProductForBrand, setActiveProductForBrand] = useState<string | null>(null);

    const [products, setProducts] = useState<ProductEntry[]>([
        { id: '1', type: 'Полные', brand: '', quantity: 100 },
    ]);

    // Load couriers list and brands from backend
    useEffect(() => {
        const load = async () => {
            try {
                const [couriersData, brandsData] = await Promise.all([
                    couriersService.getFullList(),
                    brandsService.getAll(),
                ]);
                // couriersData is the full list— map to simple {id, name}
                const courierOptions: CourierOption[] = couriersData.map((c: any) => ({
                    id: c.id,
                    name: c.full_name ?? c.username ?? `Курьер ${c.id}`,
                }));
                setCouriers(courierOptions);
                setBrands(brandsData);
                if (brandsData.length > 0) {
                    setProducts(prev => prev.map(p => ({ ...p, brand: brandsData[0].name })));
                }
            } catch (e) {
                console.warn('[NewAction] Failed to load meta:', e);
            } finally {
                setLoadingMeta(false);
            }
        };
        load();
    }, []);

    const addProduct = () =>
        setProducts(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'Полные', brand: brands[0]?.name ?? '', quantity: 1 },
        ]);

    const removeProduct = (id: string) =>
        setProducts(prev => prev.filter(p => p.id !== id));

    const updateProductType = (id: string, type: string) =>
        setProducts(prev => prev.map(p => p.id === id ? { ...p, type } : p));

    const updateProductBrand = (id: string, brand: string) =>
        setProducts(prev => prev.map(p => p.id === id ? { ...p, brand } : p));

    const updateQuantity = (id: string, delta: number) =>
        setProducts(prev =>
            prev.map(p => p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p)
        );

    const handleSave = async () => {
        if (!toCourierId) return;
        setSaving(true);
        try {
            // Send one transaction per product entry
            // product_id=1 and product_state_id placeholder until products are selectable by ID
            for (const p of products) {
                await courierTransactionsService.transferToCourier({
                    to_user_id: toCourierId,
                    product_id: 1, // placeholder — product picker with real IDs to be added
                    product_state_id: p.type === 'Полные' ? 1 : 2, // placeholder state IDs
                    quantity: p.quantity,
                    note: notes || undefined,
                });
            }
            router.back();
        } catch (e) {
            console.warn('[NewAction] Save failed:', e);
        } finally {
            setSaving(false);
        }
    };

    const courierOptions = couriers.map(c => ({ label: c.name, value: String(c.id) }));
    const brandOptions = brands.map(b => ({ label: b.name, value: b.name }));

    if (loadingMeta) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Новое действие</Text>
                </View>
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Новое действие</Text>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Кому (target courier) */}
                <Text style={styles.fieldLabel}>Кому</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setCourierModalVisible(true)}>
                    <Text style={[styles.dropdownText, !toCourierName && styles.placeholder]}>
                        {toCourierName || 'Выберите курьера'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>

                {/* Products */}
                {products.map((product, index) => (
                    <View key={product.id} style={styles.productSection}>
                        <View style={styles.productHeaderRow}>
                            <Text style={styles.productTitle}>Товар {index + 1}:</Text>
                            {products.length > 1 && (
                                <TouchableOpacity onPress={() => removeProduct(product.id)}>
                                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Type and Brand row */}
                        <View style={styles.typeRow}>
                            <View style={styles.typeItem}>
                                <Text style={styles.typeLabel}>Тары</Text>
                                <TouchableOpacity
                                    style={styles.dropdownSmall}
                                    onPress={() => setActiveProductForType(product.id)}
                                >
                                    <Text style={styles.dropdownText}>{product.type}</Text>
                                    <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.typeItem}>
                                <Text style={styles.typeLabel}>Тип тары</Text>
                                <TouchableOpacity
                                    style={styles.dropdownSmall}
                                    onPress={() => setActiveProductForBrand(product.id)}
                                >
                                    <Text style={styles.dropdownText}>{product.brand || '—'}</Text>
                                    <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Quantity with +/- */}
                        <Text style={styles.typeLabel}>Количество</Text>
                        <View style={styles.quantityRow}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(product.id, -1)}>
                                <Ionicons name="remove" size={18} color={Colors.primary} />
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{product.quantity}</Text>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(product.id, 1)}>
                                <Ionicons name="add" size={18} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* Add product */}
                <TouchableOpacity style={styles.addProductButton} onPress={addProduct}>
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

            {/* Modals */}
            <SelectModal
                visible={courierModalVisible}
                title="Выберите курьера"
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
                visible={activeProductForType !== null}
                title="Выберите тип"
                options={TARY_TYPES}
                selectedValue={products.find(p => p.id === activeProductForType)?.type ?? 'Полные'}
                onSelect={(val) => {
                    if (activeProductForType) updateProductType(activeProductForType, val);
                    setActiveProductForType(null);
                }}
                onClose={() => setActiveProductForType(null)}
            />
            <SelectModal
                visible={activeProductForBrand !== null}
                title="Выберите бренд"
                options={brandOptions}
                selectedValue={products.find(p => p.id === activeProductForBrand)?.brand ?? ''}
                onSelect={(val) => {
                    if (activeProductForBrand) updateProductBrand(activeProductForBrand, val);
                    setActiveProductForBrand(null);
                }}
                onClose={() => setActiveProductForBrand(null)}
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
