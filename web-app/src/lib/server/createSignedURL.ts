import { supabase } from "./supabaseClient";

export default async function(imagePath: string) {
  const { data, error } = await supabase
    .storage
    .from('filmspice')
    .createSignedUrl(imagePath, 120);

  return data?.signedUrl;
}