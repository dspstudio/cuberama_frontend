CREATE TABLE public.orders (
    id TEXT NOT NULL,
    user_id UUID NOT NULL,
    amount_total INTEGER,
    currency TEXT,
    payment_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
