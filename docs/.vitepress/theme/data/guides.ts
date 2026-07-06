export interface Lesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'article'
  videoUrl?: string
}

// Placeholder until real lesson recordings are uploaded.
export const PLACEHOLDER_VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

export interface Section {
  title: string
  lessons: Lesson[]
}

export interface GuideContent {
  id: string
  title: string
  description: string
  image: string
  totalLessons: number
  totalDuration: string
  sections: Section[]
}

export const GUIDES: Record<string, GuideContent> = {
  'athletes-management': {
    id: 'athletes-management',
    title: 'Athletes Management',
    description: 'Manage your full athlete roster — view training, events, analytics, recovery and medical records all from one place.',
    image: '/images/knowledgehub/knowledge_hub_athletes.webp',
    totalLessons: 8,
    totalDuration: '22 min',
    sections: [
      {
        title: 'Introduction',
        lessons: [
          { id: 'am-0', title: 'Intro Athletes Management', duration: '2:00', type: 'video' },
        ],
      },
      {
        title: 'Athletes Overview',
        lessons: [
          { id: 'am-1', title: 'All Athletes', duration: '3:00', type: 'video' },
          { id: 'am-7', title: "Athlete's Profile", duration: '2:30', type: 'video' },
        ],
      },
      {
        title: 'Plans & Performance',
        lessons: [
          { id: 'am-2', title: "Athlete's Training Plan", duration: '3:30', type: 'video' },
          { id: 'am-3', title: "Athlete's Events Plan", duration: '2:45', type: 'video' },
          { id: 'am-4', title: "Athlete's Analytics", duration: '3:15', type: 'video' },
        ],
      },
      {
        title: 'Health & Recovery',
        lessons: [
          { id: 'am-5', title: "Athlete's Recovery Plan", duration: '2:30', type: 'video' },
          { id: 'am-6', title: "Athlete's Medical Records", duration: '2:30', type: 'video' },
        ],
      },
    ],
  },
  'training-plans-management': {
    id: 'training-plans-management',
    title: 'Training Plans Management',
    description: 'Build your exercise library, create session templates and schedule athlete training cycles from a single workflow.',
    image: '/images/knowledgehub/knowledge_hub_training.webp',
    totalLessons: 8,
    totalDuration: '26 min',
    sections: [
      {
        title: 'Introduction',
        lessons: [
          { id: 'tpm-0', title: 'Intro Training Plans Management', duration: '2:00', type: 'video' },
        ],
      },
      {
        title: 'Exercise Library',
        lessons: [
          { id: 'tpm-1', title: 'Exercise Library', duration: '3:00', type: 'video' },
          { id: 'tpm-2', title: 'Add Exercise', duration: '3:30', type: 'video' },
        ],
      },
      {
        title: 'Session Templates',
        lessons: [
          { id: 'tpm-3', title: 'Session Templates', duration: '3:00', type: 'video' },
          { id: 'tpm-4', title: 'Create Session Template', duration: '4:00', type: 'video' },
        ],
      },
      {
        title: "Athlete's Calendar",
        lessons: [
          { id: 'tpm-5', title: "Athlete's Calendar", duration: '2:45', type: 'video' },
          { id: 'tpm-6', title: "Add Athlete's Session", duration: '4:15', type: 'video' },
          { id: 'tpm-7', title: "Add Athlete's Cycle", duration: '3:30', type: 'video' },
        ],
      },
    ],
  },
  'recovery-management': {
    id: 'recovery-management',
    title: 'Recovery and Nutrition',
    description: 'Set up daily routines, weekly treatments and nutrition plans to keep athletes recovering and performing at their best.',
    image: '/images/knowledgehub/knowledge_hub_nutrition.webp',
    totalLessons: 6,
    totalDuration: '19 min',
    sections: [
      {
        title: 'Introduction',
        lessons: [
          { id: 'rm-0', title: 'Intro Recovery Management', duration: '2:00', type: 'video' },
        ],
      },
      {
        title: 'Routines & Treatments',
        lessons: [
          { id: 'rm-1', title: 'Daily Routines', duration: '3:30', type: 'video' },
          { id: 'rm-2', title: 'Weekly Treatments', duration: '3:30', type: 'video' },
        ],
      },
      {
        title: 'Nutrition',
        lessons: [
          { id: 'rm-3', title: 'Daily Nutrition', duration: '3:00', type: 'video' },
          { id: 'rm-4', title: 'Supplementation', duration: '3:00', type: 'video' },
          { id: 'rm-5', title: 'Nutrition Report', duration: '3:00', type: 'video' },
        ],
      },
    ],
  },
  'events': {
    id: 'events',
    title: 'Events',
    description: 'Create competition and training events, assign athletes and manage all event details in one place.',
    image: '/images/knowledgehub/knowledge_hub_events.webp',
    totalLessons: 3,
    totalDuration: '9 min',
    sections: [
      {
        title: 'Introduction',
        lessons: [
          { id: 'ev-0', title: 'Intro Events', duration: '2:00', type: 'video' },
        ],
      },
      {
        title: 'Managing Events',
        lessons: [
          { id: 'ev-1', title: 'Create Event', duration: '3:30', type: 'video' },
          { id: 'ev-2', title: 'Manage Event', duration: '3:30', type: 'video' },
        ],
      },
    ],
  },
  'manage-your-team': {
    id: 'manage-your-team',
    title: 'Manage Your Team',
    description: 'Invite athletes and staff, assign roles and keep your club or organisation running smoothly on Monetiseur.',
    image: '/images/knowledgehub/team_management.webp',
    totalLessons: 4,
    totalDuration: '12 min',
    sections: [
      {
        title: 'Getting Started',
        lessons: [
          { id: 'myt-0', title: 'Intro Team Management', duration: '2:00', type: 'video' },
        ],
      },
      {
        title: 'Inviting Members',
        lessons: [
          { id: 'myt-1', title: 'Inviting Athletes via Email or Group Code', duration: '3:30', type: 'video' },
          { id: 'myt-2', title: 'Inviting Coaches and Staff', duration: '3:00', type: 'video' },
        ],
      },
      {
        title: 'Roles & Permissions',
        lessons: [
          { id: 'myt-3', title: 'Understanding Roles and Permissions', duration: '3:30', type: 'video' },
        ],
      },
    ],
  },
  'analytics-dashboard': {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Understand your athletes\' performance trends, ACWR and session load through clear, actionable dashboards.',
    image: '/images/knowledgehub/analytics.webp',
    totalLessons: 2,
    totalDuration: '6 min',
    sections: [
      {
        title: 'Introduction',
        lessons: [
          { id: 'ad-0', title: 'Intro Analytics Dashboard', duration: '2:30', type: 'video' },
        ],
      },
      {
        title: 'Reports',
        lessons: [
          { id: 'ad-1', title: 'Session Reports', duration: '3:30', type: 'video' },
        ],
      },
    ],
  },
}

/** Flat, ordered list of every lesson in a guide, across all sections. */
export function flattenLessons(guide: GuideContent): Lesson[] {
  return guide.sections.flatMap(s => s.lessons)
}
