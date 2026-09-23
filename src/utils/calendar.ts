import { EventItem } from '../types';

export function downloadEventICS(event: EventItem): void {
  const startDate = new Date(event.dateTime);
  // Default duration 90 minutes if not parsed
  const endDate = new Date(startDate.getTime() + 90 * 60 * 1000);

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
  };

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Applied Neuroscience Community Event Finder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-${Date.now()}@neuroevents.community`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.title.replace(/[,;]/g, ' ')}`,
    `DESCRIPTION:${event.description.replace(/\n/g, ' ')} \\n\\nSpeaker: ${event.speaker} \\nRegister: ${event.registrationUrl}`,
    `LOCATION:${event.location.replace(/[,;]/g, ' ')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([icsLines.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.id}_event.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
