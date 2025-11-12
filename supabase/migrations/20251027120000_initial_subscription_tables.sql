-- Create the products table
CREATE TABLE products (
  id TEXT PRIMARY KEY, -- Stripe Product ID
  active BOOLEAN,
  name TEXT,
  description TEXT,
  image TEXT,
  metadata JSONB
);

COMMENT ON TABLE public.products IS 'Stores product information for subscription plans.';

-- Create the prices table
CREATE TABLE prices (
  id TEXT PRIMARY KEY, -- Stripe Price ID
  product_id TEXT REFERENCES products(id),
  active BOOLEAN,
  description TEXT,
  unit_amount BIGINT, -- Price in the smallest currency unit (e.g., cents)
  currency TEXT CHECK (char_length(currency) = 3),
  type TEXT, -- 'one_time' or 'recurring'
  "interval" TEXT, -- 'day', 'week', 'month', or 'year'
  interval_count INTEGER,
  trial_period_days INTEGER,
  metadata JSONB
);

COMMENT ON TABLE public.prices IS 'Stores pricing information for products.';

-- Create the subscriptions table
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY, -- Stripe Subscription ID
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT, -- e.g., 'trialing', 'active', 'canceled', 'past_due'
  price_id TEXT REFERENCES prices(id),
  quantity INTEGER,
  cancel_at_period_end BOOLEAN,
  created TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  ended_at TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  metadata JSONB
);

COMMENT ON TABLE public.subscriptions IS 'Stores user subscription data.';

-- Enable RLS on the subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own subscriptions
CREATE POLICY "Allow users to read their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Enable RLS on the products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users for products
CREATE POLICY "Allow read access to all authenticated users"
ON public.products
FOR SELECT
USING (auth.role() = 'authenticated');

-- Enable RLS on the prices table
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users for prices
CREATE POLICY "Allow read access to all authenticated users"
ON public.prices
FOR SELECT
USING (auth.role() = 'authenticated');
