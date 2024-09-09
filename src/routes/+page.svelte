<script lang="ts">
  import { Toaster, toast } from "svelte-french-toast";

  let fileInput: HTMLInputElement;

  let files: FileList;
  let file: File;
  $: if(files) { file = files[0] };

  function handleFileInputChange() {
    console.log(files);
    
    if(files.length > 0) {
      toast.success("File Upload Success!");
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

{#if file}
	<h2>Selected files:</h2>
  <p>{file.name} ({file.size} bytes)</p>
{/if}

<button class="pure-button submit">Filmify!</button>

<style>
 .submit {
    margin-top: 5px;
 }
</style>
