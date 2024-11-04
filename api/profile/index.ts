import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProfileUpdateData {
  id: string;
  username?: string;
  fullName?: string;
  avatar?: string;
  about?: string;
  neighborhood?: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: ProfileUpdateData) {
      console.log('Updating profile with data:', data);
      
      const { error, data: updatedProfile } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          full_name: data.fullName,
          avatar_url: data.avatar,
          about: data.about,
          neighborhood: data.neighborhood,
        })
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return updatedProfile;
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      console.log('Profile updated successfully:', data);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });
};
