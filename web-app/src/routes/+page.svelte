<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { error } from "@sveltejs/kit";
  import { Toaster, toast } from "svelte-french-toast";
  import { Moon } from "svelte-loading-spinners";
  //@ts-ignore
  import ImageCompare from "svelte-image-compare";
  import ImageCompareModal from "$lib/components/ImageCompareModal.svelte";
  

  export let form;

  let showModal: boolean = false;
  let filmifiedImageURL: string = "";
  let jobSubmitted: boolean = false;

  $: if(form && "filmifiedImageURL" in form) {
    awaitingFilmification = false;
    if (form.filmifiedImageURL) filmifiedImageURL = form.filmifiedImageURL;
    console.log(form.filmifiedImageURL);
    
  }

  $: filmified = filmifiedImageURL.length > 0;
  
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
  let coarsenessValue: number = 2;
  let coarsenessValueDescription: string = "Fine";
  let grainPowerValue: number = 3;
  let grainPowerValueDescription: string = "Medium";
  let greyscaleChecked: boolean = false;

  $: switch(coarsenessValue) {
      case 1:
        coarsenessValueDescription = "Finer";
        break;
      case 3:
        coarsenessValueDescription = "Coarse";
        break;
      case 4:
        coarsenessValueDescription = "Coarser";
        break;
      default:
        coarsenessValueDescription = "Fine";
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
<form class="pure-form" method="post"enctype="multipart/form-data"
  use:enhance
  on:submit={() => jobSubmitted = true}
>
<a href="#">Test Anchor</a>
  <div>
    {#if !jobSubmitted}
    <div id="upload-control">
      <label for="photo" class="custom-file-upload">Upload a photo</label>
      <input accept="image/png, image/jpeg" id="photo" name="photo" type="file" required
        bind:files={files}
        bind:this={fileInput}
        on:change={handleFileInputChange}
      />
    </div>
  {/if}
  </div>

  {#if file && fileValidated}
    {#if !jobSubmitted}
      <button class="reset pure-button"
      on:click={() => {
          fileInput.value = "";
          fileInput.disabled = false;
          //@ts-ignore
          file = null;
          filmifiedImageURL = "";
          filmified = false;
          jobSubmitted = false;
        }
      }
      >Reset
      </button>
    {/if}
    <img src={URL.createObjectURL(file)} alt="" id="imagePreview">

    {#if !jobSubmitted}
      <div id="settings">
        <legend>
          <a href={``} on:click={() => showSettings = !showSettings}>
            Settings +
          </a>
        </legend>
        {#if showSettings}
          <ul>
            <li style="margin-bottom: 5px;">
              <label for="greyscale">Greyscale</label>
              <input type="checkbox" name="greyscale" id="greyscale"
              bind:checked={greyscaleChecked}>
            </li>
            <li>
              <label for="sharpen">Sharpen</label>
              <input type="checkbox" name="sharpen" id="sharpen">
            </li>
            <!-- Remove colour saturation option if greyscale option chosen -->
            {#if !greyscaleChecked}
              <li class="vertical-labelled"
                bind:this={saturationOption}>
                <label for="saturation">{`Saturation (${saturationValue * 100}%)`}</label>
                <input type="range" name="saturation" id="saturation" min="0" max="1" step="0.1" placeholder="0.8"
                bind:value={saturationValue}>
              </li>
            {/if}
            <li class="vertical-labelled">
              <label for="graintype">{`Grain Coarseness (${coarsenessValueDescription})`}</label>
              <input type="range" name="graintype" id="graintype" min="1" max="4" step="1" placeholder="1"
              bind:value={coarsenessValue}>
            </li>
            <li class="vertical-labelled">
              <label for="power">{`Grain Power (${grainPowerValueDescription})`}</label>
              <input type="range" name="power" id="power" min="1" max="5" step="1" placeholder="3"
              bind:value={grainPowerValue}>
            </li>
            <li class="vertical-labelled">
              <label for="scalesize">{`Grain Expansion (${(sizeScaleValue * 100) - 100}%)`}</label>
              <input type="range" name="scalesize" id="scalesize" min="0.5" max="3" step="0.5" placeholder="1.0"
              bind:value={sizeScaleValue}>
            </li>
          </ul>
        {/if}
      </div>
    {/if}
  {/if}

  {#if !jobSubmitted}
    <div>
      <button type="submit" class="pure-button submit"
        on:click={() => awaitingFilmification = true}
      >
      Filmify!</button>
    </div>
  {/if}
</form>

{#if awaitingFilmification}
  <div>
    <Moon size="60" color="var(--colour3)" unit="px" duration="1s" />
    <p>Filmifying...</p>
    <button class="reset pure-button"
      on:click={() => goto("/aborted")}
    >Abort</button>
  </div>
{/if}

{#if filmified}
  <img src={filmifiedImageURL} alt="Spiced" id="filmifiedPreview">
  <a href={filmifiedImageURL} download="filmspice.jpg" target="_blank">Download</a>
  <button class="pure-button" on:click={() => window.location.reload()}>Go Again!</button>

  <ImageCompareModal 
  bind:showModal 
  originalImageUrl={URL.createObjectURL(file)}
  {filmifiedImageURL}
  >
	<!-- <h2 slot="header">
		modal
		<small><em>adjective</em> mod·al \ˈmō-dəl\</small>
	</h2> -->

	<!-- <ol class="definition-list">
		<li>of or relating to modality in logic</li>
		<li>
			containing provisions as to the mode of procedure or the manner of taking effect —used of a
			contract or legacy
		</li>
		<li>of or relating to a musical mode</li>
		<li>of or relating to structure as opposed to substance</li>
		<li>
			of, relating to, or constituting a grammatical form or category characteristically indicating
			predication
		</li>
		<li>of or relating to a statistical mode</li>
	</ol> -->

  


	<!-- <a href="https://www.merriam-webster.com/dictionary/modal">merriam-webster.com</a> -->
  </ImageCompareModal>
{/if}

<button class="pure-button" on:click={() => showModal = true}>Show Modal</button>

