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
      announcements: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          title: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          type?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          type?: string
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
        Relationships: [
          {
            foreignKeyName: "credits_log_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      error_logs: {
        Row: {
          created_at: string | null
          error_message: string
          error_stack: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message: string
          error_stack?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string
          error_stack?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feature_usage: {
        Row: {
          credits_used: number
          feature_name: string
          id: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          credits_used?: number
          feature_name: string
          id?: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          credits_used?: number
          feature_name?: string
          id?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      follower_quizzes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          share_code: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          share_code?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          share_code?: string | null
          title?: string
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
      generated_music: {
        Row: {
          audio_url: string
          created_at: string
          id: string
          model_id: string
          prompt: string
          user_id: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string
          id?: string
          model_id: string
          prompt: string
          user_id?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string
          id?: string
          model_id?: string
          prompt?: string
          user_id?: string | null
        }
        Relationships: []
      }
      photo_contest_votes: {
        Row: {
          contest_id: string
          created_at: string
          id: string
          selected_photo: number
          voter_ip: string
        }
        Insert: {
          contest_id: string
          created_at?: string
          id?: string
          selected_photo: number
          voter_ip: string
        }
        Update: {
          contest_id?: string
          created_at?: string
          id?: string
          selected_photo?: number
          voter_ip?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_contest_votes_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "photo_contests"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_contests: {
        Row: {
          created_at: string
          id: string
          photo1_url: string
          photo2_url: string
          share_code: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          photo1_url: string
          photo2_url: string
          share_code?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          photo1_url?: string
          photo2_url?: string
          share_code?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          credits: number
          id: string
          is_active: boolean | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits?: number
          id: string
          is_active?: boolean | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          is_active?: boolean | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          question: string
          quiz_id: string | null
          wrong_answers: string[]
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          question: string
          quiz_id?: string | null
          wrong_answers: string[]
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          question?: string
          quiz_id?: string | null
          wrong_answers?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "follower_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          completed_at: string
          id: string
          quiz_id: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string
          id?: string
          quiz_id?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string
          id?: string
          quiz_id?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "follower_quizzes"
            referencedColumns: ["id"]
          },
        ]
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
      system_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_value: Json
          recorded_at: string | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_value: Json
          recorded_at?: string | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_value?: Json
          recorded_at?: string | null
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
      bulk_credit_update: {
        Args: {
          user_ids: string[]
          credit_amount: number
          action_type?: string
          description?: string
        }
        Returns: {
          user_id: string
          new_credits: number
          status: string
        }[]
      }
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
