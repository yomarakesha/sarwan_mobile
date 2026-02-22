import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import Input from '../../components/Input';
import SelectModal from '../../components/SelectModal';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';

interface ProductEntry {
    id: string;
    type: string;
    brand: string;
    quantity: number;
}

export default function NewWarehouseActionScreen() {
    const router = useRouter();
    const [status, setStatus] = useState('Передано');
    const [person, setPerson] = useState('Amanow Wepa');
    const [notes, setNotes] = useState('');

    // Modal visibility states
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [personModalVisible, setPersonModalVisible] = useState(false);

    // Track which product is currently selecting a type/brand
    const [activeProductForType, setActiveProductForType] = useState<string | null>(null);
    const [activeProductForBrand, setActiveProductForBrand] = useState<string | null>(null);
    const [products, setProducts] = useState<ProductEntry[]>([
        { id: '1', type: 'Полные', brand: 'Sarwan', quantity: 100 },
    ]);

    const addProduct = () => {
        setProducts([
            ...products,
            { id: Date.now().toString(), type: 'Полные', brand: 'Sarwan', quantity: 1 },
        ]);
    };

    const removeProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    const updateProductType = (id: string, type: string) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, type } : p)));
    };

    const updateProductBrand = (id: string, brand: string) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, brand } : p)));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, quantity } : p)));
    };

    const handleSave = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Новое действие</Text>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Status dropdown */}
                <Text style={styles.fieldLabel}>Статус</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setStatusModalVisible(true)}>
                    <Text style={styles.dropdownText}>{status}</Text>
                    <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>

                {/* Person dropdown */}
                <Text style={styles.fieldLabel}>Кому</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setPersonModalVisible(true)}>
                    <Text style={styles.dropdownText}>{person}</Text>
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
                                    <Text style={styles.dropdownText}>{product.brand}</Text>
                                    <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Quantity */}
                        <Text style={styles.typeLabel}>Количество</Text>
                        <View style={styles.quantityInput}>
                            <Text style={styles.dropdownText}>{product.quantity}</Text>
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
                    title="Сохранить"
                    onPress={handleSave}
                    variant="primary"
                    size="medium"
                    fullWidth={false}
                    style={{ paddingHorizontal: 40 }}
                />
            </View>

            {/* Modals */}
            <SelectModal
                visible={statusModalVisible}
                title="Выберите статус"
                options={[
                    { label: 'Передано', value: 'Передано' },
                    { label: 'Принято', value: 'Принято' },
                    { label: 'В машине', value: 'В машине' },
                ]}
                selectedValue={status}
                onSelect={(val) => setStatus(val)}
                onClose={() => setStatusModalVisible(false)}
            />

            <SelectModal
                visible={personModalVisible}
                title="Выберите сотрудника"
                options={[
                    { label: 'Amanow Wepa', value: 'Amanow Wepa' },
                    { label: 'Muradow Mekan', value: 'Muradow Mekan' },
                    { label: 'Склад №1', value: 'Склад №1' },
                ]}
                selectedValue={person}
                onSelect={(val) => setPerson(val)}
                onClose={() => setPersonModalVisible(false)}
            />

            <SelectModal
                visible={activeProductForType !== null}
                title="Выберите тип"
                options={[
                    { label: 'Полные', value: 'Полные' },
                    { label: 'Пустые', value: 'Пустые' }
                ]}
                selectedValue={products.find(p => p.id === activeProductForType)?.type || 'Полные'}
                onSelect={(val) => {
                    if (activeProductForType) updateProductType(activeProductForType, val);
                }}
                onClose={() => setActiveProductForType(null)}
            />

            <SelectModal
                visible={activeProductForBrand !== null}
                title="Выберите бренд"
                options={[
                    { label: 'Sarwan', value: 'Sarwan' },
                    { label: 'Arçalyk', value: 'Arçalyk' },
                    { label: 'Taze Suw', value: 'Taze Suw' },
                ]}
                selectedValue={products.find(p => p.id === activeProductForBrand)?.brand || 'Sarwan'}
                onSelect={(val) => {
                    if (activeProductForBrand) updateProductBrand(activeProductForBrand, val);
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
    quantityInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
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
