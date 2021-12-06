<template>
  <div id="app">
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

@import url('https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700&family=Montserrat:wght@400;600&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,800&family=Oswald&display=swap');

#nav {
  /*padding: 30px;*/
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

body{
  box-sizing: border-box;
  background: ghostwhite;
  padding: 0; margin: 0;
}
</style>
