import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useCreateFalseReport = () => {

  return useMutation({

    
    async mutationFn(data: any) {
      const { error, data: newPizza } = await supabase
        .from("false_reports")
        .insert({
          user_id: data.user_id,
          post_id: data.post_id,
        })
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return newPizza;
    },
  });
};


export const useFalseReports = (userId?: string, postId?: number) => {
    return useQuery({
      queryKey: ['falseReports', userId, postId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('false_reports')
          .select('id')
          .eq('user_id', userId)
          .eq('post_id', postId);
        
        if (error) throw error;
        return data;
      },
    });
  };