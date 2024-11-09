import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { SeverityRating } from "@/types/type";

interface SeverityRatingData {
  user_id: string;
  post_id: number;
  rating: number;
}

export const useSeverityRatings = (post_id: number, userId?: string) => {
  return useQuery<SeverityRating>({
    queryKey: ["severity_ratings", post_id, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("severity_ratings")
        .select("rating")
        .eq("post_id", post_id)
        .eq("user_id", userId)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useCreateSeverityRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ post_id, user_id, rating }: SeverityRatingData) {
      const { error, data: updatedRating } = await supabase
        .rpc("update_severity_ratings_and_posts", {
          p_post_id: post_id,
          p_user_id: user_id,
          p_rating: rating,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      return updatedRating;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts", variables.post_id] });
      console.log("Rating updated successfully:", data);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};
