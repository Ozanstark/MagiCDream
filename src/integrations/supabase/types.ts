export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_models: {
        Row: {
          created_at: string
          id: string
          model_data: string
          model_type: string
          name: string
          size_bytes: number
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          model_data: string
          model_type: string
          name: string
          size_bytes: number
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          model_data?: string
          model_type?: string
          name?: string
          size_bytes?: number
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      credits_log: {
        Row: {
          action_type: string
          amount: number
          created_at: string
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      diet_plans: {
        Row: {
          activity_level: Database["public"]["Enums"]["activity_level"]
          age: number
          created_at: string
          dietary_restrictions: string[]
          fitness_goals: string[]
          gender: string
          height: number
          id: string
          plan_content: string
          user_id: string | null
          weight: number
        }
        Insert: {
          activity_level: Database["public"]["Enums"]["activity_level"]
          age: number
          created_at?: string
          dietary_restrictions: string[]
          fitness_goals: string[]
          gender: string
          height: number
          id?: string
          plan_content: string
          user_id?: string | null
          weight: number
        }
        Update: {
          activity_level?: Database["public"]["Enums"]["activity_level"]
          age?: number
          created_at?: string
          dietary_restrictions?: string[]
          fitness_goals?: string[]
          gender?: string
          height?: number
          id?: string
          plan_content?: string
          user_id?: string | null
          weight?: number
        }
        Relationships: []
      }
      encrypted_messages: {
        Row: {
          created_at: string
          decryption_count: number | null
          decryption_key: string
          deletion_time: string | null
          deletion_type: string
          encrypted_content: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          decryption_count?: number | null
          decryption_key: string
          deletion_time?: string | null
          deletion_type?: string
          encrypted_content: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          decryption_count?: number | null
          decryption_key?: string
          deletion_time?: string | null
          deletion_type?: string
          encrypted_content?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      encrypted_photos: {
        Row: {
          created_at: string
          decryption_count: number | null
          decryption_key: string
          deletion_time: string | null
          deletion_type: string
          encrypted_content: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          decryption_count?: number | null
          decryption_key: string
          deletion_time?: string | null
          deletion_type?: string
          encrypted_content: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          decryption_count?: number | null
          decryption_key?: string
          deletion_time?: string | null
          deletion_type?: string
          encrypted_content?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      generated_images: {
        Row: {
          created_at: string
          id: string
          instagram_feedback: string | null
          instagram_score: number | null
          is_nsfw: boolean | null
          model_id: string
          prompt: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          instagram_feedback?: string | null
          instagram_score?: number | null
          is_nsfw?: boolean | null
          model_id: string
          prompt: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          instagram_feedback?: string | null
          instagram_score?: number | null
          is_nsfw?: boolean | null
          model_id?: string
          prompt?: string
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          credits: number
          id: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits?: number
          id: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Relationships: []
      }
      reference_images: {
        Row: {
          created_at: string
          generated_image_id: string | null
          id: string
          url: string
        }
        Insert: {
          created_at?: string
          generated_image_id?: string | null
          id?: string
          url: string
        }
        Update: {
          created_at?: string
          generated_image_id?: string | null
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "reference_images_generated_image_id_fkey"
            columns: ["generated_image_id"]
            isOneToOne: false
            referencedRelation: "generated_images"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_tweets: {
        Row: {
          category: string
          content: string
          created_at: string
          error_message: string | null
          id: string
          image_url: string | null
          scheduled_time: string
          status: string
          user_id: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          image_url?: string | null
          scheduled_time: string
          status?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          image_url?: string | null
          scheduled_time?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          equipment: string[]
          fitness_goal: string
          fitness_level: Database["public"]["Enums"]["fitness_level"]
          id: string
          injuries: string | null
          plan_content: string
          user_id: string | null
          workout_duration: number
        }
        Insert: {
          created_at?: string
          equipment: string[]
          fitness_goal: string
          fitness_level: Database["public"]["Enums"]["fitness_level"]
          id?: string
          injuries?: string | null
          plan_content: string
          user_id?: string | null
          workout_duration: number
        }
        Update: {
          created_at?: string
          equipment?: string[]
          fitness_goal?: string
          fitness_level?: Database["public"]["Enums"]["fitness_level"]
          id?: string
          injuries?: string | null
          plan_content?: string
          user_id?: string | null
          workout_duration?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      distribute_daily_tweets: {
        Args: {
          start_hour?: number
          end_hour?: number
          num_tweets?: number
        }
        Returns: string[]
      }
      update_user_credits: {
        Args: {
          user_id: string
          amount: number
          action_type: string
          description?: string
        }
        Returns: number
      }
    }
    Enums: {
      activity_level: "sedentary" | "moderately_active" | "very_active"
      fitness_level: "beginner" | "intermediate" | "advanced"
      subscription_status: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
