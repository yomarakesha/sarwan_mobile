import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { logout, isLoading, username } = useAuth();
    const insets = useSafeAreaInsets();

    const displayName = username || 'Пользователь';

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    const settingsItems = [
        { icon: 'person-outline' as const, label: 'Профиль', subtitle: displayName },
        { icon: 'language-outline' as const, label: 'Язык', subtitle: 'Русский' },
        { icon: 'notifications-outline' as const, label: 'Уведомления', subtitle: 'Включены' },
        { icon: 'information-circle-outline' as const, label: 'О приложении', subtitle: 'v1.0.0' },
    ];

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Настройки</Text>
                </View>

                {/* Profile card */}
                <Card style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={32} color={Colors.primary} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{displayName}</Text>
                        <Text style={styles.profileRole}>Администратор</Text>
                    </View>
                </Card>

                {/* Settings list */}
                <Card style={styles.settingsCard}>
                    {settingsItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[
                                styles.settingsItem,
                                index < settingsItems.length - 1 && styles.settingsItemBorder,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => Alert.alert('В разработке', `Раздел "${item.label}" будет доступен в следующих обновлениях.`)}
                        >
                            <View style={styles.settingsLeft}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name={item.icon} size={20} color={Colors.primary} />
                                </View>
                                <Text style={styles.settingsLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.settingsRight}>
                                <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
                                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color={Colors.error} />
                    ) : (
                        <>
                            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                            <Text style={styles.logoutText}>Выйти</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: 20,
        marginBottom: 20,
    },
    title: {
        ...Typography.h3,
        color: Colors.textPrimary,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        ...Typography.h5,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    profileRole: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
    },
    settingsCard: {
        padding: 0,
        marginBottom: 20,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingsItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    settingsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingsLabel: {
        ...Typography.bodyM,
        color: Colors.textPrimary,
    },
    settingsRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    settingsSubtitle: {
        ...Typography.bodyS,
        color: Colors.textSecondary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.errorLight,
        padding: 14,
        borderRadius: 12,
        gap: 8,
    },
    logoutText: {
        ...Typography.button,
        color: Colors.error,
        fontWeight: '600',
    },
});
