import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import SelectModal from '../components/SelectModal';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading, error, clearError } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [langModalVisible, setLangModalVisible] = useState(false);
    const [language, setLanguage] = useState('RU');

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setLocalError('Заполните все поля');
            return;
        }
        setLocalError('');
        clearError();
        const success = await login(username.trim(), password);
        if (success) {
            router.replace('/(tabs)');
        }
    };

    const displayError = localError || error;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Language selector */}
                <View style={styles.langRow}>
                    <TouchableOpacity style={styles.langButton} onPress={() => setLangModalVisible(true)}>
                        <Text style={styles.langText}>{language}</Text>
                        <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/logo-icon.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>SARWAN</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {displayError ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={16} color={Colors.error} />
                            <Text style={styles.errorText}>{displayError}</Text>
                        </View>
                    ) : null}

                    <Input
                        label="Логин"
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setLocalError('');
                        }}
                        placeholder="Введите логин"
                        editable={!isLoading}
                        variant="filled"
                    />
                    <Input
                        label="Пароль"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setLocalError('');
                        }}
                        placeholder="Введите пароль"
                        secureTextEntry
                        editable={!isLoading}
                        variant="filled"
                    />
                    <Button
                        title={isLoading ? '' : 'Войти'}
                        onPress={handleLogin}
                        variant="primary"
                        size="large"
                        disabled={isLoading}
                        icon={isLoading ? <ActivityIndicator size="small" color={Colors.textWhite} /> : undefined}
                    />
                </View>
            </KeyboardAvoidingView>

            <SelectModal
                visible={langModalVisible}
                title="Выберите язык"
                options={[
                    { label: 'Русский', value: 'RU' },
                    { label: 'Turkmen', value: 'TM' }
                ]}
                selectedValue={language}
                onSelect={(val) => setLanguage(val)}
                onClose={() => setLangModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    keyboardView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    langRow: {
        alignItems: 'flex-end',
        marginTop: 16,
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    langText: {
        ...Typography.bodyM,
        color: Colors.textSecondary,
        marginRight: 4,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 48,
    },
    logoImage: {
        width: 72,
        height: 72,
        marginBottom: 16,
    },
    logoText: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.primary,
    },
    form: {
        flex: 1,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.errorLight,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 16,
        gap: 8,
    },
    errorText: {
        ...Typography.bodyS,
        color: Colors.error,
        flex: 1,
    },
});
