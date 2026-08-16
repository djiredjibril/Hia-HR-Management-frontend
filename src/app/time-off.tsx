import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Calendar, ChevronDown, ChevronLeft, ChevronRight, CirclePlus, Paperclip, X } from 'lucide-react-native';

const CATEGORIES = ['Sick', 'Vacation', 'Maternity', 'Personal Matters'] as const;
type Category = (typeof CATEGORIES)[number];

const MAX_DESCRIPTION_LENGTH = 2000;

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function buildTimeOptions() {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      options.push(`${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`);
    }
  }
  return options;
}

const TIME_OPTIONS = buildTimeOptions();

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function TimeOffScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#17181C';
  const buttonBg = isDark ? '#FFFFFF' : '#17181C';
  const buttonTextColor = isDark ? '#17181C' : '#FFFFFF';
  const mutedIconColor = '#9BA0A6';

  const [category, setCategory] = useState<Category>('Sick');
  const [startDate, setStartDate] = useState(() => new Date());
  const [startTime, setStartTime] = useState('12:00 PM');
  const [endTime, setEndTime] = useState('01:00 PM');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(startDate.getFullYear(), startDate.getMonth(), 1));
  const [timePickerField, setTimePickerField] = useState<'start' | 'end' | null>(null);

  const canSubmit = description.trim().length > 0;

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(year, month);
    const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
    for (let day = 1; day <= totalDays; day++) cells.push(day);
    return cells;
  }, [calendarMonth]);

  const handleSelectDay = (day: number) => {
    setStartDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day));
    setDatePickerOpen(false);
  };

  const handleAddAttachment = () => {
    setAttachments((prev) => [...prev, `Document-${prev.length + 1}.pdf`]);
  };

  const handleRemoveAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((item) => item !== name));
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
            Time Off
          </Text>
          <View className="h-10 w-10" />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerClassName="pb-32">
        <View className="bg-white px-6 py-5 dark:bg-primary-928">
          <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
            Select a category
          </Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {CATEGORIES.map((item) => {
              const selected = item === category;
              return (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  className="rounded-full border px-4 py-2.5 active:opacity-80"
                  style={{
                    backgroundColor: selected ? buttonBg : 'transparent',
                    borderColor: selected ? buttonBg : isDark ? '#3C4043' : '#DBDCE0',
                  }}
                >
                  <Text
                    className="font-quicksand-medium text-sm"
                    style={{ color: selected ? buttonTextColor : isDark ? '#BDC0C5' : '#5F6267' }}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-2.5 bg-white px-6 py-5 dark:bg-primary-928">
          <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
            Set the duration
          </Text>

          <Text className="mt-4 font-quicksand-medium text-sm text-primary-600 dark:text-primary-400">
            Start date
          </Text>
          <Pressable
            onPress={() => {
              setCalendarMonth(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
              setDatePickerOpen(true);
            }}
            className="mt-2 flex-row items-center justify-between rounded-2xl border border-primary-300 px-4 py-3.5 active:opacity-80 dark:border-primary-800"
          >
            <Text className="font-quicksand text-sm text-primary-900 dark:text-white">
              {formatDate(startDate)}
            </Text>
            <Calendar size={18} color={mutedIconColor} />
          </Pressable>

          <View className="mt-4 flex-row gap-3">
            <View className="flex-1">
              <Text className="font-quicksand-medium text-sm text-primary-600 dark:text-primary-400">
                Start Time
              </Text>
              <Pressable
                onPress={() => setTimePickerField('start')}
                className="mt-2 flex-row items-center justify-between rounded-2xl border border-primary-300 px-4 py-3.5 active:opacity-80 dark:border-primary-800"
              >
                <Text className="font-quicksand text-sm text-primary-900 dark:text-white">{startTime}</Text>
                <ChevronDown size={18} color={mutedIconColor} />
              </Pressable>
            </View>
            <View className="flex-1">
              <Text className="font-quicksand-medium text-sm text-primary-600 dark:text-primary-400">
                End Time
              </Text>
              <Pressable
                onPress={() => setTimePickerField('end')}
                className="mt-2 flex-row items-center justify-between rounded-2xl border border-primary-300 px-4 py-3.5 active:opacity-80 dark:border-primary-800"
              >
                <Text className="font-quicksand text-sm text-primary-900 dark:text-white">{endTime}</Text>
                <ChevronDown size={18} color={mutedIconColor} />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="mt-2.5 bg-white px-6 py-5 dark:bg-primary-928">
          <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text.slice(0, MAX_DESCRIPTION_LENGTH))}
            placeholder="write your complete reason here..."
            placeholderTextColor="#9BA0A6"
            multiline
            textAlignVertical="top"
            className="mt-3 h-32 rounded-2xl border border-primary-300 px-4 py-3.5 font-quicksand text-sm text-primary-900 dark:border-primary-800 dark:text-white"
          />
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="font-quicksand text-xs text-primary-500">maximum 2000 character</Text>
            <Text className="font-quicksand text-xs text-primary-500">
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </Text>
          </View>
        </View>

        <View className="mt-2.5 bg-white px-6 py-5 dark:bg-primary-928">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
              Attachment
            </Text>
            <Text className="font-quicksand text-xs text-primary-500">(optional)</Text>
          </View>

          {attachments.length > 0 && (
            <View className="mt-3 gap-2">
              {attachments.map((name) => (
                <View
                  key={name}
                  className="flex-row items-center justify-between rounded-2xl border border-primary-300 px-4 py-3 dark:border-primary-800"
                >
                  <View className="flex-1 flex-row items-center gap-2.5">
                    <Paperclip size={16} color={mutedIconColor} />
                    <Text numberOfLines={1} className="flex-1 font-quicksand text-sm text-primary-900 dark:text-white">
                      {name}
                    </Text>
                  </View>
                  <Pressable onPress={() => handleRemoveAttachment(name)} hitSlop={8}>
                    <X size={16} color={mutedIconColor} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handleAddAttachment}
            className="mt-3 flex-row items-center justify-center gap-2 rounded-full border border-primary-800 py-3.5 active:opacity-80 dark:border-white"
          >
            <CirclePlus size={18} color={isDark ? '#FFFFFF' : '#17181C'} />
            <Text className="font-quicksand-semibold text-sm text-primary-900 dark:text-white">Upload files</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View className="absolute inset-x-0 bottom-0 bg-white px-6 pb-6 pt-4 dark:bg-primary-928">
        <Pressable
          onPress={() => {
            if (!canSubmit) return;
            if (router.canGoBack()) router.back();
            else router.replace('/');
          }}
          disabled={!canSubmit}
          className="items-center rounded-full py-4 active:opacity-90"
          style={{ backgroundColor: canSubmit ? buttonBg : '#DBDCE0' }}
        >
          <Text className="font-quicksand-semibold text-base" style={{ color: canSubmit ? buttonTextColor : '#81868C' }}>
            Submit time off request
          </Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>

      <Modal visible={isDatePickerOpen} transparent animationType="fade" onRequestClose={() => setDatePickerOpen(false)}>
        <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={() => setDatePickerOpen(false)}>
          <Pressable className="w-full rounded-3xl bg-white p-5 dark:bg-primary-928" onPress={(event) => event.stopPropagation()}>
            <View className="flex-row items-center justify-between">
              <Pressable
                hitSlop={8}
                onPress={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
              >
                <ChevronLeft size={18} color={iconColor} />
              </Pressable>
              <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <Pressable
                hitSlop={8}
                onPress={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
              >
                <ChevronRight size={18} color={iconColor} />
              </Pressable>
            </View>

            <View className="mt-4 flex-row">
              {WEEKDAY_LABELS.map((label, index) => (
                <View key={`${label}-${index}`} className="flex-1 items-center">
                  <Text className="font-quicksand-medium text-xs text-primary-500">{label}</Text>
                </View>
              ))}
            </View>

            <View className="mt-2 flex-row flex-wrap">
              {calendarDays.map((day, index) => {
                const isSelected =
                  day !== null &&
                  startDate.getFullYear() === calendarMonth.getFullYear() &&
                  startDate.getMonth() === calendarMonth.getMonth() &&
                  startDate.getDate() === day;
                return (
                  <View key={index} style={{ width: `${100 / 7}%` }} className="items-center py-1">
                    {day !== null ? (
                      <Pressable
                        onPress={() => handleSelectDay(day)}
                        className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
                        style={{ backgroundColor: isSelected ? buttonBg : 'transparent' }}
                      >
                        <Text
                          className="font-quicksand-medium text-sm"
                          style={{ color: isSelected ? buttonTextColor : isDark ? '#FFFFFF' : '#202125' }}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    ) : (
                      <View className="h-9 w-9" />
                    )}
                  </View>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={timePickerField !== null} transparent animationType="fade" onRequestClose={() => setTimePickerField(null)}>
        <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={() => setTimePickerField(null)}>
          <Pressable
            className="max-h-[70%] w-full rounded-3xl bg-white p-5 dark:bg-primary-928"
            onPress={(event) => event.stopPropagation()}
          >
            <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
              Select {timePickerField === 'start' ? 'start' : 'end'} time
            </Text>
            <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
              {TIME_OPTIONS.map((option) => {
                const selected = timePickerField === 'start' ? option === startTime : option === endTime;
                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      if (timePickerField === 'start') setStartTime(option);
                      else setEndTime(option);
                      setTimePickerField(null);
                    }}
                    className="rounded-xl px-3 py-3 active:opacity-70"
                    style={{ backgroundColor: selected ? (isDark ? '#3C4043' : '#F2F3F5') : 'transparent' }}
                  >
                    <Text
                      className="font-quicksand-medium text-sm"
                      style={{ color: selected ? (isDark ? '#FFFFFF' : '#17181C') : isDark ? '#BDC0C5' : '#5F6267' }}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
