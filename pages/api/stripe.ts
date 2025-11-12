import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

// Stripe webhook event examples (for reference during development)
// {"id":"evt_1SNvScQCmQuvM3PopxGujRJi","object":"event","api_version":"2025-03-31.basil","created":1761829214,"data":{"object":{"id":"cs_test_b13cXpjpEtZhmwhgdp9EE89n8rowBPUeL4zhDRpZhNlCLCgvv1q7Ywgc2X","object":"checkout.session","adaptive_pricing":{"enabled":true},"after_expiration":null,"allow_promotion_codes":true,"amount_subtotal":9999,"amount_total":4999,"automatic_tax":{"enabled":false,"liability":null,"provider":null,"status":null},"billing_address_collection":"auto","cancel_url":"https://stripe.com","client_reference_id":null,"client_secret":null,"collected_information":null,"consent":null,"consent_collection":{"payment_method_reuse_agreement":null,"promotions":"none","terms_of_service":"none"},"created":1761742814,"currency":"eur","currency_conversion":null,"custom_fields":[],"custom_text":{"after_submit":null,"shipping_address":null,"submit":null,"terms_of_service_acceptance":null},"customer":null,"customer_creation":"if_required","customer_details":null,"customer_email":null,"discounts":[{"coupon":null,"promotion_code":"promo_1SMt6jQCmQuvM3PonAikgcLI"}],"expires_at":1761829214,"invoice":null,"invoice_creation":{"enabled":false,"invoice_data":{"account_tax_ids":null,"custom_fields":null,"description":null,"footer":null,"issuer":null,"metadata":[],"rendering_options":null}},"livemode":false,"locale":"auto","metadata":[],"mode":"payment","origin_context":null,"payment_intent":null,"payment_link":"plink_1SMtAIQCmQuvM3PoIHkqq2JZ","payment_method_collection":"if_required","payment_method_configuration_details":{"id":"pmc_1RBjAmQCmQuvM3PoRujLPhUh","parent":null},"payment_method_options":{"card":{"request_three_d_secure":"automatic"}},"payment_method_types":["card","bancontact","eps","link","mobilepay","paypal","revolut_pay"],"payment_status":"unpaid","permissions":null,"phone_number_collection":{"enabled":false},"recovered_from":null,"saved_payment_method_options":null,"setup_intent":null,"shipping_address_collection":null,"shipping_cost":null,"shipping_options":[],"status":"expired","submit_type":"auto","subscription":null,"success_url":"https://stripe.com","total_details":{"amount_discount":5000,"amount_shipping":0,"amount_tax":0},"ui_mode":"hosted","url":null,"wallet_options":null}},"livemode":false,"pending_webhooks":1,"request":{"id":null,"idempotency_key":null},"type":"checkout.session.expired"} 
// {"id":"evt_1SNw0BQCmQuvM3PoBeGMzYI6","object":"event","api_version":"2025-03-31.basil","created":1761831295,"data":{"object":{"id":"promo_1SMt6jQCmQuvM3PonAikgcLI","object":"promotion_code","active":true,"code":"test50","coupon":{"id":"syKoDNqM","object":"coupon","amount_off":null,"created":1761581650,"currency":null,"duration":"once","duration_in_months":null,"livemode":false,"max_redemptions":null,"metadata":[],"name":"test50","percent_off":50.0,"redeem_by":null,"times_redeemed":1,"valid":true},"created":1761581841,"customer":null,"expires_at":null,"livemode":false,"max_redemptions":null,"metadata":[],"restrictions":{"first_time_transaction":false,"minimum_amount":null,"minimum_amount_currency":null},"times_redeemed":1},"previous_attributes":{"times_redeemed":0}},"livemode":false,"pending_webhooks":1,"request":{"id":null,"idempotency_key":"860ea79d-9133-4851-a885-d959840284e8"},"type":"promotion_code.updated"} 
// {"id":"evt_1SNw0BQCmQuvM3PoLVwFxREN","object":"event","api_version":"2025-03-31.basil","created":1761831295,"data":{"object":{"id":"di_1SNw0AQCmQuvM3PoZ8oVAyPf","object":"discount","checkout_session":"cs_test_b10vXCkWnTIdry0P7Mloebc4GqW9Cbdhk8NONJiFB7sXYy27EzfJQPRanp","coupon":{"id":"syKoDNqM","object":"coupon","amount_off":null,"created":1761581650,"currency":null,"duration":"once","duration_in_months":null,"livemode":false,"max_redemptions":null,"metadata":[],"name":"test50","percent_off":50.0,"redeem_by":null,"times_redeemed":1,"valid":true},"customer":null,"end":null,"invoice":null,"invoice_item":null,"promotion_code":"promo_1SMt6jQCmQuvM3PonAikgcLI","start":1761831294,"subscription":null,"subscription_item":null}},"livemode":false,"pending_webhooks":1,"request":{"id":null,"idempotency_key":"860ea79d-9133-4851-a885-d959840284e8"},"type":"customer.discount.created"} 
// {"id":"evt_3SNw0AQCmQuvM3Po1vgEtqky","object":"event","api_version":"2025-03-31.basil","created":1761831295,"data":{"object":{"id":"ch_3SNw0AQCmQuvM3Po1zFFrX5Z","object":"charge","amount":4999,"amount_captured":4999,"amount_refunded":0,"application":null,"application_fee":null,"application_fee_amount":null,"balance_transaction":null,"billing_details":{"address":{"city":null,"country":"RO","line1":null,"line2":null,"postal_code":null,"state":null},"email":"office@dsp-studio.ro","name":"333","phone":null,"tax_id":null},"calculated_statement_descriptor":"NEW BUSINESS SANDBOX","captured":true,"created":1761831295,"currency":"eur","customer":null,"description":null,"destination":null,"dispute":null,"disputed":false,"failure_balance_transaction":null,"failure_code":null,"failure_message":null,"fraud_details":[],"livemode":false,"metadata":[],"on_behalf_of":null,"order":null,"outcome":{"advice_code":null,"network_advice_code":null,"network_decline_code":null,"network_status":"approved_by_network","reason":null,"risk_level":"normal","risk_score":43,"seller_message":"Payment complete.","type":"authorized"},"paid":true,"payment_intent":"pi_3SNw0AQCmQuvM3Po1DatzIeu","payment_method":"pm_1SNw0AQCmQuvM3PoS0jAXaH6","payment_method_details":{"card":{"amount_authorized":4999,"authorization_code":"900715","brand":"visa","checks":{"address_line1_check":null,"address_postal_code_check":null,"cvc_check":"pass"},"country":"US","exp_month":11,"exp_year":2033,"extended_authorization":{"status":"disabled"},"fingerprint":"Cxz1jdd2Gcf5dKR5","funding":"credit","incremental_authorization":{"status":"unavailable"},"installments":null,"last4":"1111","mandate":null,"multicapture":{"status":"unavailable"},"network":"visa","network_token":{"used":false},"network_transaction_id":"671201224910610","overcapture":{"maximum_amount_capturable":4999,"status":"unavailable"},"regulated_status":"unregulated","three_d_secure":null,"wallet":null},"type":"card"},"radar_options":[],"receipt_email":null,"receipt_number":null,"receipt_url":"https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUkJqQUdRQ21RdXZNM1BvKIDTjcgGMgYfBIQ3lS46LBaCJw-4_HWy3O1WHFFJ_ufm1YyO3woJxCwrzodmwOF-UiT-EZYZtJvp6e0D","refunded":false,"review":null,"shipping":null,"source":null,"source_transfer":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"succeeded","transfer_data":null,"transfer_group":null}},"livemode":false,"pending_webhooks":1,"request":{"id":null,"idempotency_key":"860ea79d-9133-4851-a885-d959840284e8"},"type":"charge.succeeded"} 
// {"id":"evt_3SNw0AQCmQuvM3Po1bCoBbDM","object":"event","api_version":"2025-03-31.basil","created":1761831295,"data":{"object":{"id":"pi_3SNw0AQCmQuvM3Po1DatzIeu","object":"payment_intent","amount":4999,"amount_capturable":0,"amount_details":{"shipping":{"amount":0,"from_postal_code":null,"to_postal_code":null},"tax":{"total_tax_amount":0},"tip":[]},"amount_received":4999,"application":null,"application_fee_amount":null,"automatic_payment_methods":null,"canceled_at":null,"cancellation_reason":null,"capture_method":"automatic_async","client_secret":"pi_3SNw0AQCmQuvM3Po1DatzIeu_secret_BEHgd70oapAXDiHnglSBAIgCL","confirmation_method":"automatic","created":1761831294,"currency":"eur","customer":null,"description":null,"excluded_payment_method_types":null,"last_payment_error":null,"latest_charge":"ch_3SNw0AQCmQuvM3Po1zFFrX5Z","livemode":false,"metadata":[],"next_action":null,"on_behalf_of":null,"payment_details":{"customer_reference":null,"order_reference":"prod_TJPwBo9idV6uqk"},"payment_method":"pm_1SNw0AQCmQuvM3PoS0jAXaH6","payment_method_configuration_details":null,"payment_method_options":{"card":{"installments":null,"mandate_options":null,"network":null,"request_three_d_secure":"automatic"}},"payment_method_types":["card"],"processing":null,"receipt_email":null,"review":null,"setup_future_usage":null,"shipping":null,"source":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"succeeded","transfer_data":null,"transfer_group":null}},"livemode":false,"pending_webhooks":1,"request":{"id":null,"idempotency_key":"860ea79d-9133-4851-a885-d959840284e8"},"type":"payment_intent.succeeded"} 
// {"id":"evt_3SNw0AQCmQuvM3Po1kn0dfOT","object":"event","api_version":"2025-03-31.basil","created":1761831294,"data":{"object":{"id":"pi_3SNw0AQCmQuvM3Po1DatzIeu","object":"payment_intent","amount":4999,"amount_capturable":0,"amount_details":{"tip":[]},"amount_received":0,"application":null,"application_fee_amount":null,"automatic_payment_methods":null,"canceled_at":null,"cancellation_reason":null,"capture_method":"automatic_async","client_secret":"pi_3SNw0AQCmQuvM3Po1DatzIeu_secret_BEHgd70oapAXDiHnglSBAIgCL","confirmation_method":"automatic","created":1761831294,"currency":"eur","customer":null,"description":null,"excluded_payment_method_types":null,"last_payment_error":null,"latest_charge":null,"livemode":false,"metadata":[],"next_action":null,"on_behalf_of":null,"payment_method":null,"payment_method_configuration_details":null,"payment_method_options":{"card":{"installments":null,"mandate_options":null,"network":null,"request_three_d_secure":"automatic"}},"payment_method_types":["card"],"processing":null,"receipt_email":null,"review":null,"setup_future_usage":null,"shipping":null,"source":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"requires_payment_method","transfer_data":null,"transfer_group":null}},"livemode":false,"pending_webhooks":1,"request":{"id":null,"idempotency_key":"860ea79d-9133-4851-a885-d959840284e8"},"type":"payment_intent.created"} 
// {"id":"evt_1SNw0CQCmQuvM3Po1UAm8odH","object":"event","api_version":"2025-03-31.basil","created":1761831295,"data":{"object":{"id":"cs_test_b10vXCkWnTIdry0P7Mloebc4GqW9Cbdhk8NONJiFB7sXYy27EzfJQPRanp","object":"checkout.session","adaptive_pricing":{"enabled":true},"after_expiration":null,"allow_promotion_codes":true,"amount_subtotal":9999,"amount_total":4999,"automatic_tax":{"enabled":false,"liability":null,"provider":null,"status":null},"billing_address_collection":"auto","cancel_url":"https://stripe.com","client_reference_id":null,"client_secret":null,"collected_information":null,"consent":null,"consent_collection":{"payment_method_reuse_agreement":null,"promotions":"none","terms_of_service":"none"},"created":1761831277,"currency":"eur","currency_conversion":null,"custom_fields":[],"custom_text":{"after_submit":null,"shipping_address":null,"submit":null,"terms_of_service_acceptance":null},"customer":null,"customer_creation":"if_required","customer_details":{"address":{"city":null,"country":"RO","line1":null,"line2":null,"postal_code":null,"state":null},"business_name":null,"email":"office@dsp-studio.ro","individual_name":null,"name":"333","phone":null,"tax_exempt":"none","tax_ids":[]},"customer_email":null,"discounts":[{"coupon":null,"promotion_code":"promo_1SMt6jQCmQuvM3PonAikgcLI"}],"expires_at":1761917677,"invoice":null,"invoice_creation":{"enabled":false,"invoice_data":{"account_tax_ids":null,"custom_fields":null,"description":null,"footer":null,"issuer":null,"metadata":[],"rendering_options":null}},"livemode":false,"locale":"auto","metadata":[],"mode":"payment","origin_context":null,"payment_intent":"pi_3SNw0AQCmQuvM3Po1DatzIeu","payment_link":"plink_1SMtAIQCmQuvM3PoIHkqq2JZ","payment_method_collection":"if_required","payment_method_configuration_details":{"id":"pmc_1RBjAmQCmQuvM3PoRujLPhUh","parent":null},"payment_method_options":{"card":{"request_three_d_secure":"automatic"}},"payment_method_types":["card","bancontact","eps","link","mobilepay","paypal","revolut_pay"],"payment_status":"paid","permissions":null,"phone_number_collection":{"enabled":false},"recovered_from":null,"saved_payment_method_options":null,"setup_intent":null,"shipping_address_collection":null,"shipping_cost":null,"shipping_options":[],"status":"complete","submit_type":"auto","subscription":null,"success_url":"https://stripe.com","total_details":{"amount_discount":5000,"amount_shipping":0,"amount_tax":0},"ui_mode":"hosted","url":null,"wallet_options":null}},"livemode":false,"pending_webhooks":1,"request":{"id":null,"idempotency_key":null},"type":"checkout.session.completed"} 
// {"id":"evt_3SNw0AQCmQuvM3Po1jx2O9jX","object":"event","api_version":"2025-03-31.basil","created":1761831298,"data":{"object":{"id":"ch_3SNw0AQCmQuvM3Po1zFFrX5Z","object":"charge","amount":4999,"amount_captured":4999,"amount_refunded":0,"application":null,"application_fee":null,"application_fee_amount":null,"balance_transaction":"txn_3SNw0AQCmQuvM3Po195gcFrM","billing_details":{"address":{"city":null,"country":"RO","line1":null,"line2":null,"postal_code":null,"state":null},"email":"office@dsp-studio.ro","name":"333","phone":null,"tax_id":null},"calculated_statement_descriptor":"NEW BUSINESS SANDBOX","captured":true,"created":1761831295,"currency":"eur","customer":null,"description":null,"destination":null,"dispute":null,"disputed":false,"failure_balance_transaction":null,"failure_code":null,"failure_message":null,"fraud_details":[],"livemode":false,"metadata":[],"on_behalf_of":null,"order":null,"outcome":{"advice_code":null,"network_advice_code":null,"network_decline_code":null,"network_status":"approved_by_network","reason":null,"risk_level":"normal","risk_score":43,"seller_message":"Payment complete.","type":"authorized"},"paid":true,"payment_intent":"pi_3SNw0AQCmQuvM3Po1DatzIeu","payment_method":"pm_1SNw0AQCmQuvM3PoS0jAXaH6","payment_method_details":{"card":{"amount_authorized":4999,"authorization_code":"900715","brand":"visa","checks":{"address_line1_check":null,"address_postal_code_check":null,"cvc_check":"pass"},"country":"US","exp_month":11,"exp_year":2033,"extended_authorization":{"status":"disabled"},"fingerprint":"Cxz1jdd2Gcf5dKR5","funding":"credit","incremental_authorization":{"status":"unavailable"},"installments":null,"last4":"1111","mandate":null,"multicapture":{"status":"unavailable"},"network":"visa","network_token":{"used":false},"network_transaction_id":"671201224910610","overcapture":{"maximum_amount_capturable":4999,"status":"unavailable"},"regulated_status":"unregulated","three_d_secure":null,"wallet":null},"type":"card"},"radar_options":[],"receipt_email":null,"receipt_number":null,"receipt_url":"https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUkJqQUdRQ21RdXZNM1BvKILTjcgGMgazfv6GNgw6LBbVRJlqlpyzM7KU81Y43ahr9sszvYxydHobvuMMyGwRjz9mQp24pVghuwsY","refunded":false,"review":null,"shipping":null,"source":null,"source_transfer":null,"statement_descriptor":null,"statement_descriptor_suffix":null,"status":"succeeded","transfer_data":null,"transfer_group":null},"previous_attributes":{"balance_transaction":null,"receipt_url":"https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUkJqQUdRQ21RdXZNM1BvKILTjcgGMgbCj5g54Eg6LBb34_ihgJ_0zh5T1RlgF_5kxmE3G-Cp2fsJQN-Q5AI9XraARUaTj0jHNGvF"}},"livemode":false,"pending_webhooks":1,"request":{"id":null,"idempotency_key":null},"type":"charge.updated"} 

