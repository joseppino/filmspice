<script>
  import { goto } from "$app/navigation";
</script>
<h1>Process Aborted</h1>
<button class="pure-button" on:click={() => goto('/')}>Start Over</button>