import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { WarehouseAction } from '../data/mockData';

interface WarehouseDetailModalProps {
    visible: boolean;
    onClose: () => void;
    action: WarehouseAction | null;
}

export default function WarehouseDetailModal({
    visible,
    onClose,
    action,
}: WarehouseDetailModalProps) {
    if (!action) return null;

    const isReceived = action.status === 'received';

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.sheet} onStartShouldSetResponder={() => true}>
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Детали</Text>
                        <Text style={styles.dateText}>{action.time}</Text>
                    </View>

                    {/* Status row */}
                    <View style={styles.row}>
                        <Text style={styles.label}>Статус:</Text>
                        <Text
                            style={[
                                styles.statusValue,
                                { color: isReceived ? Colors.success : Colors.orangePromo },
                            ]}
                        >
                            {isReceived ? 'Принято' : 'Передано'}
                        </Text>
                    </View>

                    {/* Person */}
                    <View style={styles.row}>
                        <Text style={styles.label}>
                            {isReceived ? 'От кого' : 'Кому'}
                        </Text>
                        <Text style={styles.value}>{action.person}</Text>
                    </View>

                    {/* Items */}
                    {action.items.map((item, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.label}>{item.name}</Text>
                            <Text style={styles.value}>{item.quantity}</Text>
                        </View>
                    ))}

                    {/* Notes */}
                    {action.notes && (
                        <>
                            <Text style={[styles.label, { marginTop: 12 }]}>Заметка:</Text>
                            <Text style={styles.noteText}>{action.notes}</Text>
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingTop: 12,
        maxHeight: '70%',
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.border,
        alignSelf: 'center',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        ...Typography.h4,
        color: Colors.textPrimary,
    },
    dateText: {
        ...Typography.bodyS,
        color: Colors.primary,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    label: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
    },
    value: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    statusValue: {
        ...Typography.bodyM,
        fontWeight: '700',
    },
    noteText: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginTop: 8,
    },
});
