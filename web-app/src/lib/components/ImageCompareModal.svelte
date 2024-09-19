<script lang="ts">
  //@ts-nocheck
	import ImageCompare from "svelte-image-compare";

	export let showModal; // boolean
	export let originalImageUrl: string = "";
	export let filmifiedImageURL: string = "";

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<!-- <slot name="header" /> -->
		<!-- <hr /> -->
		<!-- <slot /> -->
		<ImageCompare
			before={originalImageUrl}
			after={filmifiedImageURL}
			contain={true}
  	>
			<span slot="before">BEFORE</span>
			<span slot="after">AFTER</span>
  	</ImageCompare>
		<!-- <hr /> -->
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={() => dialog.close()}>close modal</button>
	</div>
</dialog>

<style>
	dialog {
		/* max-width: 32em; */
		max-width: 100vw;
		max-height: 100vh;
		/* border-radius: 0.2em; */

		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
		width: 900px;
		height: 800px;
		/* max-width: 100vw;
		max-height: 100vh; */
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
