
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user email matches the admin email
        const adminEmail = 'admin@humanizeai.cloud'; // The admin's email
        
        if (user.email === adminEmail) {
          // This user is the designated admin
          setIsAdmin(true);

          // Check if they already have an admin subscription
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('plan_id', 'admin')
            .maybeSingle();

          // If no admin subscription exists, create one
          if (!data && !error) {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 10); // 10 years from now
            
            const { error: insertError } = await supabase
              .from('subscriptions')
              .insert({
                user_id: user.id,
                plan_id: 'admin',
                status: 'active',
                payment_method: 'manual',
                current_period_end: futureDate.toISOString(),
              });

            if (insertError) {
              console.error('Error creating admin subscription:', insertError);
            }
          }
        } else {
          // For non-admin emails, check if they have an admin subscription
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('plan_id', 'admin')
            .maybeSingle();

          setIsAdmin(!!data && !error);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
