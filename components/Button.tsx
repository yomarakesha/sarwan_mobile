import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    icon,
    loading = false,
    disabled = false,
    style,
    textStyle,
    fullWidth = true,
}: ButtonProps) {
    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: disabled ? '#A0AEC0' : Colors.primary,
                    borderWidth: 0,
                };
            case 'secondary':
                return {
                    backgroundColor: Colors.primaryLight,
                    borderWidth: 0,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: Colors.primary,
                };
            case 'success':
                return {
                    backgroundColor: Colors.success,
                    borderWidth: 0,
                };
            case 'danger':
                return {
                    backgroundColor: Colors.error,
                    borderWidth: 0,
                };
            default:
                return { backgroundColor: Colors.primary };
        }
    };

    const getTextColor = (): string => {
        switch (variant) {
            case 'secondary':
                return Colors.primary;
            case 'outline':
                return Colors.primary;
            default:
                return Colors.textWhite;
        }
    };

    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'small':
                return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'large':
                return { paddingVertical: 16, paddingHorizontal: 24 };
            default:
                return { paddingVertical: 12, paddingHorizontal: 20 };
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.button,
                getVariantStyle(),
                getSizeStyle(),
                fullWidth && styles.fullWidth,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <>
                    {icon && icon}
                    <Text
                        style={[
                            Typography.button,
                            { color: getTextColor() },
                            icon ? { marginLeft: 8 } : {},
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    fullWidth: {
        width: '100%',
    },
});
