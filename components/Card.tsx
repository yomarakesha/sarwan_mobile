import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ children, style, variant = 'default' }: CardProps) {
    return (
        <View style={[styles.card, variant === 'elevated' && styles.elevated, variant === 'outlined' && styles.outlined, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    elevated: {
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 4,
    },
    outlined: {
        shadowOpacity: 0,
        elevation: 0,
        borderWidth: 1,
        borderColor: Colors.border,
    },
});
