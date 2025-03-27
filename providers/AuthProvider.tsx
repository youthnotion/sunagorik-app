import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthData = {
  session: Session | null;
  profile: any;
  role: string;
  loading: boolean;
  refreshProfile: () => Promise<any>;
};

interface Profile {
  id: string;
  username: string;
  full_name: string;
  gender: string;
  about: string;
  avatar_url: string;
  neighborhood: string;
  role: string;
  updated_at: Date;
}

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  role: "general",
  loading: true,
  refreshProfile: async () => null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Fetched profile data:', profileData);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!session?.user?.id) return null;
      const profileData = await fetchProfile(session.user.id);
      setProfile(profileData);
      console.log('profileData: ', profileData);
      return profileData;
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(profile || null);
      } else {
        // Clear profile when no session exists
        setProfile(null);
      }
      setLoading(false)
    };
    console.log('session', session);
    console.log('profile', profile);
    
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (!session) {
        // Clear profile on logout
        setProfile(null);
      } else {
        // Fetch new profile data on login
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(profile || null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, profile, role: profile?.role || "general", loading, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);