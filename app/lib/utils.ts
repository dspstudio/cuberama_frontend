import { User } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const md5 = (data: string): string => {
    return createHash('md5').update(data).digest('hex');
};

export const getAvatarUrl = (user: User | null, size: number = 40): string => {
    if (!user || !user.email) {
        // Fallback for a logged-out user, when user object is not available, or email is missing
        // Using a default Gravatar identifier. 'mp' is for 'mystery person'.
        return `https://www.gravatar.com/avatar/?s=${size}&d=mp`;
    }

    const userEmail = user.email.trim().toLowerCase();
    const hash = md5(userEmail);

    // Prioritize avatar_url from user metadata, then fallback to Gravatar.
    return user.user_metadata?.avatar_url || `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
};
