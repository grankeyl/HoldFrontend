<template>
  <div class="spinner">
    <div class="bar1"></div>
    <div class="bar2"></div>
    <div class="bar3"></div>
    <div class="bar4"></div>
    <div class="bar5"></div>
    <div class="bar6"></div>
    <div class="bar7"></div>
    <div class="bar8"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
div.spinner {
  position: relative;
  width: 54px;
  height: 54px;
}

div.spinner div {
  width: 9%;
  height: 20%;
  background: #FFF;
  position: absolute;
  left: 46%;
  top: 41%;
  opacity: 0;
  border-radius: 50px;
  box-shadow: 0 0 3px rgba(0,0,0,0.2);
  animation: fade 1s linear infinite;
}

@keyframes fade {
  from {opacity: 1;}
  to {opacity: 0.25;}
}

div.spinner div.bar1 {
  transform: rotate(0deg) translate(0, -130%);
  animation-delay: 0s;
}    
div.spinner div.bar2 {
  transform: rotate(45deg) translate(0, -130%); 
  animation-delay: -0.875s;
}
div.spinner div.bar3 {
  transform: rotate(90deg) translate(0, -130%); 
  animation-delay: -0.75s;
}
div.spinner div.bar4 {
  transform: rotate(135deg) translate(0, -130%); 
  animation-delay: -0.625s;
}
div.spinner div.bar5 {
  transform: rotate(180deg) translate(0, -130%); 
  animation-delay: -0.5s;
}
div.spinner div.bar6 {
  transform: rotate(225deg) translate(0, -130%); 
  animation-delay: -0.375s;
}
div.spinner div.bar7 {
  transform: rotate(270deg) translate(0, -130%); 
  animation-delay: -0.25s;
}
div.spinner div.bar8 {
  transform: rotate(315deg) translate(0, -130%); 
  animation-delay: -0.125s;
}
</style>