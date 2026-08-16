import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Check } from 'lucide-react-native';

const TERMS = [
  'You are required to provide a notice period as stipulated in your contract.',
  'You are encouraged to participate in an exit interview to provide valuable feedback',
  'You must return all company property, including but not limited to access cards, etc.',
  'You are required to complete the clearance procedure as outlined by the HR department',
];

export default function ResignScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#17181C';
  const buttonBg = isDark ? '#FFFFFF' : '#17181C';
  const buttonTextColor = isDark ? '#17181C' : '#FFFFFF';

  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleClose = () => {
    setConfirmOpen(false);
    setAcknowledged(false);
  };

  const handleConfirm = () => {
    if (!acknowledged) return;
    handleClose();
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <View className="flex-1 bg-[#F2F3F5] dark:bg-primary-958">
      <SafeAreaView edges={['top']} className="bg-white dark:bg-primary-928">
        <View className="flex-row items-center px-4 pb-3 pt-2">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <Text className="flex-1 text-center font-quicksand-semibold text-lg text-primary-900 dark:text-white">
            Resign
          </Text>
          <View className="h-10 w-10" />
        </View>
      </SafeAreaView>

      <View className="flex-1 items-center justify-center px-10">
        <Image source={require('@/assets/emptystate.png')} className="h-32 w-32" resizeMode="contain" />
        <Text className="mt-6 text-center font-quicksand-medium text-sm leading-5 text-primary-500 dark:text-primary-400">
          Fiuh... you haven&apos;t submit any resign letter.{'\n'}Be happy on your work!
        </Text>
      </View>

      <View className="bg-white px-6 pb-6 pt-4 dark:bg-primary-928">
        <Pressable
          onPress={() => setConfirmOpen(true)}
          className="items-center rounded-full py-4 active:opacity-90"
          style={{ backgroundColor: buttonBg }}
        >
          <Text className="font-quicksand-semibold text-base" style={{ color: buttonTextColor }}>
            Submit Resign Letter
          </Text>
        </Pressable>
      </View>

      <Modal visible={isConfirmOpen} transparent animationType="slide" onRequestClose={handleClose}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={handleClose}>
          <Pressable
            className="rounded-t-3xl bg-white px-6 pb-6 pt-6 dark:bg-primary-928"
            onPress={(event) => event.stopPropagation()}
          >
            <Text className="font-quicksand-semibold text-lg leading-6 text-primary-900 dark:text-white">
              Read this carefully before submitting your resign letter
            </Text>

            <ScrollView className="mt-4 max-h-72" showsVerticalScrollIndicator={false}>
              <View className="gap-4">
                {TERMS.map((term) => (
                  <View key={term} className="flex-row items-start gap-3">
                    <View className="mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-primary-900 dark:bg-white">
                      <Check size={12} color={isDark ? '#17181C' : '#FFFFFF'} strokeWidth={3} />
                    </View>
                    <Text className="flex-1 font-quicksand text-sm leading-5 text-primary-500 dark:text-primary-400">
                      {term}
                    </Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={() => setAcknowledged((prev) => !prev)}
                className="mt-5 flex-row items-start gap-3 active:opacity-80"
              >
                <View
                  className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border"
                  style={{
                    backgroundColor: acknowledged ? buttonBg : 'transparent',
                    borderColor: acknowledged ? buttonBg : isDark ? '#3C4043' : '#DBDCE0',
                  }}
                >
                  {acknowledged && <Check size={12} color={buttonTextColor} strokeWidth={3} />}
                </View>
                <Text className="flex-1 font-quicksand text-xs leading-5 text-primary-500 dark:text-primary-400">
                  By submitting your resignation, you acknowledge that you have read and understood the terms and
                  conditions outlined above
                </Text>
              </Pressable>
            </ScrollView>

            <View className="mt-6 flex-row gap-3">
              <Pressable
                onPress={handleClose}
                className="flex-1 items-center rounded-full py-4 active:opacity-90"
                style={{ backgroundColor: buttonBg }}
              >
                <Text className="font-quicksand-semibold text-base" style={{ color: buttonTextColor }}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                disabled={!acknowledged}
                className="flex-1 items-center rounded-full border py-4 active:opacity-90"
                style={{
                  borderColor: acknowledged ? (isDark ? '#FFFFFF' : '#17181C') : isDark ? '#3C4043' : '#DBDCE0',
                }}
              >
                <Text
                  className="font-quicksand-semibold text-base"
                  style={{ color: acknowledged ? (isDark ? '#FFFFFF' : '#17181C') : '#9BA0A6' }}
                >
                  Yes, I Will
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