// --- Helper function to update user data in Supabase after a successful charge ---
const handleChargeSucceeded = async (charge: Stripe.Charge) => {
  const email = charge.billing_details.email;

  if (!email) {
    console.error('Email not found in charge details');
    return;
  }

  // Find the user's ID from auth.users using the email
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.listUsers();

  if (authError) {
    console.error('Error listing auth users:', authError);
    return;
  }

  const user = authUser.users.find(u => u.email === email);

  if (!user) {
    console.error(`Auth user with email ${email} not found.`);
    return;
  }

  // Check if a profile exists for this user
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error(`Error fetching profile for user ${user.id}:`, profileError);
    return;
  }

  if (profile) {
    // Update existing profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ pro_status: true, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.error(`Error updating profile for user ${user.id}:`, updateError);
    } else {
      console.log(`Profile for user ${user.id} updated to pro status.`);
    }
  } else {
    // Create new profile
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        email: email,
        pro_status: true,
      });

    if (insertError) {
      console.error(`Error creating profile for user ${user.id}:`, insertError);
    } else {
      console.log(`New profile created for user ${user.id} with pro status.`);
    }
  }
};

// --- Helper function to update user data in Supabase after a successful checkout ---
const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  const email = session.customer_details?.email;

  if (!email) {
    console.error('Email not found in checkout session');
    return;
  }

  // Find the user's ID from auth.users using the email
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.listUsers();

  if (authError) {
    console.error('Error listing auth users:', authError);
    return;
  }

  const user = authUser.users.find(u => u.email === email);

  if (!user) {
    console.error(`Auth user with email ${email} not found.`);
    return;
  }

  // Check if a profile exists for this user
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error(`Error fetching profile for user ${user.id}:`, profileError);
    return;
  }

  if (profile) {
    // Update existing profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ pro_status: true, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.error(`Error updating profile for user ${user.id}:`, updateError);
    } else {
      console.log(`Profile for user ${user.id} updated to pro status.`);
    }
  } else {
    // Create new profile
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        email: email,
        pro_status: true,
      });

    if (insertError) {
      console.error(`Error creating profile for user ${user.id}:`, insertError);
    } else {
      console.log(`New profile created for user ${user.id} with pro status.`);
    }
  }
};

// --- Helper function to update subscription data in Supabase ---
const manageSubscriptionChange = async (subscription: Stripe.Subscription) => {
  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
  const userId = customer.metadata.userId;

  if (!userId) {
    console.error('User ID not found in customer metadata');
    return;
  }

  const subscriptionData = {
    id: subscription.id,
    user_id: userId,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.items.data.length,
    cancel_at_period_end: subscription.cancel_at_period_end,
    created: new Date(subscription.created * 1000).toISOString(),
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(new Date().setFullYear(new Date().getFullYear() + 99)).toISOString(),
    ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
  };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);

  if (error) {
    console.error('Error upserting subscription:', error);
  } else {
    console.log(`Subscription ${subscription.id} for user ${userId} successfully managed.`);
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
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await manageSubscriptionChange(event.data.object as Stripe.Subscription);
      break;
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'charge.succeeded':
      await handleChargeSucceeded(event.data.object as Stripe.Charge);
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

export default handler;
