export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      animal_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      animals: {
        Row: {
          id: string
          tag_id: string
          name: string | null
          breed: string
          category_id: string | null
          date_of_birth: string | null
          gender: string
          weight: number | null
          weight_unit: string
          status: string
          acquisition_date: string | null
          acquisition_cost: number | null
          notes: string | null
          farm_id: string
          parent_female_id: string | null
          parent_male_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tag_id: string
          name?: string | null
          breed: string
          category_id?: string | null
          date_of_birth?: string | null
          gender: string
          weight?: number | null
          weight_unit?: string
          status: string
          acquisition_date?: string | null
          acquisition_cost?: number | null
          notes?: string | null
          farm_id: string
          parent_female_id?: string | null
          parent_male_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tag_id?: string
          name?: string | null
          breed?: string
          category_id?: string | null
          date_of_birth?: string | null
          gender?: string
          weight?: number | null
          weight_unit?: string
          status?: string
          acquisition_date?: string | null
          acquisition_cost?: number | null
          notes?: string | null
          farm_id?: string
          parent_female_id?: string | null
          parent_male_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "animals_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "animal_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_parent_female_id_fkey"
            columns: ["parent_female_id"]
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_parent_male_id_fkey"
            columns: ["parent_male_id"]
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      breeding_records: {
        Row: {
          id: string
          female_id: string
          male_id: string | null
          breeding_date: string
          breeding_type: string
          expected_delivery_date: string | null
          actual_delivery_date: string | null
          success: boolean | null
          offspring_count: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          female_id: string
          male_id?: string | null
          breeding_date: string
          breeding_type: string
          expected_delivery_date?: string | null
          actual_delivery_date?: string | null
          success?: boolean | null
          offspring_count?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          female_id?: string
          male_id?: string | null
          breeding_date?: string
          breeding_type?: string
          expected_delivery_date?: string | null
          actual_delivery_date?: string | null
          success?: boolean | null
          offspring_count?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeding_records_female_id_fkey"
            columns: ["female_id"]
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_records_male_id_fkey"
            columns: ["male_id"]
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          id: string
          name: string
          location: string | null
          size: number | null
          size_unit: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location?: string | null
          size?: number | null
          size_unit?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string | null
          size?: number | null
          size_unit?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farms_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_records: {
        Row: {
          id: string
          animal_id: string
          feed_type: string
          quantity: number | null
          quantity_unit: string
          feeding_date: string
          cost: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          animal_id: string
          feed_type: string
          quantity?: number | null
          quantity_unit?: string
          feeding_date: string
          cost?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          animal_id?: string
          feed_type?: string
          quantity?: number | null
          quantity_unit?: string
          feeding_date?: string
          cost?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeding_records_animal_id_fkey"
            columns: ["animal_id"]
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_records: {
        Row: {
          id: string
          farm_id: string
          animal_id: string | null
          transaction_date: string
          transaction_type: string
          category: string
          amount: number
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          animal_id?: string | null
          transaction_date: string
          transaction_type: string
          category: string
          amount: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          animal_id?: string | null
          transaction_date?: string
          transaction_type?: string
          category?: string
          amount?: number
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_records_animal_id_fkey"
            columns: ["animal_id"]
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_records_farm_id_fkey"
            columns: ["farm_id"]
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          id: string
          animal_id: string
          record_date: string
          record_type: string
          description: string
          medicine: string | null
          dosage: string | null
          administered_by: string | null
          cost: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          animal_id: string
          record_date: string
          record_type: string
          description: string
          medicine?: string | null
          dosage?: string | null
          administered_by?: string | null
          cost?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          animal_id?: string
          record_date?: string
          record_type?: string
          description?: string
          medicine?: string | null
          dosage?: string | null
          administered_by?: string | null
          cost?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_animal_id_fkey"
            columns: ["animal_id"]
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          id: string
          farm_id: string
          animal_id: string | null
          title: string
          description: string | null
          due_date: string | null
          priority: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          animal_id?: string | null
          title: string
          description?: string | null
          due_date?: string | null
          priority?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          animal_id?: string | null
          title?: string
          description?: string | null
          due_date?: string | null
          priority?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_animal_id_fkey"
            columns: ["animal_id"]
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_farm_id_fkey"
            columns: ["farm_id"]
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

