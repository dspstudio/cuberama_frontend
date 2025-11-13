import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Checkout session ID is required' });
  }

  try {
    // Look up the order by checkout session ID
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('user_id, payment_status')
      .eq('id', sessionId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get user email from auth.users
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(order.user_id);

    if (userError || !user.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate magic link for passwordless login
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?id=${sessionId}`;
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.user.email!,
      options: {
        redirectTo,
      },
    });

    if (linkError || !linkData) {
      console.error('Error generating magic link:', linkError);
      // Still return user data even if link generation fails
      return res.status(200).json({
        email: user.user.email,
        userId: order.user_id,
        paymentStatus: order.payment_status,
        magicLink: null,
      });
    }

    return res.status(200).json({
      email: user.user.email,
      userId: order.user_id,
      paymentStatus: order.payment_status,
      magicLink: linkData.properties.action_link,
    });
  } catch (error) {
    console.error('Error validating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

