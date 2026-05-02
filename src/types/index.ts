export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  dob: string;
  mobile: string;
  address: string;
  constituency: string;
  voterId: string;
  isRegistered: boolean;
  interests: string[];
  language: string;
  accessibilityNeeds: string;
  photoURL: string;
  createdAt: string;
  updatedAt: string;
  // Gamification
  xp: number;
  level: number;
  badges: Badge[];
  quizScore: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  partySymbol: string;
  constituency: string;
  age: number;
  education: string;
  criminalRecords: number;
  assets: string;
  manifesto: string[];
  aiSummary: string;
  imageUrl: string;
}

export interface Election {
  id: string;
  name: string;
  type: "general" | "state" | "local";
  date: string;
  constituency: string;
  candidates: Candidate[];
  status: "upcoming" | "ongoing" | "completed";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  language: string;
}

export interface FakeNewsResult {
  trustScore: number;
  verdict: "reliable" | "questionable" | "misleading" | "fake";
  explanation: string;
  sources: string[];
  flags: string[];
}

export interface VotingPlan {
  pollingBooth: string;
  address: string;
  bestTime: string;
  estimatedWait: string;
  distance: string;
  directions: string;
  lat: number;
  lng: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "reminder" | "alert" | "achievement" | "news";
  read: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  photoURL: string;
  xp: number;
  level: number;
  badgeCount: number;
  rank: number;
}
