export interface Topic {
  id: string;
  label: string;
  iconName: string;
  description: string;
  color: string;
}

export interface EventItem {
  id: string;
  title: string;
  speaker: string;
  speakerTitle?: string;
  speakerAvatar?: string;
  topics: string[];
  dateTime: string;
  displayDate: string;
  location: string;
  description: string;
  registrationUrl: string;
  organizer?: string;
  duration?: string;
}

export interface StoredPreferences {
  selectedTopics: string[];
}
