import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ChartPie, House, Hourglass, Scan, User } from 'lucide-react-native';

import { getHasSession } from '@/lib/auth';
import { getHasSeenOnboarding } from '@/lib/onboarding';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';
  const activeColor = isDark ? '#FFFFFF' : '#17181C';
  const inactiveColor = '#9BA0A6';
  const barBackground = isDark ? '#17181C' : '#FFFFFF';
  const scanButtonBg = isDark ? '#FFFFFF' : '#17181C';
  const scanIconColor = isDark ? '#17181C' : '#FFFFFF';

  if (!getHasSeenOnboarding()) {
    return <Redirect href="/onboarding" />;
  }

  if (!getHasSession()) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: { fontFamily: 'Quicksand_600SemiBold', fontSize: 11 },
        tabBarStyle: {
          backgroundColor: barBackground,
          borderTopWidth: 0,
          height: 58 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom + 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          
          // shadowColor: '#000000',
          // shadowOpacity: 0.1,
          // shadowRadius: 10,
          // shadowOffset: { width: 0, height: -4 },
          // elevation: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <House color={color} size={size} fill={focused ? color : 'none'} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytic"
        options={{
          title: 'Analytic',
          tabBarIcon: ({ color, size }) => <ChartPie color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="attend"
        options={{
          title: 'Attend',
          tabBarIcon: () => (
            <View
              className="h-14 w-14 items-center justify-center rounded-full"
              style={{
                marginTop: -28,
                backgroundColor: scanButtonBg,
                shadowColor: '#000000',
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
              }}
            >
              <Scan color={scanIconColor} size={22} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <Hourglass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused, size }) => (
            <User color={color} size={size} fill={focused ? color : 'none'} />
          ),
        }}
      />
    </Tabs>
  );
}
