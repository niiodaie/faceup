-- Create scan_results table
CREATE TABLE IF NOT EXISTS scan_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  mood TEXT,
  suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for face scans
INSERT INTO storage.buckets (id, name, public) VALUES ('face-scans', 'face-scans', true);

-- Set up RLS (Row Level Security) policies
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own scan results
CREATE POLICY "Users can view own scan results" ON scan_results
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own scan results
CREATE POLICY "Users can insert own scan results" ON scan_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own scan results
CREATE POLICY "Users can update own scan results" ON scan_results
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own scan results
CREATE POLICY "Users can delete own scan results" ON scan_results
  FOR DELETE USING (auth.uid() = user_id);

-- Storage policies for face-scans bucket
CREATE POLICY "Users can upload their own images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'face-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own images" ON storage.objects
  FOR SELECT USING (bucket_id = 'face-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'face-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_scan_results_updated_at BEFORE UPDATE
  ON scan_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

