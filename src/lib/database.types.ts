export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      branches: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      branch_schedules: {
        Row: {
          id: string
          branch_id: string
          day_of_week: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          branch_id: string
          day_of_week: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          branch_id?: string
          day_of_week?: string
          is_active?: boolean
          created_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          name: string
          mobile: string | null
          gender: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          mobile?: string | null
          gender: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          mobile?: string | null
          gender?: string
          description?: string | null
          created_at?: string
        }
      }
      teacher_assignments: {
        Row: {
          id: string
          teacher_id: string
          branch_id: string
          day_of_week: string
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          branch_id: string
          day_of_week: string
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          branch_id?: string
          day_of_week?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}