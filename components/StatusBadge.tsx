import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface StatusBadgeProps {
    status: 'in_transit' | 'waiting' | 'delivered' | 'cancelled' | 'received' | 'transferred';
    size?: 'small' | 'medium';
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    in_transit: { label: 'В пути', color: Colors.infoBlue, bgColor: Colors.infoBlueLight },
    waiting: { label: 'В ожидании', color: Colors.warning, bgColor: Colors.warningLight },
    delivered: { label: 'Доставлено', color: Colors.success, bgColor: Colors.successLight },
    cancelled: { label: 'Отменено', color: Colors.error, bgColor: Colors.errorLight },
    received: { label: 'Принято', color: Colors.success, bgColor: Colors.successLight },
    transferred: { label: 'Передано', color: Colors.error, bgColor: Colors.errorLight },
};

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.waiting;

    return (
        <View style={[styles.badge, { backgroundColor: config.bgColor }, size === 'small' && styles.small]}>
            <Text style={[size === 'small' ? Typography.micro : Typography.tag, { color: config.color, fontWeight: '600' }]}>
                {config.label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    small: {
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
});
