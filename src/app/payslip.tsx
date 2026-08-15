import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Delete, Wallet } from 'lucide-react-native';

const PIN_LENGTH = 6;

const KEYPAD_ROWS: (string | 'backspace' | null)[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [null, '0', 'backspace'],
];

export default function PayslipScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#17181C';
  const buttonBg = isDark ? '#FFFFFF' : '#17181C';
  const buttonTextColor = isDark ? '#17181C' : '#FFFFFF';

  const [pin, setPin] = useState('');
  const isComplete = pin.length === PIN_LENGTH;

  const handleDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;
    setPin((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!isComplete) return;
    router.back();
  };

  return (
    <View className="flex-1 bg-[#F2F3F5] dark:bg-primary-958">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center px-4 pt-2">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <Text className="flex-1 text-center font-quicksand-semibold text-lg text-primary-900 dark:text-white">
            Payslip
          </Text>
          <View className="h-10 w-10" />
        </View>
      </SafeAreaView>

      <View className="items-center px-8 pt-6">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-928 dark:bg-white">
          <Wallet size={26} color={isDark ? '#17181C' : '#FFFFFF'} />
        </View>

        <Text className="mt-4 font-quicksand-semibold text-xl text-primary-900 dark:text-white">
          Enter PIN
        </Text>
        <Text className="mt-2 text-center font-quicksand text-sm leading-5 text-primary-500">
          For security purposes, before accessing your payslip, you need to enter your PIN
        </Text>

        <View className="mt-6 flex-row gap-2">
          {Array.from({ length: PIN_LENGTH }).map((_, index) => {
            const filled = index < pin.length;
            const isLast = index === pin.length - 1;
            return (
              <View
                key={index}
                className={`h-14 w-12 items-center justify-center rounded-2xl border ${
                  filled ? 'border-primary-900 dark:border-white' : 'border-primary-300 dark:border-primary-700'
                }`}
              >
                {filled && (
                  <Text className="font-quicksand-bold text-lg text-primary-900 dark:text-white">
                    {isLast ? pin[index] : '•'}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View className="mt-auto rounded-t-[32px] bg-white px-8 pb-6 pt-8 dark:bg-primary-928">
        <View className="gap-5">
          {KEYPAD_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row items-center justify-between">
              {row.map((key, keyIndex) => {
                if (key === null) {
                  return <View key={keyIndex} className="h-14 w-14" />;
                }

                if (key === 'backspace') {
                  return (
                    <Pressable
                      key={keyIndex}
                      onPress={handleBackspace}
                      hitSlop={8}
                      className="h-14 w-14 items-center justify-center rounded-2xl border border-primary-300 active:opacity-70 dark:border-primary-700"
                    >
                      <Delete size={20} color={iconColor} />
                    </Pressable>
                  );
                }

                return (
                  <Pressable
                    key={keyIndex}
                    onPress={() => handleDigit(key)}
                    hitSlop={8}
                    className="h-14 w-14 items-center justify-center active:opacity-60"
                  >
                    <Text className="font-quicksand-semibold text-2xl text-primary-900 dark:text-white">
                      {key}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={!isComplete}
          className="mt-8 items-center rounded-full py-4 active:opacity-90"
          style={{ backgroundColor: isComplete ? buttonBg : '#DBDCE0' }}
        >
          <Text
            className="font-quicksand-semibold text-base"
            style={{ color: isComplete ? buttonTextColor : '#81868C' }}
          >
            Submit
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
