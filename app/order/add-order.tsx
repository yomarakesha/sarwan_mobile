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
import QuantitySelector from '../../components/QuantitySelector';
import SelectModal from '../../components/SelectModal';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';

interface ProductEntry {
    id: string;
    name: string;
    quantity: number;
}

export default function AddOrderScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('+993 ');
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [products, setProducts] = useState<ProductEntry[]>([
        { id: '1', name: 'Вода 20л', quantity: 2 },
    ]);

    const [activeProductDropdown, setActiveProductDropdown] = useState<string | null>(null);

    const addProduct = () => {
        setProducts([
            ...products,
            { id: Date.now().toString(), name: 'Вода 20л', quantity: 1 },
        ]);
    };

    const removeProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    const updateProductName = (id: string, name: string) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, name } : p)));
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
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Новый заказ</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Customer info */}
                <Text style={styles.sectionTitle}>Информация о клиенте</Text>

                <Input
                    label="Телефон"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+993 __ __-__-__-__"
                />
                <Input
                    label="Имя клиента"
                    value={customerName}
                    onChangeText={setCustomerName}
                    placeholder="Введите имя"
                />
                <Input
                    label="Адрес"
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Введите адрес"
                />

                {/* Divider */}
                <View style={styles.divider} />

                {/* Products */}
                <Text style={styles.sectionTitle}>Товары</Text>

                {products.map((product, index) => (
                    <View key={product.id} style={styles.productItem}>
                        <View style={styles.productHeaderRow}>
                            <Text style={styles.productLabel}>Товар {index + 1}:</Text>
                            {products.length > 1 && (
                                <TouchableOpacity onPress={() => removeProduct(product.id)}>
                                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.productDropdown}
                            onPress={() => setActiveProductDropdown(product.id)}
                        >
                            <Text style={styles.productName}>{product.name}</Text>
                            <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                        </TouchableOpacity>
                        <QuantitySelector
                            label="Количество:"
                            value={product.quantity}
                            onChange={(qty) => updateQuantity(product.id, qty)}
                        />
                    </View>
                ))}

                <TouchableOpacity style={styles.addProductButton} onPress={addProduct}>
                    <Ionicons name="add" size={18} color={Colors.success} />
                    <Text style={styles.addProductText}>Добавить товар</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom bar */}
            <View style={styles.bottomBar}>
                <Button
                    title="Сохранить"
                    onPress={handleSave}
                    variant="primary"
                    size="large"
                />
            </View>

            {/* Product selection modal */}
            <SelectModal
                visible={activeProductDropdown !== null}
                title="Выберите товар"
                options={[
                    { label: 'Вода 20л', value: 'Вода 20л' },
                    { label: 'Вода 19л (Sarwan)', value: 'Вода 19л (Sarwan)' },
                    { label: 'Вода 19л (Arçalyk)', value: 'Вода 19л (Arçalyk)' },
                    { label: 'Помпа', value: 'Помпа' },
                ]}
                selectedValue={products.find(p => p.id === activeProductDropdown)?.name || 'Вода 20л'}
                onSelect={(val) => {
                    if (activeProductDropdown) updateProductName(activeProductDropdown, val);
                }}
                onClose={() => setActiveProductDropdown(null)}
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
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        ...Typography.h5,
        color: Colors.primary,
        marginBottom: 14,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: 20,
    },
    productItem: {
        marginBottom: 16,
    },
    productHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productLabel: {
        ...Typography.label,
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
        marginBottom: 8,
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
        backgroundColor: Colors.successLight,
        marginTop: 4,
    },
    addProductText: {
        ...Typography.button,
        color: Colors.success,
        marginLeft: 6,
        fontWeight: '600',
    },
    bottomBar: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        backgroundColor: Colors.white,
    },
});
