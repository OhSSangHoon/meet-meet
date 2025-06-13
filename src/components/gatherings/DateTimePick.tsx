import { TIME_OPTIONS, DateTimeValue } from '@/components/shared/utils/dateFormats';
import { useState } from 'react';

// 매직넘버 상수
const CALENDAR_DAYS_COUNT = 42; // 달력 표시를 위한 총 날짜 수 (6주 * 7일)

/**
 * 날짜 선택 컴포넌트 속성
 * @param value 선택된 날짜 및 시간
 * @param onChange 날짜 및 시간 변경 핸들러
 * @param label 라벨
 */
interface DateTimePickerProps {
  value: DateTimeValue | null;
  onChange: (value: DateTimeValue) => void;
  label: string;
}

const DateTimePicker = ({ value, onChange, label }: DateTimePickerProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hourDropdownOpen, setHourDropdownOpen] = useState(false);
  const [minuteDropdownOpen, setMinuteDropdownOpen] = useState(false);

  const selectedDate = value ? new Date(value.year, value.month - 1, value.day) : null;

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];

    for (let i = 0; i < CALENDAR_DAYS_COUNT; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      days.push(date);
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    const newValue: DateTimeValue = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: value?.hour || 9,
      minute: value?.minute || 0,
      period: value?.period || 'AM'
    };
    onChange(newValue);
  };

  const handleTimeChange = (field: 'hour' | 'minute' | 'period', newValue: number | string) => {
    if (!value) {
      const today = new Date();
      const newDateTime: DateTimeValue = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        hour: field === 'hour' ? Number(newValue) : 9,
        minute: field === 'minute' ? Number(newValue) : 0,
        period: field === 'period' ? newValue as 'AM' | 'PM' : 'AM'
      };
      onChange(newDateTime);
    } else {
      onChange({
        ...value,
        [field]: newValue
      });
    }
  };

  const handleHourSelect = (hour: number) => {
    handleTimeChange('hour', hour);
    setHourDropdownOpen(false);
  };

  const handleMinuteSelect = (minute: number) => {
    handleTimeChange('minute', minute);
    setMinuteDropdownOpen(false);
  };

  const calendarDays = generateCalendarDays();
  const currentMonth = currentDate.toLocaleString('ko-KR', { year: 'numeric', month: 'long' });

  return (
    <div className="w-full flex flex-col">
      <h1 className="font-bold text-gray-800 mb-3">{label}</h1>

      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrevMonth();
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ◀
          </button>
          <h2 className="text-lg font-semibold">{currentMonth}</h2>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNextMonth();
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {calendarDays.map((date) => {
            const isSelected = selectedDate &&
              date.getFullYear() === selectedDate.getFullYear() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getDate() === selectedDate.getDate();

            return (
              <button
                key={date.getTime()}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDateSelect(date);
                }}
                className={`
                  w-8 h-8 text-sm rounded flex items-center justify-center
                  ${isSelected ? 'bg-main-500 text-white' : 'hover:bg-gray-100'}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 items-center justify-center">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setHourDropdownOpen(!hourDropdownOpen);
                setMinuteDropdownOpen(false);
              }}
              className="w-16 h-10 rounded-lg border-2 border-main-500 bg-main-500 text-white text-center font-bold hover:bg-main-50 flex items-center justify-center"
            >
              {value?.hour || 12}
            </button>

            {hourDropdownOpen && (
              <div className="absolute top-12 left-0 w-16 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {TIME_OPTIONS.hours.map(hour => (
                  <button
                    key={hour}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleHourSelect(hour);
                    }}
                    className="w-full h-8 text-sm hover:bg-gray-100 flex items-center justify-center">
                    {hour}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-gray-500">:</span>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMinuteDropdownOpen(!minuteDropdownOpen);
                setHourDropdownOpen(false);
              }}
              className="w-16 h-10 rounded-lg border-2 border-main-500 bg-main-500 text-white text-center font-bold hover:bg-main-50 flex items-center justify-center"
            >
              {(value?.minute || 0).toString().padStart(2, '0')}
            </button>

            {minuteDropdownOpen && (
              <div className="absolute top-12 left-0 w-16 max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {TIME_OPTIONS.minutes.map(minute => (
                  <button
                    key={minute}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMinuteSelect(minute);
                    }}
                    className="w-full h-8 text-sm hover:bg-gray-100 flex items-center justify-center">
                    {minute.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTimeChange('period', 'AM');
                setHourDropdownOpen(false);
                setMinuteDropdownOpen(false);
              }}
              className={`
                w-12 h-10 rounded-lg font-bold text-sm border-2 transition-colors
                ${(value?.period || 'AM') === 'AM'
                  ? 'bg-main-500 text-white border-main-500'
                  : 'bg-white text-main-500 border-main-500 hover:bg-main-50'}
              `}
            >
              AM
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTimeChange('period', 'PM');
                setHourDropdownOpen(false);
                setMinuteDropdownOpen(false);
              }}
              className={`
                w-12 h-10 rounded-lg font-bold text-sm border-2 transition-colors
                ${(value?.period || 'AM') === 'PM'
                  ? 'bg-main-500 text-white border-main-500'
                  : 'bg-white text-main-500 border-main-500 hover:bg-main-50'}
              `}
            >
              PM
            </button>
          </div>
        </div>
      </div>

      {(hourDropdownOpen || minuteDropdownOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setHourDropdownOpen(false);
            setMinuteDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DateTimePicker;