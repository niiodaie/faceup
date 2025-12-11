-- Supabase Database Schema

-- Users table
CREATE TABLE public.users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE,
  is_pro_user BOOLEAN DEFAULT FALSE
);

-- Profiles table (for additional user data)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE,
  avatar_url TEXT
);

-- Looks table (for generated looks)
CREATE TABLE public.looks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id uuid REFERENCES public.users(id),
  face_shape TEXT,
  skin_tone TEXT,
  eyebrow_type TEXT,
  eye_shape TEXT,
  mood TEXT,
  occasion TEXT,
  hairstyles TEXT[],
  makeup TEXT[],
  glasses TEXT[],
  accessories TEXT[],
  image_url TEXT
);

-- Favorites table
CREATE TABLE public.favorites (
  user_id uuid REFERENCES public.users(id),
  look_id uuid REFERENCES public.looks(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, look_id)
);

-- Salons table
CREATE TABLE public.salons (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  category TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  rating DOUBLE PRECISION,
  hours TEXT,
  contact TEXT
);

-- Products table (for affiliate products)
CREATE TABLE public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  brand TEXT,
  price NUMERIC,
  currency TEXT,
  affiliate_link TEXT,
  image_url TEXT
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Can view own user data." ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Can update own user data." ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for profiles table
CREATE POLICY "Can view own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for looks table
CREATE POLICY "Can view all looks." ON public.looks FOR SELECT USING (true);
CREATE POLICY "Can insert own looks." ON public.looks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Can delete own looks." ON public.looks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for favorites table
CREATE POLICY "Can view own favorites." ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Can insert own favorites." ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Can delete own favorites." ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for salons table
CREATE POLICY "Can view all salons." ON public.salons FOR SELECT USING (true);

-- RLS Policies for products table
CREATE POLICY "Can view all products." ON public.products FOR SELECT USING (true);

-- Set up Storage for user avatars and look images
INSERT INTO storage.buckets (id, name) VALUES
('avatars', 'avatars'),
('look_images', 'look_images');

-- Policies for avatars bucket
CREATE POLICY "Avatar images are publicly readable." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can update their own avatar." ON storage.objects FOR UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatars');

-- Policies for look_images bucket
CREATE POLICY "Look images are publicly readable." ON storage.objects FOR SELECT USING (bucket_id = 'look_images');
CREATE POLICY "Anyone can upload a look image." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'look_images');
CREATE POLICY "Anyone can update their own look image." ON storage.objects FOR UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'look_images');


