import { useMemo, useState } from 'react';
import { LayoutChangeEvent, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Circle, Defs, LinearGradient, Line as SvgLine, Path, Stop, Svg } from 'react-native-svg';
import { ChevronDown, ChevronLeft, ChevronRight, Download, TrendingUp } from 'lucide-react-native';

type Range = '1W' | '1M' | '1Y';

const RANGES: Range[] = ['1W', '1M', '1Y'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RANGE_DATA: Record<
  Range,
  {
    percentage: string;
    delta: string;
    lastPeriodLabel: string;
    labels: string[];
    values: number[];
    peakLabel: string;
    peakLabelIndex: number;
  }
> = {
  '1W': {
    percentage: '96.1%',
    delta: '2.8%',
    lastPeriodLabel: 'Last week : 93.3%',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [0.5, 0.3, 0.55, 0.35, 0.5, 0.85, 0.4, 0.6, 0.45],
    peakLabel: '07:52 AM',
    peakLabelIndex: 5,
  },
  '1M': {
    percentage: '97.5%',
    delta: '5.2%',
    lastPeriodLabel: 'Last month : 92.5%',
    labels: ['W1', 'W2', 'W3', 'W4'],
    values: [0.5, 0.3, 0.55, 0.35, 0.5, 0.85, 0.4, 0.6, 0.45],
    peakLabel: '08:01 AM',
    peakLabelIndex: 5,
  },
  '1Y': {
    percentage: '94.8%',
    delta: '3.6%',
    lastPeriodLabel: 'Last year : 91.2%',
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    values: [0.45, 0.6, 0.4, 0.55, 0.35, 0.85, 0.5, 0.65, 0.4],
    peakLabel: '08:14 AM',
    peakLabelIndex: 5,
  },
};

const KPI = { presence: '23', absence: '0', late: '1.2h' };

const CHART_HEIGHT = 130;
const CHART_TOP_PADDING = 34;
const CHART_BOTTOM_PADDING = 4;

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function AnalyticScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#17181C';
  const activeBg = isDark ? '#FFFFFF' : '#17181C';
  const activeTextColor = isDark ? '#17181C' : '#FFFFFF';
  const mutedIconColor = '#9BA0A6';

  const [selectedMonth, setSelectedMonth] = useState(() => new Date(2023, 8, 1));
  const [isMonthPickerOpen, setMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => selectedMonth.getFullYear());

  const [range, setRange] = useState<Range>('1M');
  const [chartWidth, setChartWidth] = useState(0);

  const data = RANGE_DATA[range];

  const points = useMemo(() => {
    if (chartWidth === 0) return [];
    const innerHeight = CHART_HEIGHT - CHART_TOP_PADDING - CHART_BOTTOM_PADDING;
    return data.values.map((value, index) => ({
      x: (index / (data.values.length - 1)) * chartWidth,
      y: CHART_TOP_PADDING + (1 - value) * innerHeight,
    }));
  }, [chartWidth, data.values]);

  const linePath = useMemo(() => buildSmoothPath(points), [points]);
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const last = points[points.length - 1];
    const first = points[0];
    return `${linePath} L ${last.x} ${CHART_HEIGHT} L ${first.x} ${CHART_HEIGHT} Z`;
  }, [linePath, points]);

  const peakPoint = points[data.peakLabelIndex];

  const handleChartLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  };

  const openMonthPicker = () => {
    setPickerYear(selectedMonth.getFullYear());
    setMonthPickerOpen(true);
  };

  const handleSelectMonth = (monthIndex: number) => {
    setSelectedMonth(new Date(pickerYear, monthIndex, 1));
    setMonthPickerOpen(false);
  };

  return (
    <View className="flex-1 bg-[#F2F3F5] dark:bg-primary-958">
      <SafeAreaView edges={['top']} className="bg-[#F2F3F5] dark:bg-primary-958">
        <View className="items-center px-4 pb-2 pt-2">
          <Text className="font-quicksand-semibold text-lg text-primary-900 dark:text-white">Analytics</Text>
        </View>
      </SafeAreaView>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-10">
        <View className="rounded-3xl bg-white px-5 py-5 shadow-sm shadow-black/5 dark:bg-primary-846">
          <View className="flex-row items-center justify-between">
            <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
              Monthly Accumulation
            </Text>
            <Pressable
              onPress={openMonthPicker}
              className="flex-row items-center gap-1.5 rounded-full px-4 py-2 active:opacity-80"
              style={{ backgroundColor: activeBg }}
            >
              <Text className="font-quicksand-medium text-xs" style={{ color: activeTextColor }}>
                {MONTH_NAMES[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </Text>
              <ChevronDown size={14} color={activeTextColor} />
            </Pressable>
          </View>

          <View className="mt-5 flex-row items-center">
            <View className="flex-1 items-center gap-1.5">
              <Text className="font-quicksand text-xs text-primary-500">Presence</Text>
              <Text className="font-quicksand-bold text-2xl text-primary-900 dark:text-white">{KPI.presence}</Text>
            </View>
            <View className="h-10 w-px bg-primary-100 dark:bg-primary-800" />
            <View className="flex-1 items-center gap-1.5">
              <Text className="font-quicksand text-xs text-primary-500">Absence</Text>
              <Text className="font-quicksand-bold text-2xl text-primary-900 dark:text-white">{KPI.absence}</Text>
            </View>
            <View className="h-10 w-px bg-primary-100 dark:bg-primary-800" />
            <View className="flex-1 items-center gap-1.5">
              <Text className="font-quicksand text-xs text-primary-500">Late</Text>
              <Text className="font-quicksand-bold text-2xl text-primary-900 dark:text-white">{KPI.late}</Text>
            </View>
          </View>
        </View>

        <View className="mt-4 rounded-3xl bg-white px-5 py-5 shadow-sm shadow-black/5 dark:bg-primary-846">
          <View className="flex-row items-center justify-between">
            <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">Attendence</Text>
            <View className="flex-row items-center gap-2">
              {RANGES.map((item) => {
                const selected = item === range;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setRange(item)}
                    className="h-9 w-9 items-center justify-center rounded-full border active:opacity-80"
                    style={{
                      backgroundColor: selected ? activeBg : 'transparent',
                      borderColor: selected ? activeBg : isDark ? '#3C4043' : '#DBDCE0',
                    }}
                  >
                    <Text
                      className="font-quicksand-semibold text-[10px]"
                      style={{ color: selected ? activeTextColor : isDark ? '#BDC0C5' : '#5F6267' }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="font-quicksand-bold text-3xl text-primary-900 dark:text-white">{data.percentage}</Text>
              <View className="flex-row items-center gap-1 rounded-full bg-success-50 px-2 py-1">
                <TrendingUp size={12} color="#15803D" strokeWidth={2.5} />
                <Text className="font-quicksand-semibold text-xs text-success-700">{data.delta}</Text>
              </View>
            </View>
            <Text className="font-quicksand text-xs text-primary-500">{data.lastPeriodLabel}</Text>
          </View>

          <View className="mt-5" onLayout={handleChartLayout}>
            {chartWidth > 0 && (
              <View>
                {peakPoint && (
                  <View
                    pointerEvents="none"
                    className="absolute items-center rounded-lg bg-primary-900 px-2.5 py-1.5 dark:bg-white"
                    style={{ left: peakPoint.x - 34, top: Math.max(peakPoint.y - 36, 0), width: 68 }}
                  >
                    <Text
                      className="font-quicksand-semibold text-[10px]"
                      style={{ color: isDark ? '#17181C' : '#FFFFFF' }}
                    >
                      {data.peakLabel}
                    </Text>
                  </View>
                )}

                <Svg width={chartWidth} height={CHART_HEIGHT}>
                  <Defs>
                    <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor={isDark ? '#FFFFFF' : '#17181C'} stopOpacity={0.18} />
                      <Stop offset="1" stopColor={isDark ? '#FFFFFF' : '#17181C'} stopOpacity={0} />
                    </LinearGradient>
                  </Defs>
                  {peakPoint && (
                    <SvgLine
                      x1={peakPoint.x}
                      y1={peakPoint.y}
                      x2={peakPoint.x}
                      y2={CHART_HEIGHT}
                      stroke={isDark ? '#3C4043' : '#DBDCE0'}
                      strokeWidth={1}
                      strokeDasharray="3,4"
                    />
                  )}
                  <Path d={areaPath} fill="url(#areaGradient)" stroke="none" />
                  <Path d={linePath} fill="none" stroke={isDark ? '#FFFFFF' : '#17181C'} strokeWidth={2} />
                  {peakPoint && <Circle cx={peakPoint.x} cy={peakPoint.y} r={4} fill={iconColor} />}
                </Svg>
              </View>
            )}
          </View>

          <View className="mt-2 flex-row justify-between">
            {data.labels.map((label) => (
              <Text key={label} className="font-quicksand text-xs text-primary-500">
                {label}
              </Text>
            ))}
          </View>
        </View>

        <Text className="mb-3 mt-6 font-quicksand-semibold text-base text-primary-900 dark:text-white">
          Key Perfomance Indicator
        </Text>
        <Pressable className="flex-row items-center justify-center gap-2 rounded-full border border-primary-300 bg-white py-4 active:opacity-80 dark:border-primary-800 dark:bg-primary-846">
          <Text className="font-quicksand-medium text-sm text-primary-900 dark:text-white">
            {MONTH_NAMES[selectedMonth.getMonth()]} - Download
          </Text>
          <Download size={16} color={mutedIconColor} />
        </Pressable>

        <Text className="mb-1 mt-6 font-quicksand-semibold text-base text-primary-900 dark:text-white">
          Attendance Summary
        </Text>
      </ScrollView>

      <Modal
        visible={isMonthPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMonthPickerOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={() => setMonthPickerOpen(false)}
        >
          <Pressable
            className="w-full rounded-3xl bg-white p-5 dark:bg-primary-928"
            onPress={(event) => event.stopPropagation()}
          >
            <View className="flex-row items-center justify-between">
              <Pressable
                hitSlop={8}
                onPress={() => setPickerYear((prev) => prev - 1)}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
              >
                <ChevronLeft size={18} color={iconColor} />
              </Pressable>
              <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
                {pickerYear}
              </Text>
              <Pressable
                hitSlop={8}
                onPress={() => setPickerYear((prev) => prev + 1)}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
              >
                <ChevronRight size={18} color={iconColor} />
              </Pressable>
            </View>

            <View className="mt-4 flex-row flex-wrap">
              {MONTH_SHORT.map((label, index) => {
                const isSelected =
                  selectedMonth.getFullYear() === pickerYear && selectedMonth.getMonth() === index;
                return (
                  <View key={label} style={{ width: '25%' }} className="items-center py-1.5">
                    <Pressable
                      onPress={() => handleSelectMonth(index)}
                      className="h-11 w-16 items-center justify-center rounded-xl active:opacity-70"
                      style={{ backgroundColor: isSelected ? activeBg : 'transparent' }}
                    >
                      <Text
                        className="font-quicksand-medium text-sm"
                        style={{ color: isSelected ? activeTextColor : isDark ? '#FFFFFF' : '#202125' }}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
