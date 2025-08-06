// shared/models/models.ts

/**
 * Base User Interface
 */
export interface UserBase {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Learner' | 'Instructor';
  contact: string;
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  disabled: boolean;
  profileImage?: string;
}

// Admin (extends base with extra fields)
export interface Admin extends UserBase {
  description?: string;
  location?: string;
}

// Learner (additional profile fields)
export interface Learner extends UserBase {
  dateOfBirth?: string;
  education?: string;
  skills?: string[];
  bio?: string;
  walletAddress?: string;
}

/**
 * Track Model
 */
export interface TrackFormDto {
  name: string;
  description: string;
  instructor: string;
  price: any // can be a number or a formatted string
  duration: string;
  image: string;
}

export interface Track {
  _id: string;
  id: string;
  name: string;
  description: string;
  instructor: string;
  price: any; // can be a number or a formatted string
  duration: string;
  image: string;
  admin: Admin;
  courses: Course[];
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Course Model
 */
export interface CourseFormDto {
  title: string;
  image: string;
  track: string; 
  description: string;
}

export interface Course {
  _id: string;
  id: string;
  admin: Admin;
  track: Track | any; // Track can be a Track object or just the ID
  title: string;
  stacks?: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  __v: number;
}

/**
 * Rating Model
 */
export interface RatingFormDto {
  rating: number;
  review: string;
}

export interface Rating {
  _id: string;
  learner: Learner;
  track: Track;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Invoice Model
 */
export interface InvoiceFormDto {
  learner:string;
  paystackCallbackUrl: string | any;
   paymentDetails: string;
}

export interface Invoice {
  _id: string;
  id: string;
  learner: Learner;
  track: Track;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidAt?: string; // Optional, not present in the response
  paymentLink: string;
  paymentDetails: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Auth DTOs
 */
export interface AuthDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: Admin | Learner;
}