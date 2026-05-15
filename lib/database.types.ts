// Tienda La Banda — tipos generados desde el esquema de Supabase.
// Regenerar con el MCP de Supabase (generate_typescript_types) si cambia el esquema.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admins: {
        Row: { created_at: string; email: string | null; user_id: string };
        Insert: { created_at?: string; email?: string | null; user_id: string };
        Update: { created_at?: string; email?: string | null; user_id?: string };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          size: string | null;
          unit_price: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          size?: string | null;
          unit_price: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          size?: string | null;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          admin_notes: string | null;
          created_at: string;
          customer_address: string | null;
          customer_city: string | null;
          customer_email: string;
          customer_name: string;
          customer_phone: string | null;
          id: string;
          order_number: number;
          payment_screenshot_path: string | null;
          shipping: number;
          status: Database["public"]["Enums"]["order_status"];
          subtotal: number;
          total: number;
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          created_at?: string;
          customer_address?: string | null;
          customer_city?: string | null;
          customer_email: string;
          customer_name: string;
          customer_phone?: string | null;
          id?: string;
          order_number?: never;
          payment_screenshot_path?: string | null;
          shipping?: number;
          status?: Database["public"]["Enums"]["order_status"];
          subtotal: number;
          total: number;
          updated_at?: string;
        };
        Update: {
          admin_notes?: string | null;
          created_at?: string;
          customer_address?: string | null;
          customer_city?: string | null;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string | null;
          id?: string;
          order_number?: never;
          payment_screenshot_path?: string | null;
          shipping?: number;
          status?: Database["public"]["Enums"]["order_status"];
          subtotal?: number;
          total?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_methods: {
        Row: {
          account_number: string;
          created_at: string;
          holder: string;
          id: string;
          instructions: string;
          is_active: boolean;
          kind: string;
          label: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          account_number?: string;
          created_at?: string;
          holder?: string;
          id?: string;
          instructions?: string;
          is_active?: boolean;
          kind?: string;
          label: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          account_number?: string;
          created_at?: string;
          holder?: string;
          id?: string;
          instructions?: string;
          is_active?: boolean;
          kind?: string;
          label?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          sort_order: number;
          url: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          sort_order?: number;
          url: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          sort_order?: number;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          category: string;
          color: string;
          created_at: string;
          description: string;
          glyph: string;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          price: number;
          stock: number;
          stock_status: string | null;
          updated_at: string;
        };
        Insert: {
          category?: string;
          color?: string;
          created_at?: string;
          description?: string;
          glyph?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          price: number;
          stock?: number;
          stock_status?: string | null;
          updated_at?: string;
        };
        Update: {
          category?: string;
          color?: string;
          created_at?: string;
          description?: string;
          glyph?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          price?: number;
          stock?: number;
          stock_status?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      store_settings: {
        Row: {
          free_shipping_min: number;
          id: boolean;
          nequi_holder: string;
          nequi_number: string;
          shipping_cost: number;
          shipping_info: string;
          store_name: string;
          updated_at: string;
          whatsapp: string;
        };
        Insert: {
          free_shipping_min?: number;
          id?: boolean;
          nequi_holder?: string;
          nequi_number?: string;
          shipping_cost?: number;
          shipping_info?: string;
          store_name?: string;
          updated_at?: string;
          whatsapp?: string;
        };
        Update: {
          free_shipping_min?: number;
          id?: boolean;
          nequi_holder?: string;
          nequi_number?: string;
          shipping_cost?: number;
          shipping_info?: string;
          store_name?: string;
          updated_at?: string;
          whatsapp?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      create_order: {
        Args: {
          p_customer_address: string;
          p_customer_city: string;
          p_customer_email: string;
          p_customer_name: string;
          p_customer_phone: string;
          p_items: Json;
          p_screenshot_path: string;
        };
        Returns: { new_order_id: string; new_order_number: number }[];
      };
      is_admin: { Args: never; Returns: boolean };
      update_order_status: {
        Args: {
          p_new_status: Database["public"]["Enums"]["order_status"];
          p_order_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      order_status: "pending" | "done" | "shipped" | "cancel";
    };
    CompositeTypes: { [_ in never]: never };
  };
};
