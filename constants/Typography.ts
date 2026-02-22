/**
 * Sarwan Design System — Typography
 * Font: Inter (matches design system sheet)
 */

import { TextStyle } from 'react-native';

type TypographyStyles = {
    [key: string]: TextStyle;
};

const Typography: TypographyStyles = {
    h1: {
        fontFamily: 'Inter_700Bold',
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 42,
    },
    h2: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 22,
        fontWeight: '600',
        lineHeight: 30,
    },
    h3: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
    },
    h4: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 26,
    },
    h5: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
    },
    h6: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 22,
    },
    bodyL: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 25,
    },
    bodyM: {
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 22,
    },
    bodyS: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 21,
    },
    caption: {
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18,
    },
    micro: {
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
    },
    button: {
        fontFamily: 'Inter_500Medium',
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20,
    },
    label: {
        fontFamily: 'Inter_500Medium',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 19,
    },
    tag: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
    },
};

export default Typography;

