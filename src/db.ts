import Dexie, { Table } from 'dexie';

export interface User {
  id?: string;
  email: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Car {
  id?: number;
  userId: string;
  make: string;
  model: string;
  year: number;
  engineCapacity: string;
  fuelType: string;
  chassisNumber: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id?: number;
  userId: string;
  carId: number;
  amountNAD: number;
  amountJPY?: number;
  date: Date;
  category: ExpenseCategory;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseCategory = 
  | 'PAYMENT_PAYPAL'
  | 'PAYMENT_BANK'
  | 'VAT_PAYMENT'
  | 'ADD_MEDIA'
  | 'YARD_STORAGE_NAM'
  | 'YARD_STORAGE_JAPAN'
  | 'POLICE_CLEARANCE'
  | 'DISC_PAYMENT'
  | 'DISC_RENEWAL'
  | 'FOB_PAYMENT'
  | 'FREIGHT_PAYMENT'
  | 'BODY_WORKS'
  | 'MECHANICAL_WORKS'
  | 'OTHER';

export interface Media {
  id?: number;
  userId: string;
  carId: number;
  type: 'image' | 'video';
  title: string;
  description?: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id?: number;
  userId: string;
  carId: number;
  expenseId?: number;
  title: string;
  type: 'invoice' | 'registration' | 'insurance' | 'other';
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id?: number;
  userId: string;
  carId: number;
  title: string;
  description?: string;
  date: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Fine {
  id?: number;
  userId: string;
  carId: number;
  amount: number;
  date: Date;
  description: string;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id?: number;
  userId: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

class AutoVaultDatabase extends Dexie {
  users!: Table<User>;
  cars!: Table<Car>;
  expenses!: Table<Expense>;
  media!: Table<Media>;
  documents!: Table<Document>;
  reminders!: Table<Reminder>;
  fines!: Table<Fine>;
  feedback!: Table<Feedback>;

  constructor() {
    super('AutoVaultDatabase');
    this.version(1).stores({
      users: 'id, email, role',
      cars: '++id, userId, make, model, year',
      expenses: '++id, userId, carId, date, category',
      media: '++id, userId, carId, createdAt',
      documents: '++id, userId, carId, createdAt',
      reminders: '++id, userId, carId, date',
      fines: '++id, userId, carId, date',
      feedback: '++id, userId, createdAt, status'
    });
  }
}

export const db = new AutoVaultDatabase();