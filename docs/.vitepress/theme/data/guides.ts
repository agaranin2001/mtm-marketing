export interface Lesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'article'
  videoUrl?: string
  /** Step-by-step written walkthrough shown below the video player. */
  steps?: string[]
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
    totalLessons: 7,
    totalDuration: '19 min',
    sections: [
      {
        title: 'Introduction',
        lessons: [
          {
            id: 'am-0',
            title: 'Intro Athletes Management',
            duration: '2:00',
            type: 'video',
            videoUrl: 'https://youtu.be/E3-mA8mKDVg',
            steps: [
              'Open the Athletes tab from the main navigation to see your full roster.',
              'Each athlete card shows their name, sport, health status badge and a quick workload indicator.',
              'Click any athlete card to open their detail page — Training, Events, Analytics, Recovery, Medical and Profile all live under one set of tabs there.',
            ],
          },
        ],
      },
      {
        title: 'Athletes Overview',
        lessons: [
          {
            id: 'am-7',
            title: "Athlete's Profile",
            duration: '2:30',
            type: 'video',
            videoUrl: 'https://youtu.be/6IryqwO2kXo',
            steps: [
              'Open an athlete and select the Profile tab.',
            ],
          },
        ],
      },
      {
        title: 'Plans & Performance',
        lessons: [
          {
            id: 'am-2',
            title: "Athlete's Training Plan",
            duration: '3:30',
            type: 'video',
            videoUrl: 'https://youtu.be/SJXTvFjcoWA',
            steps: [
              'Open an athlete and select the Training tab to see their personal calendar.',
              'Switch between Weekly, Monthly, Macro/Mesocycle and Olympic Cycle views depending on the planning horizon you need.',
              'Click any day to see scheduled sessions, or Add Session to schedule a new one for that athlete.',
            ],
          },
          {
            id: 'am-3',
            title: "Athlete's Events Plan",
            duration: '2:45',
            type: 'video',
            videoUrl: 'https://youtu.be/BP6sVrs0RiI',
            steps: [
              'Open an athlete and select the Events tab.',
              'See every competition and training camp this athlete is assigned to, past and upcoming.',
              'Click an event to view details, location and any linked documents.',
              'Assign the athlete to a new event directly from the Events module and it appears here automatically.',
            ],
          },
          {
            id: 'am-4',
            title: "Athlete's Analytics",
            duration: '3:15',
            type: 'video',
            videoUrl: 'https://youtu.be/WrA-znjF7K8',
            steps: [
              'Open an athlete and select the Analytics tab.',
              'Review training load, ACWR (acute:chronic workload ratio) and readiness trends over the selected period.',
              'Switch the Performance Overview chart between Training Load, Athletes Engagement and Recovery Balance views.',
              'Use this tab to spot fatigue or under-training patterns before they show up as an injury or a dip in results.',
            ],
          },
        ],
      },
      {
        title: 'Health & Recovery',
        lessons: [
          {
            id: 'am-5',
            title: "Athlete's Recovery Plan",
            duration: '2:30',
            type: 'video',
            videoUrl: 'https://youtu.be/rtMqsRFU2to',
            steps: [
              'Open an athlete and select the Recovery tab.',
              'Review their assigned daily routines and weekly treatments.',
              'Check recent wellness log entries — sleep, soreness and mood — logged by the athlete.',
              'Adjust or add a routine directly from this tab if their recovery needs change.',
            ],
          },
          {
            id: 'am-6',
            title: "Athlete's Medical Records",
            duration: '2:30',
            type: 'video',
            videoUrl: 'https://youtu.be/bbyVyXuXhXs',
            steps: [
              'Open an athlete and select the Medical tab.',
              'Review current health status, required tests and past test results in one timeline.',
              'Open the Injury History section to see prior injuries and recovery notes.',
            ],
          },
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
          {
            id: 'tpm-0',
            title: 'Intro Training Plans Management',
            duration: '2:00',
            type: 'video',
            videoUrl: 'https://youtu.be/UzMVRLEMAhE',
            steps: [
              'Open the Training tab from the main navigation.',
              'From here you can jump into the Exercise Library, Session Templates, or any athlete\'s calendar.',
              'Everything you build here — exercises, templates, cycles — becomes reusable across your whole roster.',
            ],
          },
        ],
      },
      {
        title: 'Exercise Library',
        lessons: [
          {
            id: 'tpm-1',
            title: 'Exercise Library',
            duration: '3:00',
            type: 'video',
            videoUrl: 'https://youtu.be/0wxc5pO1Tck',
            steps: [
              'Open Training → Exercise Library.',
              'Browse exercises by category, or use the search bar to find one by name.',
              'Click an exercise to see its full detail — muscle groups, equipment, difficulty and instructions.',
              'Use exercises from the library directly when building a session template.',
            ],
          },
          {
            id: 'tpm-2',
            title: 'Add Exercise',
            duration: '3:30',
            type: 'video',
            videoUrl: 'https://youtu.be/LWK1Lgz8HlQ',
            steps: [
              'From the Exercise Library, click Add Exercise.',
              'Fill in the name, category, difficulty and target muscle groups.',
              'Optionally attach a demonstration video or image and step-by-step instructions.',
              'Save — the new exercise is now available in the library for every session template you build.',
            ],
          },
        ],
      },
      {
        title: 'Session Templates',
        lessons: [
          {
            id: 'tpm-3',
            title: 'Session Templates',
            duration: '3:00',
            type: 'video',
            videoUrl: 'https://youtu.be/GTgzI1WDNaY',
            steps: [
              'Open Training → Session Templates to see your library of reusable workouts.',
              'Filter by session type — strength, cardio, technique and so on.',
              'Click a template to preview its full exercise breakdown.',
              'Assign a template directly to an athlete\'s calendar from here.',
            ],
          },
          {
            id: 'tpm-4',
            title: 'Create Session Template',
            duration: '4:00',
            type: 'video',
            videoUrl: 'https://youtu.be/I3dvj48PY54',
            steps: [
              'From Session Templates, click Create Template.',
              'Name the template and set its session type and estimated duration.',
              'Add exercises from the library, and set sets, reps, load or duration for each.',
              'Save the template so it can be assigned to any athlete going forward.',
            ],
          },
        ],
      },
      {
        title: "Athlete's Calendar",
        lessons: [
          {
            id: 'tpm-5',
            title: "Athlete's Calendar",
            duration: '2:45',
            type: 'video',
            videoUrl: 'https://youtu.be/uMcfcU7hcQA',
            steps: [
              'Open an athlete and select the Training tab to see their weekly calendar.',
              'Each day shows scheduled sessions with a status dot for completed, missed or planned.',
              'Click a day to see full session details, or Add Session to schedule something new.',
              'Switch to Monthly view for a wider planning window.',
            ],
          },
          {
            id: 'tpm-6',
            title: "Add Athlete's Session",
            duration: '4:15',
            type: 'video',
            steps: [
              'From an athlete\'s Training calendar, click Add Session.',
              'Pick a session type, or start from an existing Session Template to save time.',
              'Set the time, duration and any coaching notes for the athlete.',
              'Save — the session appears immediately on the athlete\'s calendar and in their app.',
            ],
          },
          {
            id: 'tpm-7',
            title: "Add Athlete's Cycle",
            duration: '3:30',
            type: 'video',
            videoUrl: 'https://youtu.be/NSC8aLpDGrk',
            steps: [
              'From an athlete\'s Training tab, switch to the Macro/Meso or Olympic Cycle view.',
              'Click Add Cycle to define a training block with a start date, end date and goal.',
              'Break the cycle into mesocycles and set training load targets for each.',
              'Save the cycle — it now frames the athlete\'s week-by-week plan on the calendar.',
            ],
          },
        ],
      },
    ],
  },
  'recovery-management': {
    id: 'recovery-management',
    title: 'Recovery and Nutrition',
    description: 'Set up daily routines, weekly treatments and nutrition plans to keep athletes recovering and performing at their best.',
    image: '/images/knowledgehub/knowledge_hub_nutrition.webp',
    totalLessons: 5,
    totalDuration: '16 min',
    sections: [
      {
        title: 'Introduction',
        lessons: [
          {
            id: 'rm-0',
            title: 'Intro Recovery Management',
            duration: '2:00',
            type: 'video',
            videoUrl: 'https://youtu.be/TUIuKtPRIPY',
            steps: [
              'Open the Recovery tab from the main navigation.',
              'Coaches see every athlete\'s recovery status at a glance; athletes see their own routines and treatments.',
              'Switch between Manage Recovery, Manage Nutrition, Recovery Report and Nutrition Report using the tabs at the top.',
              'Recovery data feeds directly into the Recovery Balance chart on each athlete\'s Analytics tab.',
            ],
          },
        ],
      },
      {
        title: 'Routines & Treatments',
        lessons: [
          {
            id: 'rm-1',
            title: 'Daily Routines',
            duration: '3:30',
            type: 'video',
            videoUrl: 'https://youtu.be/byphSc-ptH0',
            steps: [
              'Open Recovery → Manage Recovery and select an athlete.',
              'Under Daily Recovery Routines, click Add to create a new routine — stretching, mobility work, breathing exercises and so on.',
              'The athlete sees this routine on their own recovery checklist automatically every day.',
            ],
          },
          {
            id: 'rm-2',
            title: 'Weekly Treatments',
            duration: '3:30',
            type: 'video',
            videoUrl: 'https://youtu.be/t6P44d72YJ8',
            steps: [
              'Open Recovery → Manage Recovery and select an athlete.',
              'Under Weekly Treatments, click Add Treatment — massage, acupuncture, chiropractic and similar.',
              'Set the frequency (e.g. 2x per week) and typical duration.',
              'Treatments show up on the athlete\'s recovery calendar alongside their daily routines.',
            ],
          },
        ],
      },
      {
        title: 'Nutrition',
        lessons: [
          {
            id: 'rm-3',
            title: 'Daily Nutrition & Supplementation',
            duration: '3:00',
            type: 'video',
            videoUrl: 'https://youtu.be/me8DXXcio4A',
            steps: [
              'Open Recovery → Manage Nutrition and select an athlete.',
              'Set their daily nutrition targets — calories, protein, carbs and fat.',
              'Athletes log their meals against these targets from their own dashboard.',
            ],
          },
          {
            id: 'rm-5',
            title: 'Nutrition Report',
            duration: '3:00',
            type: 'video',
            videoUrl: 'https://youtu.be/jJHS3SXjaiY',
            steps: [
              'Open Recovery → Nutrition Report and select an athlete and date range.',
              'Review daily target adherence, macro breakdown and logged meals over the period.',
              'Use the report to spot consistent gaps — e.g. under-eating protein — and adjust targets accordingly.',
            ],
          },
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
          {
            id: 'ev-0',
            title: 'Intro Events',
            duration: '2:00',
            type: 'video',
            videoUrl: 'https://youtu.be/j7ZKwM8ky8w',
            steps: [
              'Open the Events tab from the main navigation to see every competition and training camp.',
              'Events are listed with date, location and the athletes assigned to them.',
              'Click an event to see full details, or use Create Event to add a new one.',
              'Any event you create here also appears on the calendars of every athlete assigned to it.',
            ],
          },
        ],
      },
      {
        title: 'Managing Events',
        lessons: [
          {
            id: 'ev-1',
            title: 'Create Event',
            duration: '3:30',
            type: 'video',
            videoUrl: 'https://youtu.be/qFmpamKqMRQ',
            steps: [
              'From the Events tab, click Create Event.',
              'Enter the event name, type (competition or training camp), start and end dates, and location.',
              'Attach any relevant documents, such as schedules or entry forms.',
              'Assign athletes to the event, then save.',
            ],
          },
          {
            id: 'ev-2',
            title: 'Manage Event',
            duration: '3:30',
            type: 'video',
            videoUrl: 'https://youtu.be/xgXik_0xk2Q',
            steps: [
              'Open an event from the Events list.',
              'Assign or remove athletes from the Athletes tab within the event.',
              'Upload or manage documents, and update event details as they change.',
              'Assigned athletes automatically see this event on their own Events Plan.',
            ],
          },
        ],
      },
    ],
  },
  'manage-your-team': {
    id: 'manage-your-team',
    title: 'Manage Your Team',
    description: 'Invite athletes and staff, assign roles and keep your club or organisation running smoothly on Monetiseur.',
    image: '/images/knowledgehub/team_management.webp',
    totalLessons: 1,
    totalDuration: '2 min',
    sections: [
      {
        title: 'Getting Started',
        lessons: [
          {
            id: 'myt-0',
            title: 'Intro Team Management',
            duration: '2:00',
            type: 'video',
            videoUrl: 'https://youtu.be/aqxoiLPLHbA',
            steps: [
              'Open the Team tab from the main navigation.',
              'See every athlete, coach and staff member in your organisation in one place.',
              'From here you can invite new members, assign roles and manage permissions.',
              'Changes made here take effect immediately across the whole platform.',
            ],
          },
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
          {
            id: 'ad-0',
            title: 'Intro Analytics Dashboard',
            duration: '2:30',
            type: 'video',
            videoUrl: 'https://youtu.be/_SRgbwVvusw',
            steps: [
              'Open the Analytics tab from the main navigation.',
              'The Summary view shows training load, athlete engagement and recovery balance for the selected athlete.',
              'Filter by athlete, team or date range to focus on a specific period.',
              'Use these dashboards to catch overtraining or under-recovery trends before they become injuries.',
            ],
          },
        ],
      },
      {
        title: 'Reports',
        lessons: [
          {
            id: 'ad-1',
            title: 'Session Reports',
            duration: '3:30',
            type: 'video',
            videoUrl: 'https://youtu.be/uBk2gLGju7U',
            steps: [
              'Open Analytics → Session Reports.',
              'Filter by athlete or date range to find the sessions you need.',
              'Each report shows completion rate, duration and athlete\'s notes logged for the session.',
            ],
          },
        ],
      },
    ],
  },
}

/** Flat, ordered list of every lesson in a guide, across all sections. */
export function flattenLessons(guide: GuideContent): Lesson[] {
  return guide.sections.flatMap(s => s.lessons)
}
