import React, { useState, useEffect } from 'react';
import { parseICS } from './ics'; // We'll create this utility next
import './calendar.css';

const Calendar = ({ icsFilePath }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would use an API endpoint to fetch the ICS file
        // This is a placeholder for demonstration purposes
        const response = await fetch(`/data/calendar_schedule.ics`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch calendar data');
        }
        
        const icsData = await response.text();
        console.log(`ics data: ${icsData}`);
        const events = parseICS(icsData);
        setCalendarEvents(events);
      } catch (err) {
        console.error('Error loading calendar data:', err);
        setError('Failed to load your lesson plan. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [icsFilePath]);

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const calendarDays = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      // Find events for this day
      const dayEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      calendarDays.push(
        <div key={`day-${day}`} className="calendar-day">
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.map((event, idx) => (
              <div key={idx} className="event-item" title={event.description}>
                {event.summary}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return calendarDays;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-header">Calendar</h2>
      
      {isLoading && <div className="calendar-loading">Loading your lesson plan...</div>}
      
      {error && <div className="calendar-error">{error}</div>}
      
      {!isLoading && !error && (
        <>
          <div className="calendar-controls">
            <button onClick={goToPreviousMonth} className="month-nav-btn">&lt;</button>
            <div className="current-month">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button onClick={goToNextMonth} className="month-nav-btn">&gt;</button>
          </div>
          
          <div className="calendar-grid">
            <div className="weekday-header">Sun</div>
            <div className="weekday-header">Mon</div>
            <div className="weekday-header">Tue</div>
            <div className="weekday-header">Wed</div>
            <div className="weekday-header">Thu</div>
            <div className="weekday-header">Fri</div>
            <div className="weekday-header">Sat</div>
            
            {renderCalendarDays()}
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;