import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Path, Svg } from 'react-native-svg';
import { ArrowLeft, Download } from 'lucide-react-native';

const CARD_COLOR = '#17181C';

const PAYSLIP = {
  employee: {
    name: 'Mike Cooper',
    role: 'Marketing officer',
    employeeId: 'DE3824-MO4',
    avatarUrl: 'https://i.pravatar.cc/150?u=mike.cooper@hia.com',
  },
  month: 'DEC',
  period: 'September 2023',
  earnings: [
    { label: 'Basic salary', amount: 2500 },
    { label: 'Overtime pay', note: '12 hours x $45', amount: 540 },
    { label: 'Bonuses', amount: 100 },
    { label: 'Reimbursements', amount: 61 },
  ],
  totalEarnings: 3201,
  deductions: [
    { label: 'Income tax', amount: 30 },
    { label: 'Health Insurance', amount: 45 },
    { label: 'Retirement Contributions', amount: 35 },
    { label: 'Loan Repayments', amount: 75 },
  ],
  totalDeductions: 195,
  netSalary: 3006,
};

function formatAmount(value: number) {
  return `$${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ZigzagEdge({ color, teeth = 16, height = 14 }: { color: string; teeth?: number; height?: number }) {
  const step = 100 / teeth;
  const points = ['M0,0'];
  for (let i = 0; i < teeth; i++) {
    points.push(`L${step * i + step / 2},${height} L${step * (i + 1)},0`);
  }
  points.push('Z');

  return (
    <Svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <Path d={points.join(' ')} fill={color} />
    </Svg>
  );
}

export default function PayslipScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#17181C';
  const buttonBg = isDark ? '#FFFFFF' : '#17181C';
  const buttonTextColor = isDark ? '#17181C' : '#FFFFFF';

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

      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerClassName="px-6 pb-8 pt-2">
        <View className="overflow-hidden rounded-t-3xl" style={{ backgroundColor: CARD_COLOR }}>
          <View className="flex-row items-center justify-between px-5 pt-5">
            <View className="flex-1 flex-row items-center gap-3">
              <Image source={{ uri: PAYSLIP.employee.avatarUrl }} className="h-12 w-12 rounded-full" />
              <View className="flex-1">
                <Text className="font-quicksand-semibold text-base text-white">{PAYSLIP.employee.name}</Text>
                <Text className="font-quicksand text-sm text-primary-400">{PAYSLIP.employee.role}</Text>
                <Text className="font-quicksand text-xs text-primary-500">{PAYSLIP.employee.employeeId}</Text>
              </View>
            </View>
            <Pressable
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full bg-white active:opacity-80"
            >
              <Download size={16} color="#17181C" />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between px-5 pb-4 pt-4">
            <Text className="font-quicksand-semibold text-sm text-primary-400">{PAYSLIP.month}</Text>
            <View className="rounded-full bg-white/10 px-4 py-1.5">
              <Text className="font-quicksand-medium text-xs text-white">{PAYSLIP.period}</Text>
            </View>
          </View>

          <View className="relative">
            <View
              className="absolute -left-3 h-6 w-6 rounded-full bg-[#F2F3F5] dark:bg-primary-958"
              style={{ top: -3 }}
            />
            <View
              className="absolute -right-3 h-6 w-6 rounded-full bg-[#F2F3F5] dark:bg-primary-958"
              style={{ top: -3 }}
            />
            <View className="mx-5 border-t border-dashed border-white/20" />
          </View>

          <View className="px-5 pt-5">
            <Text className="font-quicksand-semibold text-base text-white">Earnings</Text>
            <View className="mt-3 gap-3">
              {PAYSLIP.earnings.map((row) => (
                <View key={row.label} className="flex-row items-start justify-between">
                  <View>
                    <Text className="font-quicksand text-sm text-primary-300">{row.label}</Text>
                    {row.note && (
                      <Text className="font-quicksand text-[11px] text-primary-600">{row.note}</Text>
                    )}
                  </View>
                  <Text className="font-quicksand-medium text-sm text-white">{formatAmount(row.amount)}</Text>
                </View>
              ))}
            </View>
            <View className="mt-3 flex-row items-center justify-between border-t border-white/10 pt-3">
              <Text className="font-quicksand-bold text-sm text-white">Total earnings</Text>
              <Text className="font-quicksand-bold text-sm text-white">{formatAmount(PAYSLIP.totalEarnings)}</Text>
            </View>
          </View>

          <View className="px-5 pt-6">
            <Text className="font-quicksand-semibold text-base text-white">Deductions</Text>
            <View className="mt-3 gap-3">
              {PAYSLIP.deductions.map((row) => (
                <View key={row.label} className="flex-row items-center justify-between">
                  <Text className="font-quicksand text-sm text-primary-300">{row.label}</Text>
                  <Text className="font-quicksand-medium text-sm text-white">{formatAmount(row.amount)}</Text>
                </View>
              ))}
            </View>
            <View className="mt-3 flex-row items-center justify-between border-t border-white/10 pt-3">
              <Text className="font-quicksand-bold text-sm text-white">Total deductions</Text>
              <Text className="font-quicksand-bold text-sm text-white">{formatAmount(PAYSLIP.totalDeductions)}</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between border-t border-white/10 px-5 py-5">
            <Text className="font-quicksand-semibold text-base text-white">Net Salary</Text>
            <Text className="font-quicksand-bold text-xl text-white">{formatAmount(PAYSLIP.netSalary)}</Text>
          </View>
        </View>

        <ZigzagEdge color={CARD_COLOR} />

        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          className="mt-6 items-center rounded-full py-4 active:opacity-90"
          style={{ backgroundColor: buttonBg }}
        >
          <Text className="font-quicksand-semibold text-base" style={{ color: buttonTextColor }}>
            Done
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
