import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

// --- Helper function to update user data in Supabase after a successful checkout ---
const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  let userId = session.client_reference_id;
  const userEmail = session.customer_details?.email;

  if (!userId) {
    if (!userEmail) {
      console.error('User ID and Email not found in checkout session.');
      return;
    }
    console.warn(`Client reference ID not found, falling back to finding user by email: ${userEmail}`);
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error('Error listing auth users:', authError);
      return;
    }
    const user = authUsers.users.find(u => u.email === userEmail);
    if (!user) {
      console.error(`Auth user with email ${userEmail} not found.`);
      // create user with confimed email
      const { data, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        password: Math.random().toString(36).slice(-8),
        email_confirm: true,
      });
      if (data) {
        userId = data?.user?.id || null;
        // send supabses reset link for password
        console.log('Generating password reset link...');
        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(userEmail, {redirectTo: `https://cuberama.app/update-password/`});
        if (error) {
          console.error('Error generating password reset link:', error);
        }
      }
      if (createUserError) {
        console.error('Error creating auth user:', createUserError);
        return;
      }
    }
  }

  if (!userId) {
    console.error('Could not determine user ID for checkout session.');
    return;
  }
  
  // --- Create an order record ---
  const orderData = {
    id: session.id,
    user_id: userId,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
    metadata: session.metadata,
  };

  const { error: orderError } = await supabaseAdmin
    .from('orders')
    .insert(orderData);

  if (orderError) {
    console.error(`Error creating order ${session.id} for user ${userId}:`, orderError);
    // Do not return, as we still want to try and update the profile
  } else {
    console.log(`Order ${session.id} for user ${userId} created successfully.`);
  }

  // --- Update profile to grant pro status ---
  if (session.payment_status === 'paid') {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error(`Error fetching profile for user ${userId}:`, profileError);
      return;
    }

    if (profile) {
      // Update existing profile
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ pro_status: true, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (updateError) {
        console.error(`Error updating profile for user ${userId}:`, updateError);
      } else {
        console.log(`Profile for user ${userId} updated to pro status.`);
      }
    } else {
      // Create new profile
      if (!userEmail) {
          console.error(`Cannot create profile for user ${userId} without an email.`);
          return;
      }
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail,
          pro_status: true,
        });

      if (insertError) {
        console.error(`Error creating profile for user ${userId}:`, insertError);
      } else {
        console.log(`New profile created for user ${userId} with pro status.`);
      }
    }
  }
};

// --- Stripe Webhook Handler ---

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET environment variable not set');
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).send('Missing Stripe signature');
  }

  const buf = await buffer(req);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

export default handler;
