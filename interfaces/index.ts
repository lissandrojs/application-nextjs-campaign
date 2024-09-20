export type User = {
  id: number;
  name?: string;
};
export enum Status {
    ACTIVE = 'ACTIVE',
    PAUSE = 'PAUSE',
    EXPIRED = 'EXPIRED'
  }
  
export enum Category {
    TECHNOLOGY = 'TECHNOLOGY',
    MARKETING = 'MARKETING',
    EDUCATION = 'EDUCATION',
    HEALTH = 'HEALTH',
    FINANCE = 'FINANCE'
  }
  
  export interface Campaign {
    id: string;
    name: string;
    category: Category;
    registrationDate: Date;
    initialDate: Date;
    endDate?: Date;
    status: Status;
    isActive: boolean;
  }