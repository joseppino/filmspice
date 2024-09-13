import uploadFile from '$lib/server/uploadFile.js';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies, request }) => {
    // let responseText;
		const formData = Object.fromEntries(await request.formData());
    if (
      !(formData.photo as File).name ||
      (formData.photo as File).name === 'undefined'
    )
    return fail(400, {
      error: true,
      message: 'You must provide a file to upload'
    });
    const { photo } = formData as { photo: File };
    // limit file size to ~2MB
    if(photo.size > 2097152) {
      return fail(413, {
        error: true,
        message: "File is too large"
      });
    } else {
      try {
        const path = await uploadFile(photo);
        const res = await fetch("http://127.0.0.1:8000/filmify/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image_path: path
          })
        })
        responseText = await res.text();
        console.log();
        
      } catch (e) {
        console.error(e);
      }
    }
    // return {
    //   data: responseText
    // }
  }
};