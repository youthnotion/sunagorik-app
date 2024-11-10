import { supabase } from "@/lib/supabase";
import { Report } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface PostData {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  severity_score: number;
  reported_by: string;
}

// Add interface for filter params
export interface FilterParams {
  status?: string[];
  severity?: boolean;
  user_id?: string; // user ID for filtering my posts
}

export const usePostList = (filters?: FilterParams) => {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          reporter:reported_by (
            full_name
          )
        `);

        if (filters?.status?.length) {
          query = query.in('status', filters.status);
        }
        
        if (filters?.severity) {
          query = query.gte('severity_score', 4);
        }
  
        if (filters?.user_id) {
          query = query.eq('reported_by', filters.user_id);
        }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const usePost = (id: number) => {
  return useQuery<Report>({
    queryKey: ["posts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          reporter:reported_by (
            full_name,
            avatar_url
          )
        `)
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

// interface NearbyPost {
//   id: string;
//   name: string;
//   lat: number;
//   long: number;
//   dist_meters: number;
// }

// export const useNearbyPosts = (
//   latitude: number, 
//   longitude: number,
//   filters?: FilterParams
// ) => {
//   return useQuery({
//     queryKey: ['nearby-posts', latitude, longitude, filters],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .rpc('nearby_reports', {
//           lat: latitude,
//           long: longitude,
//           status_filters: filters?.status || [],
//           min_severity: filters?.severity ? 4 : 0,
//           user_filter: filters?.user_id || null
//         });

//       if (error) {
//         throw new Error(error.message);
//       }
//       return data as NearbyPost[];
//     },
//   });
// };

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: Omit<PostData, "id">) {
      const { error, data: createdPost } = await supabase
      .rpc('insert_post_and_severity', {
        title: data.title,
        category: data.category,
        description: data.description,
        longitude: data.location.longitude,
        latitude: data.location.latitude,
        image: data.image,
        severity_score: data.severity_score,
        reported_by: data.reported_by,
        neighborhood: "default"
      });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      return createdPost;
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("Post created successfully:", data);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};


export const usePostsInView = (region: { latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['posts-in-view', region],
    queryFn: async () => {
      const minLat = region.latitude - region.latitudeDelta / 2;
      const maxLat = region.latitude + region.latitudeDelta / 2;
      const minLong = region.longitude - region.longitudeDelta / 2;
      const maxLong = region.longitude + region.longitudeDelta / 2;

      const { data: posts_in_view, error } = await supabase.rpc('posts_in_view', {
        min_lat: minLat,
        min_long: minLong,
        max_lat: maxLat,
        max_long: maxLong
      });

      console.log("posts_in_view", posts_in_view);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      return posts_in_view ?? [];
    } ,
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    gcTime: 1000 * 60 * 30, 
  })
}