import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import { businessServicesApi } from '../../services/businessServices';
import citiesService from '../../services/cities';
import districtsService from '../../services/districts';
import operatorClientsService, { ClientSearchResult } from '../../services/operatorClients';
import { BusinessService, City, District } from '../../types/models';

interface ProductEntry {
    id: string;
    serviceId: number | null;
    name: string;
    quantity: number;
    price: number;
}

export default function AddOrderScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('+993 ');
    const [clientSuggestions, setClientSuggestions] = useState<ClientSearchResult[]>([]);
    const [searchingClient, setSearchingClient] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [products, setProducts] = useState<ProductEntry[]>([
        { id: '1', serviceId: null, name: '', quantity: 1, price: 0 },
    ]);
    const [emptyBottles, setEmptyBottles] = useState(0);

    // Services loaded from API
    const [services, setServices] = useState<BusinessService[]>([]);
    const [loadingServices, setLoadingServices] = useState(true);

    // Cities & Districts from API
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
    const [loadingCities, setLoadingCities] = useState(true);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

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

    // Helper: get price for a service in the selected city
    const getPriceForCity = (service: BusinessService, cityId: number | null): number => {
        if (!cityId || !service.prices) return 0;
        const priceEntry = service.prices.find(p => p.city_id === cityId);
        return priceEntry ? priceEntry.price : 0;
    };

    // Phone search: debounce search after 6+ digits typed
    useEffect(() => {
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 6) {
            setClientSuggestions([]);
            return;
        }
        const timer = setTimeout(async () => {
            setSearchingClient(true);
            try {
                const results = await operatorClientsService.searchByPhone(phone.trim());
                setClientSuggestions(results);
            } catch {
                setClientSuggestions([]);
            } finally {
                setSearchingClient(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [phone]);

    const handleSelectClient = (client: ClientSearchResult) => {
        setPhone(client.phone);
        setCustomerName(client.full_name);
        setClientSuggestions([]);
    };

    // Load services and cities from backend on mount
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [servicesData, citiesData] = await Promise.all([
                    businessServicesApi.getAll({ is_active: true }),
                    citiesService.getAll(),
                ]);
                setServices(servicesData);
                setCities(citiesData);
                // Pre-select first service
                if (servicesData.length > 0) {
                    setProducts(prev => prev.map(p => {
                        if (!p.serviceId) {
                            const firstService = servicesData[0];
                            return { ...p, serviceId: firstService.id, name: firstService.name, price: 0 };
                        }
                        return p;
                    }));
                }
            } catch (e) {
                console.warn('[AddOrder] Failed to load initial data:', e);
            } finally {
                setLoadingServices(false);
                setLoadingCities(false);
            }
        };
        loadInitialData();
    }, []);

    // Load districts when city changes
    useEffect(() => {
        if (!selectedCityId) {
            setDistricts([]);
            setSelectedDistrictId(null);
            return;
        }
        const loadDistricts = async () => {
            setLoadingDistricts(true);
            try {
                const data = await districtsService.getAll(selectedCityId);
                setDistricts(data);
                setSelectedDistrictId(null);
            } catch (e) {
                console.warn('[AddOrder] Failed to load districts:', e);
            } finally {
                setLoadingDistricts(false);
            }
        };
        loadDistricts();
    }, [selectedCityId]);

    // Re-calculate prices when city changes
    useEffect(() => {
        if (services.length === 0) return;
        setProducts(prev => prev.map(p => {
            if (!p.serviceId) return p;
            const service = services.find(s => s.id === p.serviceId);
            if (!service) return p;
            return { ...p, price: getPriceForCity(service, selectedCityId) };
        }));
    }, [selectedCityId, services]);

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

    const addProduct = () => {
        const firstService = services[0];
        setProducts([
            ...products,
            {
                id: Date.now().toString(),
                serviceId: firstService?.id ?? null,
                name: firstService?.name ?? '',
                quantity: 1,
                price: 0,
            },
        ]);
    };

    const removeProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    const updateProductService = (productId: string, service: BusinessService) => {
        const price = getPriceForCity(service, selectedCityId);
        setProducts(products.map((p) =>
            p.id === productId
                ? { ...p, serviceId: service.id, name: service.name, price }
                : p
        ));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, quantity } : p)));
    };

    const handleAddNote = (text: string) => {
        const newNote: OrderNote = {
            id: Date.now().toString(),
            author: 'Курьер',
            role: 'Курьер',
            date: new Date().toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            text,
        };
        setNotes([...notes, newNote]);
        setIsNoteModalVisible(false);
    };

    const handleSave = () => {
        // Order creation API endpoint is not yet implemented in backend
        // This will be connected once POST /api/courier/orders is added
        router.back();
    };

    // Build select options from loaded services
    const serviceOptions = services.map(s => ({ label: s.name, value: String(s.id) }));

    const activeProductService = products.find(p => p.id === activeProductDropdown);

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
                {/* Client search suggestions */}
                {searchingClient && (
                    <ActivityIndicator size="small" color={Colors.primary} style={{ marginBottom: 6 }} />
                )}
                {clientSuggestions.length > 0 && (
                    <View style={styles.suggestionsBox}>
                        {clientSuggestions.map((c) => (
                            <TouchableOpacity
                                key={c.id}
                                style={styles.suggestionRow}
                                onPress={() => handleSelectClient(c)}
                            >
                                <Text style={styles.suggestionName}>{c.full_name}</Text>
                                <Text style={styles.suggestionPhone}>{c.phone}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                <Input
                    label="Имя клиента"
                    value={customerName}
                    onChangeText={setCustomerName}
                    placeholder="Введите имя"
                />

                {/* City Selector */}
                <Text style={styles.fieldLabel}>Город</Text>
                {loadingCities ? (
                    <ActivityIndicator size="small" color={Colors.primary} style={{ marginBottom: 12 }} />
                ) : (
                    <TouchableOpacity
                        style={styles.selectorButton}
                        onPress={() => setIsCityDropdownOpen(true)}
                    >
                        <Text style={[styles.selectorText, !selectedCityId && styles.selectorPlaceholder]}>
                            {selectedCityId
                                ? cities.find(c => c.id === selectedCityId)?.name ?? 'Выберите город'
                                : 'Выберите город'}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                )}

                {/* District Selector */}
                <Text style={styles.fieldLabel}>Район</Text>
                {loadingDistricts ? (
                    <ActivityIndicator size="small" color={Colors.primary} style={{ marginBottom: 12 }} />
                ) : (
                    <TouchableOpacity
                        style={[styles.selectorButton, !selectedCityId && styles.selectorDisabled]}
                        onPress={() => selectedCityId && setIsDistrictDropdownOpen(true)}
                        disabled={!selectedCityId}
                    >
                        <Text style={[styles.selectorText, !selectedDistrictId && styles.selectorPlaceholder]}>
                            {selectedDistrictId
                                ? districts.find(d => d.id === selectedDistrictId)?.name ?? 'Выберите район'
                                : selectedCityId ? 'Выберите район' : 'Сначала выберите город'}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                )}

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

                <View style={styles.divider} />

                {/* Products */}
                <Text style={styles.sectionTitle}>Товары</Text>

                {loadingServices ? (
                    <View style={styles.loadingServices}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                        <Text style={styles.loadingText}>Загрузка услуг...</Text>
                    </View>
                ) : (
                    <>
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
                                    <Text style={[styles.productName, !product.name && styles.productNamePlaceholder]}>
                                        {product.name || 'Выберите услугу'}
                                    </Text>
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
                    </>
                )}

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

            {/* Product / Service selection modal */}
            <SelectModal
                visible={activeProductDropdown !== null}
                title="Выберите услугу"
                options={serviceOptions}
                selectedValue={activeProductService ? String(activeProductService.serviceId) : ''}
                onSelect={(val) => {
                    const service = services.find(s => String(s.id) === val);
                    if (activeProductDropdown && service) {
                        updateProductService(activeProductDropdown, service);
                    }
                }}
                onClose={() => setActiveProductDropdown(null)}
            />

            {/* City selection modal */}
            <SelectModal
                visible={isCityDropdownOpen}
                title="Выберите город"
                options={cities.map(c => ({ label: c.name, value: String(c.id) }))}
                selectedValue={selectedCityId ? String(selectedCityId) : ''}
                onSelect={(val) => {
                    setSelectedCityId(val ? Number(val) : null);
                    setIsCityDropdownOpen(false);
                }}
                onClose={() => setIsCityDropdownOpen(false)}
            />

            {/* District selection modal */}
            <SelectModal
                visible={isDistrictDropdownOpen}
                title="Выберите район"
                options={districts.map(d => ({ label: d.name, value: String(d.id) }))}
                selectedValue={selectedDistrictId ? String(selectedDistrictId) : ''}
                onSelect={(val) => {
                    setSelectedDistrictId(val ? Number(val) : null);
                    setIsDistrictDropdownOpen(false);
                }}
                onClose={() => setIsDistrictDropdownOpen(false)}
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
    fieldLabel: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginBottom: 6,
        marginTop: 4,
    },
    selectorButton: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
        backgroundColor: Colors.white,
    },
    selectorText: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        flex: 1,
    },
    selectorPlaceholder: {
        color: Colors.textPlaceholder,
    },
    selectorDisabled: {
        backgroundColor: Colors.borderLight,
        opacity: 0.6,
    },

    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: 20,
    },
    loadingServices: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    loadingText: {
        ...Typography.bodyM,
        color: Colors.textSecondary,
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
    productNamePlaceholder: {
        color: Colors.textPlaceholder,
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
    suggestionsBox: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
    },
    suggestionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        backgroundColor: Colors.white,
    },
    suggestionName: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        flex: 1,
    },
    suggestionPhone: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
    },
});
