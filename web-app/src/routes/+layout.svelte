<script lang="ts">
  import "$lib/global.css";
  import "purecss";
</script>


<main>
  <slot />
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>