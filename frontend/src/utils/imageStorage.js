import { supabase } from '../supabaseClient';

export const uploadImage = async (file, userId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('face-scans')
      .upload(fileName, file);

    if (error) throw error;

    return { success: true, path: data.path };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
};

export const getImageUrl = (path) => {
  const { data } = supabase.storage
    .from('face-scans')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const deleteImage = async (path) => {
  try {
    const { error } = await supabase.storage
      .from('face-scans')
      .remove([path]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
};

export const saveScanResult = async (userId, imageUrl, mood, suggestions) => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .insert([
        {
          user_id: userId,
          image_url: imageUrl,
          mood: mood,
          suggestions: suggestions,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving scan result:', error);
    return { success: false, error: error.message };
  }
};

export const getUserScanHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return { success: false, error: error.message };
  }
};

