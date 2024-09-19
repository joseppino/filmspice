import uploadFile from '$lib/server/uploadFile.js';
import { fail } from '@sveltejs/kit';
import createSignedURL from '$lib/server/createSignedURL';

export const actions = {
	default: async ({ cookies, request }) => {
    let signedImageURL: string = "";
		const formData = Object.fromEntries(await request.formData());
    console.log(formData);  
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
      const filmify_config = validateFormData(formData);

      try {
        const path = await uploadFile(photo);
        const payload = JSON.stringify({
          image_path: path,
          ...filmify_config
        });
        console.log("Payload:");
        console.log(payload);
        
        const res = await fetch("http://127.0.0.1:8000/filmify/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image_path: path,
            ...filmify_config
          })
        })
        // if(!res.status) CHECK FOR ERROR CODE
        const responseJson = await res.json();
        if("filmified_image_path" in responseJson) {
          signedImageURL = await createSignedURL(responseJson.filmified_image_path) ?? "";
        }
        
      } catch (e) {
        console.error(e);
      }
    }
    return {
      filmifiedImageURL: signedImageURL
    }
  }
};

// export const load: PageLoad = async (data: any) => {
//   return { data };
// };

function validateFormData(formData: any) {
  let greyscale: number = 0;
  let grainType: number = 1;
  let powerScaled: number[] = [0.8, 0.2, 0.1];
  let sharpen: number = 0;
  let scale: number = 1;
  let saturation: number = 0.8;

  if("greyscale" in formData) {
    greyscale = 1;
    saturation = 0.8;
  }

  if("graintype" in formData) {
    grainType = Number(formData.graintype);
  }
  
  if("power" in formData) {
    switch(Number(formData.power)) {
      case 1:
        powerScaled = [0.7, 0.1, 0.1];
        break;
      case 2:
        powerScaled = [0.75, 0.2, 0.1];
        break
      case 3:
        powerScaled = [0.8, 0.2, 0.2];
        break;
      case 4:
        powerScaled = [0.9, 0.2, 0.2];
        break;
      case 5:
        powerScaled = [1.0, 0.3, 0.3];
        break;
      default:
        powerScaled = [0.8, 0.2, 0.1];
        break;
    }
  }
  

  if("sharpen" in formData) {
    sharpen = 1;
  }

  if("scalesize" in formData) {
    scale = Number(formData.scalesize);
  }

  if("saturation" in formData) {
    saturation = Number(formData.saturation);
  }

  return {
    greyscale: greyscale,
    grainType: grainType,
    power: powerScaled,
    sharpen: sharpen,
    scale: scale,
    saturation: saturation
  }
}