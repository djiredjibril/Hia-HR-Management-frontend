import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react-native';

const MAX_DESCRIPTION_LENGTH = 2000;
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function ResignFormScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#17181C';
  const buttonBg = isDark ? '#FFFFFF' : '#17181C';
  const buttonTextColor = isDark ? '#17181C' : '#FFFFFF';
  const mutedIconColor = '#9BA0A6';

  const today = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => {
    const date = new Date(today);
    date.setMonth(date.getMonth() + 3);
    return date;
  }, [today]);

  const [resignationDate, setResignationDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const canSubmit = resignationDate !== null && reason.trim().length > 0;

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(year, month);
    const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
    for (let day = 1; day <= totalDays; day++) cells.push(day);
    return cells;
  }, [calendarMonth]);

  const canGoToPrevMonth =
    calendarMonth.getFullYear() > today.getFullYear() ||
    (calendarMonth.getFullYear() === today.getFullYear() && calendarMonth.getMonth() > today.getMonth());
  const canGoToNextMonth =
    calendarMonth.getFullYear() < maxDate.getFullYear() ||
    (calendarMonth.getFullYear() === maxDate.getFullYear() && calendarMonth.getMonth() < maxDate.getMonth());

  const handleSelectDay = (day: number) => {
    const selected = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    if (selected < today || selected > maxDate) return;
    setResignationDate(selected);
    setDatePickerOpen(false);
  };

  const handleAddAttachment = () => {
    setAttachments((prev) => [...prev, `Resign-letter-${prev.length + 1}.pdf`]);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
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

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerClassName="pb-32">
        <View className="bg-white px-6 py-5 dark:bg-primary-928">
          <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
            Set your resignation date
          </Text>
          <Text className="mt-1.5 font-quicksand text-sm leading-5 text-primary-500 dark:text-primary-400">
            Set the date for up to 3 months in the future, in accordance with the company&apos;s notice period
          </Text>

          <Pressable
            onPress={() => {
              setCalendarMonth(new Date((resignationDate ?? today).getFullYear(), (resignationDate ?? today).getMonth(), 1));
              setDatePickerOpen(true);
            }}
            className="mt-4 flex-row items-center justify-between rounded-2xl border border-primary-300 px-4 py-3.5 active:opacity-80 dark:border-primary-800"
          >
            <Text
              className="font-quicksand text-sm"
              style={{ color: resignationDate ? (isDark ? '#FFFFFF' : '#17181C') : mutedIconColor }}
            >
              {resignationDate ? formatDate(resignationDate) : 'Select the date'}
            </Text>
            <Calendar size={18} color={mutedIconColor} />
          </Pressable>
        </View>

        <View className="mt-2.5 bg-white px-6 py-5 dark:bg-primary-928">
          <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
            Reasons for resignation
          </Text>
          <TextInput
            value={reason}
            onChangeText={(text) => setReason(text.slice(0, MAX_DESCRIPTION_LENGTH))}
            placeholder="write your complete reason here..."
            placeholderTextColor="#9BA0A6"
            multiline
            textAlignVertical="top"
            className="mt-3 h-32 rounded-2xl border border-primary-300 px-4 py-3.5 font-quicksand text-sm text-primary-900 dark:border-primary-800 dark:text-white"
          />
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="font-quicksand text-xs text-primary-500">maximum 2000 character</Text>
            <Text className="font-quicksand text-xs text-primary-500">
              {reason.length}/{MAX_DESCRIPTION_LENGTH}
            </Text>
          </View>
        </View>

        <View className="mt-2.5 bg-white px-6 py-5 dark:bg-primary-928">
          <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
            Upload resign letter
          </Text>
          <Text className="mt-1.5 font-quicksand text-sm leading-5 text-primary-500 dark:text-primary-400">
            Company requires a resignation letter to assess the seriousness of the decision to resign.
          </Text>

          {attachments.length > 0 && (
            <View className="mt-3 gap-2">
              {attachments.map((name) => (
                <View
                  key={name}
                  className="flex-row items-center rounded-2xl border border-primary-300 px-4 py-3 dark:border-primary-800"
                >
                  <Text numberOfLines={1} className="flex-1 font-quicksand text-sm text-primary-900 dark:text-white">
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handleAddAttachment}
            className="mt-4 flex-row items-center justify-center gap-2 rounded-full border border-primary-300 py-3.5 active:opacity-80 dark:border-primary-800"
          >
            <CirclePlus size={18} color={mutedIconColor} />
            <Text className="font-quicksand-medium text-sm text-primary-500 dark:text-primary-400">Upload files</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View className="absolute inset-x-0 bottom-0 bg-white px-6 pb-6 pt-4 dark:bg-primary-928">
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="items-center rounded-full py-4 active:opacity-90"
          style={{ backgroundColor: canSubmit ? buttonBg : '#DBDCE0' }}
        >
          <Text className="font-quicksand-semibold text-base" style={{ color: canSubmit ? buttonTextColor : '#81868C' }}>
            Submit
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
                disabled={!canGoToPrevMonth}
                onPress={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
                style={{ opacity: canGoToPrevMonth ? 1 : 0.3 }}
              >
                <ChevronLeft size={18} color={iconColor} />
              </Pressable>
              <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <Pressable
                hitSlop={8}
                disabled={!canGoToNextMonth}
                onPress={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
                style={{ opacity: canGoToNextMonth ? 1 : 0.3 }}
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
                const cellDate = day !== null ? new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day) : null;
                const isDisabled = cellDate !== null && (cellDate < today || cellDate > maxDate);
                const isSelected =
                  day !== null &&
                  resignationDate !== null &&
                  resignationDate.getFullYear() === calendarMonth.getFullYear() &&
                  resignationDate.getMonth() === calendarMonth.getMonth() &&
                  resignationDate.getDate() === day;
                return (
                  <View key={index} style={{ width: `${100 / 7}%` }} className="items-center py-1">
                    {day !== null ? (
                      <Pressable
                        onPress={() => handleSelectDay(day)}
                        disabled={isDisabled}
                        className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
                        style={{ backgroundColor: isSelected ? buttonBg : 'transparent' }}
                      >
                        <Text
                          className="font-quicksand-medium text-sm"
                          style={{
                            color: isSelected
                              ? buttonTextColor
                              : isDisabled
                                ? '#C4C7CB'
                                : isDark
                                  ? '#FFFFFF'
                                  : '#202125',
                          }}
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
    </View>
  );
}
