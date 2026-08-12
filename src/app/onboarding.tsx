import { useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { markOnboardingSeen } from '@/lib/onboarding';

import BgIconLeft from '@/assets/svg/Bg icons/bg-icon-left.svg';
import BgIconRightMiddle from '@/assets/svg/Bg icons/bg-icon-right-middle.svg';
import Onboarding1 from '@/assets/svg/Onbording/onbording-1.svg';
import Onboarding2 from '@/assets/svg/Onbording/onbording-2.svg';
import Onboarding3 from '@/assets/svg/Onbording/onbording-3.svg';

const STEPS = [
  {
    Illustration: Onboarding1,
    title: 'Effortless\nAttendance Tracking',
    description:
      "Log your attendance effortlessly. Clock in, clock out - it's that simple. Focus on your work, and we'll take care of the rest",
  },
  {
    Illustration: Onboarding2,
    title: 'Elevate\nYour Performance',
    description:
      'Track your Key Performance Indicators (KPIs), set goals, and visualize your progress. Your career journey just got a whole lot clearer.',
  },
  {
    Illustration: Onboarding3,
    title: 'Seize Work-Life\nBalance',
    description:
      'Need a day off? Planning a holiday? We put time-off requests at your fingertips. Take charge of your work-life balance with us',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length - 1;

  const goToStep = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setStep(index);
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setStep(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const handleNext = () => {
    if (isLastStep) {
      markOnboardingSeen().then(() => router.replace('/'));
      return;
    }
    goToStep(step + 1);
  };

  const handleSkip = () => markOnboardingSeen().then(() => router.replace('/'));

  return (
    <View className="flex-1 bg-white dark:bg-primary-958">
      <View className="absolute inset-0" pointerEvents="none">
        <BgIconLeft
          width={338}
          height={208}
          style={{ position: 'absolute', top: -24, left: -70 }}
        />
        <BgIconRightMiddle
          width={314}
          height={414}
          style={{ position: 'absolute', top: '50%', right: -50 }}
        />
      </View>

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="px-6">
          <View className="flex-row gap-[4px]">
            {STEPS.map((_, index) => (
              <View
                key={index}
                className={`h-1 flex-1 overflow-hidden rounded-full ${
                  index <= step ? 'bg-primary-928 dark:bg-white' : 'bg-[#AAAAAA]'
                }`}
              />
            ))}
          </View>
          <View className="mt-2 h-5 items-end">
            {!isLastStep && (
              <Pressable onPress={handleSkip} hitSlop={8}>
                <Text className="font-quicksand-medium text-sm text-primary-600 dark:text-primary-400">
                  Skip
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
        >
          {STEPS.map(({ Illustration, title, description }, index) => (
            <View key={index} style={{ width }} className="items-center px-6 pt-10">
              <View className="aspect-square w-full max-w-[340px] items-center justify-center">
                <Illustration width="100%" height="100%" />
              </View>
              <Text className="mt-10 text-center font-quicksand-bold text-2xl leading-8 text-primary-900 dark:text-white">
                {title}
              </Text>
              <Text className="mt-3 max-w-[300px] text-center font-quicksand text-[15px] leading-6 text-primary-600 dark:text-primary-500">
                {description}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View className="px-6 pb-2 pt-4">
          <Pressable
            onPress={handleNext}
            className="items-center rounded-full bg-primary-928 py-4 active:opacity-90 dark:bg-white"
          >
            <Text className="font-quicksand-semibold text-base text-white dark:text-primary-928">
              Next
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
