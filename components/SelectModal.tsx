import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectModalProps {
    visible: boolean;
    title: string;
    options: SelectOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
    onClose: () => void;
}

export default function SelectModal({
    visible,
    title,
    options,
    selectedValue,
    onSelect,
    onClose,
}: SelectModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.title}>{title}</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                    <Ionicons name="close" size={24} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.value}
                                style={styles.list}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.optionRow}
                                        onPress={() => {
                                            onSelect(item.value);
                                            onClose();
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                item.value === selectedValue && styles.selectedText,
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                        {item.value === selectedValue && (
                                            <Ionicons name="checkmark" size={20} color={Colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '60%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    title: {
        ...Typography.h4,
        color: Colors.textPrimary,
    },
    closeBtn: {
        padding: 4,
    },
    list: {
        paddingVertical: 8,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    optionText: {
        ...Typography.bodyReact,
        ...Typography.bodyM,
        color: Colors.textPrimary,
    },
    selectedText: {
        color: Colors.primary,
        fontWeight: '600',
    },
});
