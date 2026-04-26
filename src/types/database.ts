export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      phones: {
        Row: {
          id: string;
          brand: string;
          model: string;
          image_url: string | null;
          release_date: string | null;
          price_cny: number | null;
          category: string | null;
          specs: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand: string;
          model: string;
          image_url?: string | null;
          release_date?: string | null;
          price_cny?: number | null;
          category?: string | null;
          specs?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand?: string;
          model?: string;
          image_url?: string | null;
          release_date?: string | null;
          price_cny?: number | null;
          category?: string | null;
          specs?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          phone_id: string;
          user_id: string;
          title: string;
          content: string;
          rating: number;
          pros: string[] | null;
          cons: string[] | null;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone_id: string;
          user_id: string;
          title: string;
          content: string;
          rating: number;
          pros?: string[] | null;
          cons?: string[] | null;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone_id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          rating?: number;
          pros?: string[] | null;
          cons?: string[] | null;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          phone_id: string;
          platform: string;
          price: number;
          original_price: number | null;
          url: string;
          title: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone_id: string;
          platform: string;
          price: number;
          original_price?: number | null;
          url: string;
          title: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone_id?: string;
          platform?: string;
          price?: number;
          original_price?: number | null;
          url?: string;
          title?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      circles: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon_url: string | null;
          members_count: number;
          posts_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon_url?: string | null;
          members_count?: number;
          posts_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon_url?: string | null;
          members_count?: number;
          posts_count?: number;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          circle_id: string;
          user_id: string;
          title: string;
          content: string;
          images: string[] | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          circle_id: string;
          user_id: string;
          title: string;
          content: string;
          images?: string[] | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          circle_id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          images?: string[] | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          parent_id: string | null;
          likes_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
          parent_id?: string | null;
          likes_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          parent_id?: string | null;
          likes_count?: number;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
