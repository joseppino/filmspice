<script lang="ts">
  import { enhance } from "$app/forms";
  import { Toaster, toast } from "svelte-french-toast";
  import { Moon } from "svelte-loading-spinners";

  export let data;
  export let form;

  let filmifiedImageURL: string = "";

  $: if("responseText" in data) console.log(data.responseText);

  $: if(form && "filmifiedImageURL" in form) {
    awaitingFilmification = false;
    if (form.filmifiedImageURL) filmifiedImageURL = form.filmifiedImageURL;
  }
  
  let fileInput: HTMLInputElement;
  let saturationOption: HTMLLIElement;

  let files: FileList;
  let file: File;
  $: if(files) { file = files[0] };

  let fileValidated: boolean = false;
  let awaitingFilmification: boolean = false;
  let showSettings: boolean = false;
  let sizeScaleValue: number = 1.0;
  let saturationValue: number = 0.8;
  let coarsenessValue: number = 1;
  let coarsenessValueDescription: string = "Finest";
  let grainPowerValue: number = 3;
  let grainPowerValueDescription: string = "Medium";
  let greyscaleChecked: boolean = false;

  $: switch(coarsenessValue) {
      case 2:
        coarsenessValueDescription = "Fine";
        break;
      case 3:
        coarsenessValueDescription = "Coarse";
        break;
      case 4:
        coarsenessValueDescription = "Coarser";
        break;
      default:
        coarsenessValueDescription = "Finer";
        break;
    }

  $: switch(grainPowerValue) {
    case 1:
      grainPowerValueDescription = "Lowest";
      break;
    case 2:
      grainPowerValueDescription = "Low";
      break;
    case 4:
      grainPowerValueDescription = "High";
      break;
    case 5:
      grainPowerValueDescription = "Highest";
      break;
    default:
      grainPowerValueDescription = "Medium";
      break;
  }

  function handleFileInputChange() {
    if(files.length > 0) {
      if(file.size < 2097152) {
        toast.success("File Upload Success!");
        // fileInput.disabled = true;
        fileValidated = true;
        } else {
          toast.error("File is too large!");
          fileInput.value = "";
      }
    }
  }

</script>

<Toaster />
<h1>Filmspice</h1>
<form class="pure-form" method="post"enctype="multipart/form-data" use:enhance>
  <div>
    <div id="upload-control">
      <label for="photo" class="custom-file-upload">Upload a photo</label>
      <input accept="image/png, image/jpeg" id="photo" name="photo" type="file" required
        bind:files={files}
        bind:this={fileInput}
        on:change={handleFileInputChange}
      />
    </div>
  </div>

  {#if file && fileValidated}
    <button class="pure-button reset"
    on:click={() => {
        fileInput.value = "";
        fileInput.disabled = false;
        //@ts-ignore
        file = null;
      }
    }
    >Reset
    </button>
    <div>
      <img src={URL.createObjectURL(file)} alt="" id="imagePreview">
    </div>

    <button type="button" id="settings-btn" class="pure-button"
    on:click={() => showSettings = !showSettings}>Settings +</button>
    {#if showSettings}
      <div id="settings">
      <legend>Settings</legend>
        <ul>
          <li>
            <label for="greyscale">Greyscale</label>
            <input type="checkbox" name="greyscale" id="greyscale"
            bind:checked={greyscaleChecked}>
          </li>
          <li>
            <label for="sharpen">Sharpen</label>
            <input type="checkbox" name="sharpen" id="sharpen">
          </li>
          <li>
            <label for="scalesize">{`Scale Size (${sizeScaleValue * 100}%)`}</label>
            <input type="range" name="scalesize" id="scalesize" min="0.5" max="3" step="0.5" placeholder="1.0"
            bind:value={sizeScaleValue}>
          </li>
          <!-- Remove colour saturation option if greyscale option chosen -->
          {#if !greyscaleChecked}
            <li bind:this={saturationOption}>
              <label for="saturation">{`Saturation (${saturationValue * 100}%)`}</label>
              <input type="range" name="saturation" id="saturation" min="0" max="1" step="0.1" placeholder="0.8"
              bind:value={saturationValue}>
            </li>
          {/if}
          <li>
            <label for="graintype">{`Grain Coarseness (${coarsenessValueDescription})`}</label>
            <input type="range" name="graintype" id="graintype" min="1" max="4" step="1" placeholder="1"
            bind:value={coarsenessValue}>
          </li>
          <li>
            <label for="power">{`Grain Power (${grainPowerValueDescription})`}</label>
            <input type="range" name="power" id="power" min="1" max="5" step="1" placeholder="3"
            bind:value={grainPowerValue}>
          </li>
        </ul>
      </div>
    {/if}
  {/if}

  <button type="submit" class="pure-button submit" on:click={() => awaitingFilmification = true}>Filmify!</button>
</form>

{#if awaitingFilmification}
  <div>
    <Moon size="60" color="var(--colour3)" unit="px" duration="1s" />
    <p>Filmifying...</p>
  </div>
{/if}

{#if filmifiedImageURL}
  <img src={filmifiedImageURL} alt="Spiced">
{/if}

<style>
  input[type="file"] {
    display: none;
  }

  .custom-file-upload {
    border: 1px solid #ccc;
    background-color: #e6e6e6;
    border-radius: 2px;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    color: rgba(0,0,0,.8);
  }

  .custom-file-upload:hover {
    opacity: 90%;
  }

  #upload-control {
    display: flex;
    flex-direction: column;
  }

  #settings-btn {
    font-size: 70%;
  }

  #settings ul{
    list-style-type: none;
    padding: 0;
  }

  

 .submit {
    margin-top: 5px;
 }

 .reset {
  margin-top: 5px;
  background-color: #AE2012;
  color: white;
 }

 #imagePreview {
  min-width: 200px;
  max-width: 300px;
  margin-top: 5px;
  margin-bottom: 5px;
 }
</style>
