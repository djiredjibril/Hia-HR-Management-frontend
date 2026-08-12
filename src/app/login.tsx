import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { EyeIcon, EyeOffIcon, InfoIcon, LinkIcon, LockIcon, MailIcon } from '@/components/icons';
import { markSessionActive } from '@/lib/auth';

import Items from '@/assets/svg/Bg icons/Items.svg';
import ItemsOne from '@/assets/svg/Bg icons/Items-1.svg';
import ItemsTwo from '@/assets/svg/Bg icons/Items-2.svg';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const primaryTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#17181C';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isValid = useMemo(() => EMAIL_REGEX.test(email.trim()) && password.length > 0, [email, password]);

  const handleSubmit = () => {
    if (!isValid) return;
    markSessionActive().then(() => router.replace('/'));
  };

  return (
    <View className="flex-1 bg-primary-958">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View className="h-[230px] overflow-hidden bg-primary-958" pointerEvents="none">
            <Items width={203} height={262} color="#FFFFFF" style={{ position: 'absolute', top: -30, left: 200, opacity: 0.5 }} />
            <ItemsOne width={90} height={212} color="#FFFFFF" style={{ position: 'absolute', top: 5, right: -10, opacity: 0.35 }} />
            <ItemsTwo width={276} height={126} color="#FFFFFF" style={{ position: 'absolute', bottom:100, right: 180, opacity: 0.6 }} />
          </View>

          <View className="-mt-32 px-6">
            <Text className="text-center font-quicksand-bold text-[28px] leading-9 text-white">
              Welcome Back!
            </Text>
            <Text className="mt-2 text-center font-quicksand text-[15px] leading-6 text-primary-400">
              Let&apos;s get you sign in and we will make your work life smoother, together.
            </Text>
          </View>

          <View className="mt-6 flex-1 rounded-t-[32px] bg-white px-6 pb-8 pt-8 dark:bg-primary-928">
            <Text className="font-quicksand text-[15px] leading-6 text-primary-600 dark:text-primary-500">
              Ensure that your account is associated with your company&apos;s email address to
              access our applications.
            </Text>

            <View className="mt-6 flex-row items-center gap-3 rounded-2xl border border-primary-300 px-4 py-3.5 dark:border-primary-800">
              <MailIcon size={20} color="#9BA0A6" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@gmail.com"
                placeholderTextColor="#9BA0A6"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                className="flex-1 font-quicksand text-base text-primary-900 dark:text-white"
              />
            </View>

            <View className="mt-3 flex-row items-center gap-3 rounded-2xl border border-primary-300 px-4 py-3.5 dark:border-primary-800">
              <LockIcon size={20} color="#9BA0A6" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9BA0A6"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                className="flex-1 font-quicksand text-base text-primary-900 dark:text-white"
              />
              <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
                {showPassword ? (
                  <EyeOffIcon size={20} color="#9BA0A6" />
                ) : (
                  <EyeIcon size={20} color="#9BA0A6" />
                )}
              </Pressable>
            </View>

            <Pressable className="mt-5 items-center" hitSlop={8}>
              <Text className="font-quicksand-semibold text-sm text-primary-900 dark:text-white">
                Forgot password?
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              disabled={!isValid}
              className={`mt-5 items-center rounded-full py-4 active:opacity-90 ${
                isValid ? 'bg-primary-928 dark:bg-white' : 'bg-primary-300 dark:bg-primary-800'
              }`}
            >
              <Text
                className={`font-quicksand-semibold text-base ${
                  isValid ? 'text-white dark:text-primary-928' : 'text-primary-600 dark:text-primary-500'
                }`}
              >
                {isValid ? 'Sign In' : 'Next'}
              </Text>
            </Pressable>

            <View className="mt-6 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-primary-200 dark:bg-primary-800" />
              <Text className="font-quicksand text-xs text-primary-500">or continue</Text>
              <View className="h-px flex-1 bg-primary-200 dark:bg-primary-800" />
            </View>

            <Pressable className="mt-6 flex-row items-center justify-center gap-2 rounded-full bg-primary-100 py-4 active:opacity-90 dark:bg-primary-846">
              <LinkIcon size={18} color={primaryTextColor} />
              <Text className="font-quicksand-medium text-base text-primary-900 dark:text-white">
                Sign in With Company&apos;s URL
              </Text>
            </Pressable>

            <View className="mt-auto flex-row items-start gap-2 pt-10">
              <View className="mt-0.5">
                <InfoIcon size={16} color="#9BA0A6" />
              </View>
              <Text className="flex-1 font-quicksand text-xs leading-5 text-primary-500">
                If you encounter issues, please contact your company&apos;s HR department for
                assistance.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SafeAreaView edges={['top']} className="absolute left-0 right-0 top-0" />
    </View>
  );
}
