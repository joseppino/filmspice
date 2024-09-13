import { error } from "@sveltejs/kit";
import { supabase } from "./supabaseClient";
import { randomUUID } from "crypto";

export default async function(file: File) {
  const uuid: string = randomUUID().toString();
  const fileExtension = file.name.split('.').at(-1);

  if(fileExtension && ["jpeg", "jpg", "png"].includes(fileExtension.toLowerCase())) {
    const uploadURL = await generateUploadURL(uuid, fileExtension);
    if(uploadURL) {
      const success = await upload(uuid, fileExtension, uploadURL.token, file);
      if(success) {
        return uploadURL.path;
      } 
    }
    error(500);
  }
  error(400, {
    message: "Bad request: unacceptable file extension"
  });
}

async function generateUploadURL(uuid: string, fileExtension: string) {
  
  
  const { data, error } = await supabase
  .storage
  .from('filmspice')
  .createSignedUploadUrl(`in/${uuid}.${fileExtension}`);

  if(error) {
    // throw new Error(error.message);
    console.error("Error generating URL: " + error.message);
  }
  return data;
}

async function upload(uuid: string, fileExtension: string, token: string, file: File) {
  const { data, error } = await supabase
  .storage
  .from('filmspice')
  .uploadToSignedUrl(`in/${uuid}.${fileExtension}`, token, file);

  if(error) {
    // throw new Error(error.message);
    console.error("Error uploading file: " + error.message);
    return false;
  }
  return true;
}