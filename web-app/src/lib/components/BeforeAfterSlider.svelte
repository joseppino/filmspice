<script lang="ts">
  import { onMount } from "svelte";

  let slider: HTMLDivElement;
  let before: HTMLDivElement;
  let beforeImage: HTMLImageElement;
  let resizer: HTMLDivElement;

  let active = false;

//Sort overflow out for Overlay Image
onMount(() => {
  let width = slider.offsetWidth;
  console.log(width);
  beforeImage.style.width = width + 'px';

  document.body.addEventListener('mouseup',function(){
   active = false;
   resizer.classList.remove('resize');
  });

  document.body.addEventListener('mouseleave', function() {
    active = false;
    resizer.classList.remove('resize');
  });

  document.body.addEventListener('mousemove',function(e){
    if (!active) return;
    let x = e.pageX;
    x -= slider.getBoundingClientRect().left;
    slideIt(x);
    pauseEvent(e);
  });


  document.body.addEventListener('touchend', deactivateResizer);
  document.body.addEventListener('touchcancel', deactivateResizer);


});

function activateResizer() {
  active = false;
  resizer.classList.remove('resize');
}

function deactivateResizer() {
  active = true;
 resizer.classList.add('resize');
}

//Adjust width of image on resize 
window.addEventListener('resize', function() {
  let width = slider.offsetWidth;
  console.log(width);
  beforeImage.style.width = width + 'px';
})


//calculation for dragging on touch devices
document.body.addEventListener('touchmove',function(e){
  if (!active) return;
  let x;
  
  let i;
  for (i=0; i < e.changedTouches.length; i++) {
  x = e.changedTouches[i].pageX; 
  }
  
  x -= slider.getBoundingClientRect().left;
  slideIt(x);
  pauseEvent(e);
});

function slideIt(x: number){
    let transform = Math.max(0,(Math.min(x,slider.offsetWidth)));
    before.style.width = transform+"px";
    resizer.style.left = transform-0+"px";
}

//stop divs being selected.
function pauseEvent(e: Event){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    // e.cancelBubble=true;
    // e.returnValue=false;
    return false;
}


</script>

<h1>Vanilla JS Responsive Before &amp; After Slider</h1>
<div class="line"></div>

<div class="container">

  <div id="before-after-slider" bind:this={slider}>
    <div id="before-image" bind:this={before}>
      <img src="https://images.pexels.com/photos/3728078/pexels-photo-3728078.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="before"
      bind:this={beforeImage}/>
    </div>

    <div id="after-image">
      <img src="https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="After"/>
    </div>

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div id="resizer"
    bind:this={resizer}
    on:mousedown={activateResizer}
    on:touchstart={activateResizer}
    ></div>

  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap');
* {
  box-sizing:border-box
}

body {
  background:linear-gradient(62deg,#c93072 5%,#3365c0) fixed;
}

h1 {
  color: white;
  text-align:center;
  font-family: 'Roboto', sans-serif;
  margin-bottom:0;
}

.line {
  width:100px;
  height:1px;
  margin:20px auto 40px auto;
  border-bottom:1px solid white;
}

img {
  width:100%;
  display:block;
}

.container {
  width:50%;
  display:block;
  margin:30px auto
}

#before-after-slider {
  width:100%;
  position:relative;
  overflow:hidden;
  border:3px solid white;
}

#after-image {
  display:block
}

#before-image {
  position:absolute;
  height:100%;
  width:50%;
  top:0;
  left:0;
  overflow:hidden;
  z-index:2;
}

#resizer {
  position:absolute;
  display:flex;
  align-items:center;
  z-index:5;
  top:0;
  left:50%;
  height:100%;
  width:4px;
  background:white;
  /*Stop vertical scrolling on touch*/
  -ms-touch-action: pan-y;
    touch-action: pan-y;
}

#resizer:after {
  background:linear-gradient(62deg,#c93072 5%,#3365c0);
  font-family: "Font Awesome 5 Free";
  content:'\f337';
  font-weight:900;
  display:flex;
  justify-content:center;
  align-items:center;
  color:white;
  position:absolute;
  margin: 0 0 0 -22px;
  width:40px;
  height:40px;
  border-radius:50%;
  border:3px solid white;

}

@media (max-width:767px) {
  .container {
    width:100%;
    padding:0 20px
  }
}



</style>