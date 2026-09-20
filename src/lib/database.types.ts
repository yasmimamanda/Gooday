export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

/** Minimal typed surface for the Gooday public schema. */
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          handle: string
          username: string | null
          avatar_url: string | null
          cover_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          is_verified: boolean
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['users']['Row']> & {
          id: string
          name: string
          handle: string
        }
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      posts: {
        Row: {
          id: string
          author_id: string
          body: string
          audience: 'PUBLIC' | 'FOLLOWERS' | 'GROUP'
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      groups: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          cover_url: string | null
          avatar_url: string | null
          privacy: 'PUBLIC' | 'PRIVATE'
          parent_id: string | null
          member_count: number
          subgroup_count: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      stories: {
        Row: {
          id: string
          author_id: string
          status: 'ACTIVE' | 'EXPIRED' | 'DELETED'
          expires_at: string
          created_at: string
          deleted_at: string | null
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          actor_id: string | null
          type: string
          post_id: string | null
          comment_id: string | null
          group_id: string | null
          body: string | null
          is_read: boolean
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          body: string
          media_url: string | null
          sent_at: string
          deleted_at: string | null
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      conversations: {
        Row: {
          id: string
          is_group: boolean
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
          joined_at: string
          last_read_at: string | null
          left_at: string | null
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'OWNER' | 'ADMIN' | 'MEMBER'
          status: 'ACTIVE' | 'PENDING' | 'BANNED'
          joined_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      media: {
        Row: {
          id: string
          uploader_id: string
          url: string
          type: 'IMAGE' | 'VIDEO'
          story_id: string | null
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      reactions: {
        Row: {
          id: string
          user_id: string
          post_id: string
          emoji: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      user_interests: {
        Row: { user_id: string; interest_id: string }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      story_views: {
        Row: {
          story_id: string
          viewer_id: string
          viewed_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Views: {
      feed_posts: {
        Row: {
          id: string
          body: string
          likes_count: number
          comments_count: number
          created_at: string
          author_handle: string
          author_name: string
          author_avatar: string | null
          author_username: string | null
          image_url: string | null
          tags: string[]
          mention_handle: string | null
        }
      }
    }
    Functions: {
      expire_stories: { Args: Record<string, never>; Returns: undefined }
    }
    Enums: Record<string, never>
  }
}
