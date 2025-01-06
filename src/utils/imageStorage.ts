import { supabase } from "@/integrations/supabase/client";

export const uploadImageToStorage = async (imageBlob: Blob, prompt: string, modelId: string, isNSFW: boolean) => {
  try {
    // Generate a unique filename
    const filename = `${crypto.randomUUID()}.png`;
    
    // Upload the image to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('generated-images')
      .upload(filename, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (storageError) {
      throw storageError;
    }

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(filename);

    // Save the image metadata to the database
    const { data: dbData, error: dbError } = await supabase
      .from('generated_images')
      .insert({
        url: publicUrl,
        prompt,
        model_id: modelId,
        is_nsfw: isNSFW,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    return { publicUrl, imageData: dbData };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const fetchGeneratedImages = async () => {
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};