import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

export type OrderStatus = 'waiting' | 'in_transit' | 'delivered' | 'cancelled';

interface StatusOption {
    value: OrderStatus;
    label: string;
    color: string;
    bgColor: string;
    filled: boolean;
}

const statusOptions: StatusOption[] = [
    { value: 'in_transit', label: 'В пути', color: Colors.primary, bgColor: Colors.primary, filled: true },
    { value: 'waiting', label: 'В ожидании', color: Colors.warning, bgColor: 'transparent', filled: false },
    { value: 'delivered', label: 'Доставлено', color: Colors.success, bgColor: Colors.success, filled: true },
    { value: 'cancelled', label: 'Отменено', color: Colors.error, bgColor: Colors.error, filled: true },
];

interface StatusDropdownProps {
    currentStatus: string;
    onStatusChange: (status: OrderStatus) => void;
}

export default function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
    const [visible, setVisible] = useState(false);

    // Map mock status strings to our OrderStatus
    const mapStatus = (s: string): OrderStatus => {
        if (s === 'in_transit' || s === 'В пути') return 'in_transit';
        if (s === 'delivered' || s === 'Доставлено') return 'delivered';
        if (s === 'cancelled' || s === 'Отменено') return 'cancelled';
        return 'waiting';
    };

    const current = mapStatus(currentStatus);
    const currentOption = statusOptions.find((o) => o.value === current) || statusOptions[0];

    const handleSelect = (option: StatusOption) => {
        onStatusChange(option.value);
        setVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.trigger,
                    currentOption.filled
                        ? {
                            backgroundColor: currentOption.bgColor,
                            borderColor: currentOption.bgColor,
                        }
                        : {
                            backgroundColor: 'transparent',
                            borderColor: currentOption.color,
                        },
                ]}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.triggerText,
                        { color: currentOption.filled ? Colors.textWhite : currentOption.color },
                    ]}
                >
                    {currentOption.label}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={14}
                    color={currentOption.filled ? Colors.textWhite : currentOption.color}
                />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.dropdown}>
                        {statusOptions.map((option) => {
                            const isSelected = option.value === current;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[styles.option, isSelected && styles.optionSelected]}
                                    onPress={() => handleSelect(option)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            { color: option.color },
                                            isSelected && styles.optionLabelSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {isSelected && (
                                        <Ionicons name="checkmark" size={18} color={option.color} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1.5,
        gap: 6,
    },
    triggerText: {
        ...Typography.bodyS,
        fontWeight: '600',
    },
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'flex-end',
    },
    dropdown: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
        paddingBottom: 32,
        paddingHorizontal: 16,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    optionSelected: {
        backgroundColor: Colors.primaryLight,
        borderRadius: 10,
        marginVertical: 2,
        borderBottomWidth: 0,
    },
    optionLabel: {
        ...Typography.bodyM,
        fontWeight: '500',
    },
    optionLabelSelected: {
        fontWeight: '700',
    },
});
