import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    style?: ViewStyle;
    multiline?: boolean;
    numberOfLines?: number;
    editable?: boolean;
    variant?: 'bordered' | 'underline' | 'filled';
}

export default function Input({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    style,
    multiline = false,
    numberOfLines = 1,
    editable = true,
    variant = 'bordered',
}: InputProps) {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    variant === 'underline' && styles.inputUnderline,
                    variant === 'bordered' && styles.input,
                    variant === 'filled' && styles.inputFilled,
                    multiline && { height: numberOfLines * 20 + 24, textAlignVertical: 'top' },
                    !editable && styles.disabled,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={Colors.textPlaceholder}
                secureTextEntry={secureTextEntry}
                multiline={multiline}
                numberOfLines={numberOfLines}
                editable={editable}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        ...Typography.bodyM,
        color: Colors.textPrimary,
    },
    inputUnderline: {
        backgroundColor: Colors.white,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        borderRadius: 0,
        paddingHorizontal: 0,
        paddingVertical: 12,
        ...Typography.bodyM,
        color: Colors.textPrimary,
    },
    inputFilled: {
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        ...Typography.bodyM,
        color: Colors.textPrimary,
    },
    disabled: {
        backgroundColor: Colors.background,
        color: Colors.textSecondary,
    },
});
