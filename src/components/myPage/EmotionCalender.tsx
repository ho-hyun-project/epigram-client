'use client';

import { useState } from 'react';

export default function EmotionCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  const lastDateOfPreviousMonth = new Date(year, month, 0).getDate();

  const dates = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push({
      date: lastDateOfPreviousMonth - i,
      isCurrentMonth: false,
    });
  }
  for (let i = 1; i <= lastDateOfMonth; i++) {
    dates.push({
      date: i,
      isCurrentMonth: true,
    });
  }
  for (let i = 1; dates.length < 42; i++) {
    dates.push({
      date: i,
      isCurrentMonth: false,
    });
  }

  const goToPreviousMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <span className="text-lg font-semibold mb-4">
        {`${year}년 ${month + 1}월`}
      </span>

      <div className="relative w-full max-w-xs">
        <button
          onClick={goToPreviousMonth}
          className="absolute left-[-25px] top-1/2 transform -translate-y-1/2 text-4xl text-gray-400 hover:text-black focus:outline-none"
          style={{ height: '200px' }}
        >
          <img
            src="/assets/arrowLeft.svg"
            alt="Previous Month"
            className="w-6 h-12"
          />
        </button>

        <div className="grid grid-cols-7 text-center text-gray-500">
          {dayOfWeek.map(day => (
            <span key={day} className="py-2">
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center text-gray-500">
          {dates.map((dateObj, index) => (
            <span
              key={index}
              className={`p-2 h-12 flex items-center justify-center border-t border-gray-200 ${
                dateObj.isCurrentMonth ? 'text-black' : 'text-gray-200'
              }`}
            >
              {dateObj.date}
            </span>
          ))}
        </div>

        <button
          onClick={goToNextMonth}
          className="absolute right-[-25px] top-1/2 transform -translate-y-1/2 text-4xl text-gray-400 hover:text-black focus:outline-none"
          style={{ height: '200px' }}
        >
          <img
            src="/assets/arrowLeft.svg"
            alt="Next Month"
            className="w-6 h-12 transform rotate-180"
          />
        </button>
      </div>
    </div>
  );
}
