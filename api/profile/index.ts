import { supabase } from "@/lib/supabase";
import { ProfileData } from "@/providers/ProfileFormProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: ProfileData) {
      console.log('Updating profile with data:', data);
      
      const { error, data: updatedProfile } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          full_name: data.fullName,
          gender: data.gender,
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

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: {id: string, avatarPath: string}) {
      console.log('Updating avatar with data:', data);
      
      const { error, data: updatedProfile } = await supabase
        .from("profiles")
        .update({
          avatar_url: data.avatarPath,
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
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      console.log('Avatar updated successfully:', data);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });
};

