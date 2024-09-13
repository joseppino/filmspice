from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

from supabase_client import supabase
from subprocess import run
from PIL import Image
import os

app = FastAPI()

class FilmifyParams(BaseModel):
    image_path: str
    greyscale: int = 0
    typenum: int = 1
    power: list = [0.8,0.2,0.1]
    sharpen: int = 0
    scale: float = 1.0
    saturation: float = 1.0

@app.get("/")
def read_root():
    return 200

@app.post("/filmify/")
def handle_request(params: FilmifyParams):
    output_filename = download_image(params.image_path)
    filmified_filename = filmify_image(output_filename, params)
    filmified_image_path = upload_new_image(filmified_filename)
    jpg_output_filename = filmified_image_path[4::]
    print(jpg_output_filename)
    clean_up(params.image_path, output_filename, filmified_filename, jpg_output_filename)
    return { "filmified_image_path": filmified_image_path}

def download_image(impath: str):
    destination = impath.replace("in/", "")
    with open(destination, 'wb+') as f:
        res = supabase.storage.from_('filmspice').download(impath)
        f.write(res)
    return destination

def filmify_image(filename: str, params: FilmifyParams):
    cmd = ["filmgrainer"]

    if params.greyscale == 1:
        cmd.append("--gray")
    
    cmd.append("--type")
    cmd.append(str(params.typenum))
    
    cmd.append("--power")
    powerarg = ""
    for val in params.power:
        powerarg += f"{val},"
    powerarg = powerarg[:-1]
    cmd.append(powerarg)

    if params.sharpen == 1:
        cmd.append("--sharpen")
        cmd.append("1")

    if(params.scale != 1.0):
        cmd.append("--scale")
        cmd.append(str(params.scale))

    if(params.saturation != 1.0):
        cmd.append("--sat")
        cmd.append(str(params.saturation))
    
    cmd.append("-o")

    output_filename = f"{filename}_filmified.png"
    cmd.append(output_filename)
    
    cmd.append(filename)
    
    run(cmd)

    return output_filename

def upload_new_image(filename: str):
    im = Image.open(filename)
    rgb_im = im.convert('RGB')
    jpg_filename = filename.replace(".png", ".jpg")
    rgb_im.save(jpg_filename)
    with open(jpg_filename, 'rb') as f:
        supabase.storage.from_("filmspice").upload(file=f,path=f"out/{jpg_filename}", file_options={"content-type": "image/png"})
    return f"out/{jpg_filename}"

def clean_up(infolder_filepath: str, downloaded_filepath: str, processed_filepath, jpg_filepath: str):
    # TODO
    # DELETE LOCAL FILES
    # DELETE FILE IN SB "IN FOLDER"
    if os.path.isfile(downloaded_filepath):
        os.remove(downloaded_filepath)
    if os.path.isfile(processed_filepath):
        os.remove(processed_filepath)
    if os.path.isfile(jpg_filepath):
        os.remove(jpg_filepath)
    res = supabase.storage.from_('filmspice').remove(infolder_filepath)