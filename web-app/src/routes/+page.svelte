<script lang="ts">
  import { Toaster, toast } from "svelte-french-toast";
  import { Moon } from "svelte-loading-spinners";

  let fileInput: HTMLInputElement;

  let files: FileList;
  let file: File;
  $: if(files) { file = files[0] };

  let fileValidated: boolean = false;
  let awaitingFilmification: boolean = false;

  function handleFileInputChange() {
    if(files.length > 0) {
      if(file.size < 2097152) {
        toast.success("File Upload Success!");
        fileInput.disabled = true;
        fileValidated = true;
        } else {
          toast.error("File is too large!");
          // fileInput.value = "";
      }
    }
  }

</script>

<Toaster /> 
<h1>Filmspice</h1>
<div>
  <label for="photo">Upload a photo:</label>
  <input accept="image/png, image/jpeg" id="photo" name="photo" type="file"
    bind:files={files}
    bind:this={fileInput}
    on:change={handleFileInputChange}
  />
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
	<h2>Selected files:</h2>
  <p>{file.name} ({file.size} bytes)</p>
  <img src={URL.createObjectURL(file)} alt="" id="imagePreview">
{/if}

<button class="pure-button submit" on:click={() => awaitingFilmification = true}>Filmify!</button>

{#if awaitingFilmification}
  <div>
    <Moon size="60" color="var(--colour3)" unit="px" duration="1s" />
    <p>Filmifying...</p>
  </div>
{/if}

<style>
 .submit {
    margin-top: 5px;
 }

 .reset {
  margin-top: 5px;
  background-color: #AE2012;
  color: white;
 }

 #imagePreview {
  width: 300px;
 }
</style>
