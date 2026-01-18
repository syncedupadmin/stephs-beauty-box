/**
 * Database Types for Steph's Beauty Box
 * ======================================
 * Auto-generated types matching the Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enums
export type BookingStatus = 'hold' | 'confirmed' | 'cancelled' | 'expired' | 'completed' | 'no_show';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'needs_attention';
export type FulfillmentMethod = 'shipping' | 'pickup';
export type DepositType = 'flat' | 'percent';
export type TaxMode = 'none' | 'inclusive' | 'exclusive';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Database {
  public: {
    Tables: {
      // ===================
      // SETTINGS
      // ===================
      shop_settings: {
        Row: {
          id: string;
          shipping_enabled: boolean;
          pickup_enabled: boolean;
          pickup_address: string | null;
          pickup_hours: string | null;
          pickup_instructions: string | null;
          flat_shipping_rate_cents: number | null;
          free_shipping_threshold_cents: number | null;
          tax_mode: TaxMode;
          tax_rate_percent: number | null;
          stripe_configured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shipping_enabled?: boolean;
          pickup_enabled?: boolean;
          pickup_address?: string | null;
          pickup_hours?: string | null;
          pickup_instructions?: string | null;
          flat_shipping_rate_cents?: number | null;
          free_shipping_threshold_cents?: number | null;
          tax_mode?: TaxMode;
          tax_rate_percent?: number | null;
          stripe_configured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shipping_enabled?: boolean;
          pickup_enabled?: boolean;
          pickup_address?: string | null;
          pickup_hours?: string | null;
          pickup_instructions?: string | null;
          flat_shipping_rate_cents?: number | null;
          free_shipping_threshold_cents?: number | null;
          tax_mode?: TaxMode;
          tax_rate_percent?: number | null;
          stripe_configured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      booking_settings: {
        Row: {
          id: string;
          timezone: string;
          min_notice_minutes: number;
          buffer_minutes: number;
          max_days_out: number;
          hold_minutes: number;
          deposits_enabled: boolean;
          default_deposit_type: DepositType;
          default_deposit_value: number;
          stripe_configured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['booking_settings']['Row']>;
        Update: Partial<Database['public']['Tables']['booking_settings']['Row']>;
      };

      // ===================
      // PRODUCTS
      // ===================
      products: {
        Row: {
          id: string;
          handle: string;
          title: string;
          description: string | null;
          product_type: string | null;
          vendor: string | null;
          tags: string[] | null;
          seo_title: string | null;
          seo_description: string | null;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['products']['Row']>;
      };

      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string | null;
          title: string;
          price_cents: number;
          compare_at_price_cents: number | null;
          inventory_quantity: number;
          inventory_policy: string;
          weight_grams: number | null;
          requires_shipping: boolean;
          option1_name: string | null;
          option1_value: string | null;
          option2_name: string | null;
          option2_value: string | null;
          option3_name: string | null;
          option3_value: string | null;
          is_active: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['product_variants']['Row']>;
      };

      product_images: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          src: string;
          alt: string | null;
          position: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['product_images']['Row']>;
      };

      // ===================
      // ORDERS
      // ===================
      orders: {
        Row: {
          id: string;
          order_number: number;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          customer_email: string;
          customer_name: string | null;
          customer_phone: string | null;
          fulfillment_method: FulfillmentMethod;
          shipping_address_line1: string | null;
          shipping_address_line2: string | null;
          shipping_city: string | null;
          shipping_state: string | null;
          shipping_postal_code: string | null;
          shipping_country: string;
          subtotal_cents: number;
          shipping_cents: number;
          tax_cents: number;
          total_cents: number;
          status: OrderStatus;
          status_notes: string | null;
          created_at: string;
          updated_at: string;
          paid_at: string | null;
          fulfilled_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'order_number' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string | null;
          product_title: string;
          variant_title: string | null;
          sku: string | null;
          quantity: number;
          price_cents: number;
          total_cents: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['order_items']['Row']>;
      };

      // ===================
      // SERVICES & BOOKING
      // ===================
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string | null;
          duration_minutes: number;
          price_cents: number;
          image_url: string | null;
          position: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['services']['Row']>;
      };

      service_deposits: {
        Row: {
          id: string;
          service_id: string;
          deposit_type: DepositType;
          deposit_value: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['service_deposits']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['service_deposits']['Row']>;
      };

      availability_rules: {
        Row: {
          id: string;
          day_of_week: DayOfWeek;
          start_time: string;
          end_time: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['availability_rules']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['availability_rules']['Row']>;
      };

      blackout_dates: {
        Row: {
          id: string;
          date: string;
          reason: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blackout_dates']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['blackout_dates']['Row']>;
      };

      bookings: {
        Row: {
          id: string;
          service_id: string | null;
          start_ts: string;
          end_ts: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          deposit_amount_cents: number | null;
          deposit_paid: boolean;
          status: BookingStatus;
          hold_expires_at: string | null;
          customer_notes: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
          confirmed_at: string | null;
          cancelled_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['bookings']['Row']>;
      };

      // ===================
      // ADMIN
      // ===================
      admin_users: {
        Row: {
          id: string;
          auth_id: string; // Links to Supabase Auth user
          email: string;
          name: string | null;
          role: string; // 'owner', 'staff', 'super_admin'
          is_active: boolean;
          created_at: string;
          last_login_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['admin_users']['Row']>;
      };
    };

    Functions: {
      decrement_inventory_safe: {
        Args: { p_variant_id: string; p_quantity: number };
        Returns: boolean;
      };
      increment_inventory: {
        Args: { p_variant_id: string; p_quantity: number };
        Returns: void;
      };
      release_expired_holds: {
        Args: Record<string, never>;
        Returns: number;
      };
      create_booking_hold: {
        Args: {
          p_service_id: string;
          p_start_ts: string;
          p_customer_name: string;
          p_customer_phone: string;
          p_customer_email?: string;
          p_customer_notes?: string;
        };
        Returns: {
          success: boolean;
          booking_id: string | null;
          error_message: string | null;
          hold_expires_at: string | null;
        }[];
      };
      confirm_booking_hold: {
        Args: {
          p_booking_id: string;
          p_stripe_session_id: string;
          p_stripe_payment_intent_id?: string;
        };
        Returns: boolean;
      };
      get_available_slots: {
        Args: { p_service_id: string; p_date: string };
        Returns: { slot_start: string; slot_end: string }[];
      };
    };
  };
}

// ===================
// CONVENIENCE TYPES
// ===================

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
export type ProductImage = Database['public']['Tables']['product_images']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceDeposit = Database['public']['Tables']['service_deposits']['Row'];
export type AvailabilityRule = Database['public']['Tables']['availability_rules']['Row'];
export type BlackoutDate = Database['public']['Tables']['blackout_dates']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type ShopSettings = Database['public']['Tables']['shop_settings']['Row'];
export type BookingSettings = Database['public']['Tables']['booking_settings']['Row'];

// Product with variants and images
export type ProductWithDetails = Product & {
  variants: ProductVariant[];
  images: ProductImage[];
};

// Service with deposit info
export type ServiceWithDeposit = Service & {
  deposit?: ServiceDeposit;
};

// Booking with service info
export type BookingWithService = Booking & {
  service: Service | null;
};

// Order with items
export type OrderWithItems = Order & {
  items: OrderItem[];
};

// Cart item (client-side)
export interface CartItem {
  variantId: string;
  productId: string;
  productTitle: string;
  variantTitle: string;
  price: number; // in cents
  quantity: number;
  image?: string;
  maxQuantity: number; // inventory limit
}

// Available slot
export interface AvailableSlot {
  start: Date;
  end: Date;
  formatted: string;
}
