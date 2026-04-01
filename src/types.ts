export interface User {
  id: string;
  name: string;
  phone?: string;
  isLoggedIn: boolean;
  role: 'user' | 'admin';
  tags: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  cover: string;
  type: 'image' | 'video';
  category: 'pregnancy' | 'postpartum' | 'parenting' | 'nanny';
  author: string;
  likes: number;
}

export interface UserPath {
  path: string;
  timestamp: number;
  duration?: number;
}

export interface UserProfile {
  uid: string;
  paths: UserPath[];
  tags: string[];
  lastActive: number;
  salesScript?: string;
  pregnancyInfo?: {
    type: 'pregnancy' | 'postpartum';
    date: string; // Due date or birth date
  };
}
