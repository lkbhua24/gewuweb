export interface Deal {
  id: string;
  phoneId: string;
  platform: string;
  price: number;
  originalPrice: number | null;
  url: string;
  title: string;
  isActive: boolean;
  phone?: DealPhone;
}

export interface DealPhone {
  id: string;
  brand: string;
  model: string;
  imageUrl: string | null;
}

export interface PriceHistory {
  date: string;
  price: number;
  platform: string;
}

export interface Review {
  id: string;
  phoneId: string;
  userId: string;
  title: string;
  content: string;
  rating: number;
  pros: string[];
  cons: string[];
  likesCount: number;
  createdAt: string;
  author?: ReviewAuthor;
}

export interface ReviewAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}
