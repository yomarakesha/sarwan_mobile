import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import NoteModal from '../../components/NoteModal';
import QuantitySelector from '../../components/QuantitySelector';
import SelectModal from '../../components/SelectModal';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { OrderNote } from '../../data/mockData';

interface ProductEntry {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export default function AddOrderScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('+993 ');
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [products, setProducts] = useState<ProductEntry[]>([
        { id: '1', name: 'Вода 20л', quantity: 2, price: 15 },
    ]);
    const [emptyBottles, setEmptyBottles] = useState(0);

    // Notes
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [notes, setNotes] = useState<OrderNote[]>([]);

    // Payment Splitting
    const [isCashChecked, setIsCashChecked] = useState(true);
    const [isCardChecked, setIsCardChecked] = useState(false);
    const [paymentCashStr, setPaymentCashStr] = useState('');
    const [paymentCardStr, setPaymentCardStr] = useState('');

    const [activeProductDropdown, setActiveProductDropdown] = useState<string | null>(null);

    // Total Calculation
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    useEffect(() => {
        if (isCashChecked && !isCardChecked) {
            setPaymentCashStr(total.toString());
            setPaymentCardStr('0');
        } else if (!isCashChecked && isCardChecked) {
            setPaymentCashStr('0');
            setPaymentCardStr(total.toString());
        } else if (!isCashChecked && !isCardChecked) {
            setPaymentCashStr('0');
            setPaymentCardStr('0');
        } else if (isCashChecked && isCardChecked) {
            const cashVal = parseInt(paymentCashStr) || 0;
            if (cashVal <= total && cashVal > 0) {
                setPaymentCardStr((total - cashVal).toString());
            }
        }
    }, [isCashChecked, isCardChecked, total]);

    const handleCashChange = (val: string) => {
        setPaymentCashStr(val);
        if (isCashChecked && isCardChecked) {
            const num = parseInt(val) || 0;
            if (num <= total) setPaymentCardStr((total - num).toString());
            else setPaymentCardStr('0');
        }
    };

    const handleCardChange = (val: string) => {
        setPaymentCardStr(val);
        if (isCashChecked && isCardChecked) {
            const num = parseInt(val) || 0;
            if (num <= total) setPaymentCashStr((total - num).toString());
            else setPaymentCashStr('0');
        }
    };

    const getPriceForProduct = (name: string) => {
        if (name.includes('Замена')) return 50;
        return 15;
    };

    const addProduct = () => {
        setProducts([
            ...products,
            { id: Date.now().toString(), name: 'Вода 20л', quantity: 1, price: 15 },
        ]);
    };

    const removeProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    const updateProductName = (id: string, name: string) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, name, price: getPriceForProduct(name) } : p)));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, quantity } : p)));
    };

    const handleAddNote = (text: string) => {
        const newNote: OrderNote = {
            id: Date.now().toString(),
            author: 'Amanow Aman',
            role: 'Оператор',
            date: new Date().toLocaleString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            text,
        };
        setNotes([...notes, newNote]);
        setIsNoteModalVisible(false);
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

                {/* Notes Button */}
                <TouchableOpacity style={styles.noteButton} onPress={() => setIsNoteModalVisible(true)}>
                    <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
                    <Text style={styles.noteButtonText}>
                        Заметки к заказу {notes.length > 0 ? `(${notes.length})` : ''}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

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

                <View style={styles.divider} />

                {/* Empty bottles */}
                <Text style={styles.sectionTitle}>Пустые тары</Text>
                <View style={styles.productItem}>
                    <View style={styles.taryRow}>
                        <Text style={styles.productLabel}>Забрано:</Text>
                        <QuantitySelector
                            label=""
                            value={emptyBottles}
                            onChange={setEmptyBottles}
                        />
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Payment */}
                <Text style={styles.sectionTitle}>Оплата</Text>

                <TouchableOpacity
                    style={styles.paymentRow}
                    onPress={() => setIsCashChecked(!isCashChecked)}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isCashChecked ? "checkbox" : "square-outline"}
                        size={22}
                        color={isCashChecked ? Colors.primary : Colors.border}
                    />
                    <Text style={styles.paymentLabel}>Наличные:</Text>
                    <View style={styles.paymentInputWrapper}>
                        <TextInput
                            style={[styles.paymentInput, !isCashChecked && styles.paymentInputDisabled]}
                            value={paymentCashStr}
                            onChangeText={handleCashChange}
                            keyboardType="numeric"
                            editable={isCashChecked}
                        />
                        <Text style={styles.paymentCurrency}>TMT</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.paymentRow}
                    onPress={() => setIsCardChecked(!isCardChecked)}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isCardChecked ? "checkbox" : "square-outline"}
                        size={22}
                        color={isCardChecked ? Colors.primary : Colors.border}
                    />
                    <Text style={styles.paymentLabel}>Карта:</Text>
                    <View style={styles.paymentInputWrapper}>
                        <TextInput
                            style={[styles.paymentInput, !isCardChecked && styles.paymentInputDisabled]}
                            value={paymentCardStr}
                            onChangeText={handleCardChange}
                            keyboardType="numeric"
                            editable={isCardChecked}
                        />
                        <Text style={styles.paymentCurrency}>TMT</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* Total */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Итого:</Text>
                    <Text style={styles.totalAmount}>{total} TMT</Text>
                </View>

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

            {/* Note Modal */}
            <NoteModal
                visible={isNoteModalVisible}
                onClose={() => setIsNoteModalVisible(false)}
                notes={notes}
                onSave={handleAddNote}
            />

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
    noteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: Colors.background,
        borderRadius: 10,
        marginTop: 8,
    },
    noteButtonText: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        marginLeft: 10,
    },
    taryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    paymentLabel: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        marginLeft: 12,
        flex: 1,
    },
    paymentInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        width: 140,
    },
    paymentInput: {
        flex: 1,
        ...Typography.bodyM,
        color: Colors.textPrimary,
        paddingVertical: 0,
        height: '100%',
    },
    paymentInputDisabled: {
        color: Colors.textPlaceholder,
    },
    paymentCurrency: {
        ...Typography.bodyM,
        color: Colors.textSecondary,
        marginLeft: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    totalText: {
        ...Typography.h4,
        color: Colors.textPrimary,
    },
    totalAmount: {
        ...Typography.h4,
        color: Colors.textPrimary,
    },
});
