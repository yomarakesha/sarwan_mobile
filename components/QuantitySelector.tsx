import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface QuantitySelectorProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export default function QuantitySelector({
    label,
    value,
    onChange,
    min = 0,
    max = 999,
}: QuantitySelectorProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.selectorRow}>
                <View style={styles.valueBox}>
                    <Text style={styles.value}>{value}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => onChange(Math.max(min, value - 1))}
                    style={styles.button}
                    activeOpacity={0.7}
                >
                    <Ionicons name="remove" size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onChange(Math.min(max, value + 1))}
                    style={styles.button}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        ...Typography.bodyS,
        color: Colors.textPrimary,
    },
    selectorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueBox: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginRight: 8,
        minWidth: 56,
        alignItems: 'center',
    },
    value: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    button: {
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
});
