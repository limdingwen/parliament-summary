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
      bill: {
        Row: {
          bill_no: string
          created_at: string
          date_introduced: string
          id: number
          is_passed: boolean
          name: string
          original_text: string | null
          passed_date: string | null
          pdf_url: string
          second_reading_date: string | null
          second_reading_date_type: string
          summary: string | null
        }
        Insert: {
          bill_no: string
          created_at?: string
          date_introduced: string
          id?: number
          is_passed: boolean
          name: string
          original_text?: string | null
          passed_date?: string | null
          pdf_url: string
          second_reading_date?: string | null
          second_reading_date_type: string
          summary?: string | null
        }
        Update: {
          bill_no?: string
          created_at?: string
          date_introduced?: string
          id?: number
          is_passed?: boolean
          name?: string
          original_text?: string | null
          passed_date?: string | null
          pdf_url?: string
          second_reading_date?: string | null
          second_reading_date_type?: string
          summary?: string | null
        }
        Relationships: []
      }
      debate: {
        Row: {
          created_at: string
          id: number
          order_no: number
          sitting_id: number
          summary: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          order_no: number
          sitting_id: number
          summary?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          order_no?: number
          sitting_id?: number
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "debate_sitting_id_fkey"
            columns: ["sitting_id"]
            isOneToOne: false
            referencedRelation: "sitting"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_speech: {
        Row: {
          content: string
          created_at: string
          debate_id: number
          id: number
          order_no: number
          speaker_name: string | null
        }
        Insert: {
          content: string
          created_at?: string
          debate_id: number
          id?: number
          order_no: number
          speaker_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          debate_id?: number
          id?: number
          order_no?: number
          speaker_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debate_speech_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debate_speech_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debate_bill_match_view"
            referencedColumns: ["debate_id"]
          },
          {
            foreignKeyName: "debate_speech_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debate_sortable_view"
            referencedColumns: ["id"]
          },
        ]
      }
      mp: {
        Row: {
          created_at: string
          date_of_birth: string | null
          family_name: string | null
          full_name: string
          gender: string | null
          given_name: string | null
          id: number
          party_id: number | null
          photo_url: string | null
          place_of_birth: string | null
          wikidata_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          family_name?: string | null
          full_name: string
          gender?: string | null
          given_name?: string | null
          id?: number
          party_id?: number | null
          photo_url?: string | null
          place_of_birth?: string | null
          wikidata_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          family_name?: string | null
          full_name?: string
          gender?: string | null
          given_name?: string | null
          id?: number
          party_id?: number | null
          photo_url?: string | null
          place_of_birth?: string | null
          wikidata_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mp_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "party"
            referencedColumns: ["id"]
          },
        ]
      }
      mp_aliases: {
        Row: {
          alias_name: string
          created_at: string
          id: number
          mp_id: number
        }
        Insert: {
          alias_name: string
          created_at?: string
          id?: number
          mp_id: number
        }
        Update: {
          alias_name?: string
          created_at?: string
          id?: number
          mp_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "mp_aliases_mp_id_fkey"
            columns: ["mp_id"]
            isOneToOne: false
            referencedRelation: "combined_mp_names_view"
            referencedColumns: ["mp_id"]
          },
          {
            foreignKeyName: "mp_aliases_mp_id_fkey"
            columns: ["mp_id"]
            isOneToOne: false
            referencedRelation: "mp"
            referencedColumns: ["id"]
          },
        ]
      }
      party: {
        Row: {
          colour: string
          created_at: string
          id: number
          name: string
          photo_url: string | null
          wikidata_id: string
        }
        Insert: {
          colour: string
          created_at?: string
          id?: number
          name: string
          photo_url?: string | null
          wikidata_id: string
        }
        Update: {
          colour?: string
          created_at?: string
          id?: number
          name?: string
          photo_url?: string | null
          wikidata_id?: string
        }
        Relationships: []
      }
      sitting: {
        Row: {
          created_at: string
          id: number
          parliament_no: number
          session_no: number
          sitting_date_id: number
          sitting_no: number
          summary: string | null
          volume_no: number
        }
        Insert: {
          created_at?: string
          id?: number
          parliament_no: number
          session_no: number
          sitting_date_id: number
          sitting_no: number
          summary?: string | null
          volume_no: number
        }
        Update: {
          created_at?: string
          id?: number
          parliament_no?: number
          session_no?: number
          sitting_date_id?: number
          sitting_no?: number
          summary?: string | null
          volume_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "sitting_info_sitting_id_fkey"
            columns: ["sitting_date_id"]
            isOneToOne: true
            referencedRelation: "sitting_date"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sitting_info_sitting_id_fkey"
            columns: ["sitting_date_id"]
            isOneToOne: true
            referencedRelation: "unscraped_sitting_dates_view"
            referencedColumns: ["id"]
          },
        ]
      }
      sitting_date: {
        Row: {
          created_at: string
          id: number
          sitting_date: string
        }
        Insert: {
          created_at?: string
          id?: number
          sitting_date: string
        }
        Update: {
          created_at?: string
          id?: number
          sitting_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      bill_full_text_view: {
        Row: {
          bill_no: string | null
          full_text: string | null
          name: string | null
        }
        Insert: {
          bill_no?: string | null
          full_text?: never
          name?: string | null
        }
        Update: {
          bill_no?: string | null
          full_text?: never
          name?: string | null
        }
        Relationships: []
      }
      combined_mp_names_view: {
        Row: {
          alias_name: string | null
          full_name: string | null
          mp_id: number | null
        }
        Relationships: []
      }
      debate_bill_match_view: {
        Row: {
          bill_id: number | null
          debate_id: number | null
          is_second_reading: boolean | null
        }
        Relationships: []
      }
      debate_sortable_view: {
        Row: {
          id: number | null
          order_no: number | null
          sitting_date: string | null
          summary: string | null
          title: string | null
        }
        Relationships: []
      }
      debate_speech_full_text_view: {
        Row: {
          debate_id: number | null
          full_text: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debate_speech_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debate_speech_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debate_bill_match_view"
            referencedColumns: ["debate_id"]
          },
          {
            foreignKeyName: "debate_speech_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debate_sortable_view"
            referencedColumns: ["id"]
          },
        ]
      }
      unscraped_sitting_dates_view: {
        Row: {
          created_at: string | null
          id: number | null
          sitting_date: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      refresh_materialized_view: {
        Args: {
          view_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
