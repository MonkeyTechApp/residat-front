<template>
  <div >
<!--    <object data="cameroon-details.svg"/>-->
    <div style="display: block; padding: 1% 2.5%;
      float: left; width: 65%; text-align: left; " >
      <h1 style="font-family: 'Montserrat SemiBold' ">{{ region }}</h1>
      <ul>
        <li v-for="item in vectors" :key="item.type.name" style="display: block; padding: 8px">
          <label style="font-size: 0.90em;
                  font-family: 'Montserrat SemiBold'">{{item.type.name}}</label>
          <div id="tooltip" display="none" style="position: absolute; display: none;"></div>
          <div v-if="item.graphic_type.id === 1" @mousemove="handleStateHover" @mouseout="handleStateLeave"
               @click="handleStateClick" id="svg-div" v-html="item.svg" style="text-align: center; display: inline-block;
            float: left"/>

          <div v-if="item.graphic_type.id === 2" style="text-align: center; display: inline-block;
            float: left">
            <img  style="width: 80%;" v-bind:src="'http://localhost:8000'+ item.svg"/>
          </div>

        </li>
      </ul>

<!--      <img alt="Vue logo" src="assets/logo.png">-->
      <div style=" display: inline-block; float: left; min-height: 100px; text-align: left">
        <ul style="display: inline-block; float: left">
          <h5>Key</h5>
          <li v-for="item in show_items" :key="item.name" style="display: block; padding: 8px">
            <div style="width: 10px; display: inline-block; margin-right: 10px; height: 10px; "
                 :style="{'background-color' : item.color }"></div><label style="font-size: 0.70em;
                  font-family: 'Montserrat SemiBold'">{{item.name}}</label>
          </li>
        </ul>
        <div  style=" float: left ; display: inline-block" >
          <img @click="getZone(null, null)" style="height: 200px;" v-bind:src="'http://localhost:8000'+  this.zone.image"/>
        </div>
      </div>

    </div>

    <div  style="display: block; text-align: left; margin: 0; padding: 2.5%; float: right; width: 30%" v-if="display_chart === false">
      <h2 style="font-family: 'Montserrat SemiBold' ">Residat</h2>
      <p style="text-align: justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </p>

      <p style="text-align: justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </p>

      <p style="text-align: justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </p>
    </div>

    <div style="display: block; text-align: left; margin: 0; padding: 2.5%; float: right; width: 30%"
         v-if="display_chart === true">

<!--      <b-container style="width: 50%; float: left">-->
<!--        <b-carousel controls indicators fade label-indicators="left right" img-height="300" img-width="400">-->
<!--          <b-carousel-slide img-src="assets/GOBO-IMACT.png"></b-carousel-slide>-->
<!--          <b-carousel-slide img-src="assets/GOBO-VUL.png"></b-carousel-slide>-->
<!--        </b-carousel>-->

<!--      </b-container>-->
<!--      <ul>-->
<!--        <li v-for="item in vectors" :key="item.type.name" style="display: block; padding: 8px">-->
<!--          <label style="font-size: 0.90em;-->
<!--                  font-family: 'Montserrat SemiBold'">{{item.type.name}}</label>-->
<!--          <div id="tooltip" display="none" style="position: absolute; display: none;"></div>-->
<!--          <div @mousemove="handleStateHover" @mouseout="handleStateLeave"-->
<!--               @click="handleStateClick" id="svg-div" v-html="item.svg" style="text-align: center; display: inline-block;-->
<!--            float: left"/>-->
<!--        </li>-->
<!--      </ul>-->

      <b-container style="width: 100%; float: right">
        <h5>Climate Degree of Impact</h5>
        <apexchart style="" width="380" type="pie" :options="optionDonuts" :series="serieDonuts"></apexchart>
        <h5>Climate Hazard Vulnerability Index</h5>
        <apexchart type="bar" height="380" :options="chartOptionsHistogram" :series="seriesHistogram"></apexchart>
        <h5>Climate Risk Threats</h5>
        <apexchart type="line" height="350" :options="chartOptions" :series="seriesLine"></apexchart>
      </b-container>

      <div style="clear: both"></div>



    </div>


  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'MapVue',
  props: {
    msg: String
  },
  methods : {
    handleStateHover : function (e){
      if (e.target.tagName === "path"){
        this.showTooltip(e,e.target.dataset.name);


        if(e.target.dataset.active === 'true'){
          this.color = e.target.style.fill;
          e.target.style.fill = '#42b983';
          e.target.style.strokeWidth = '2px'
          e.target.style.stroke = '#ffffff'
          this.region = e.target.dataset.name;
        }
      }
    },
    handleStateLeave : function (e){
      if (e.target.tagName === "path" ){
        this.hideTooltip();
        if( (e.target.dataset.active === 'true')){

            e.target.style.fill = this.color;
            e.target.style.strokeWidth = '0.25px'

        }
      }

    },
    handleStateClick : function (e) {

      if (e.target.tagName === "path") {
        if(e.target.dataset.active === 'true'){
          console.log('the zone id is '+ this.zone.id + ' the zone name is '+this.zone.name);
          this.getZone(e.target.dataset.name, this.zone.id);
        }

      }
      this.hideTooltip();
    },
    showTooltip : function (evt, text) {
      let tooltip = document.getElementById("tooltip");
      tooltip.innerHTML = text;
      tooltip.style.display = "block";
      tooltip.style.left = evt.pageX + 10 + 'px';
      tooltip.style.top = evt.pageY + 10 + 'px';
    },
    hideTooltip : function () {
      var tooltip = document.getElementById("tooltip");
      tooltip.style.display = "none";
    },
    handleStateClickBtn : function (e) {
      console.log(e);

    },
    init(){
      // this.svg_show = this.svg_camer;
    },
    getZone : function (name, id){
      if(name == null) {name = this.zone.mother.tag_name;}

      var URL = '';
      if(id === null){
        URL = '/adminZone/fetch/specific?tag='+name
      }else {
        URL = '/adminZone/fetch/specific?tag='+name+'&key='+id;
      }
      axios.request({
        url : URL,
        method : 'GET',
        baseURL : 'http://localhost:8000/api',
        headers : {
          'Content-type': 'application/json',
          'Accept': 'application/json',
        }
      }).then(response => {
        console.log( response.data.data);
        this.zone = response.data.data;
        if(this.zone.has_data > 0){
          this.display_chart = true;
        }else {
          this.display_chart = false;
        }


        this.svg_show = (this.zone.vectors[0].svg);
        this.vectors = (this.zone.vectors);
        console.log(this.zone.mother);

      }).catch(error => console.log(error));
    }
  },
  mounted() {
    this.init();
    console.log('axios about to be called');
    axios.request({
      url : '/adminZone/2e0f800c-0c62-4e3f-ac3c-b6e75fa7c223',
      method : 'get',
      baseURL : 'http://localhost:8000/api',
      headers : {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer 40|AcpwdJpFz41c3jffCUM1NvzYg0lpVL19eWHwWXKu',
      }
    }).then(response => {
      console.log("the response is there ");
      let vals = response.data.data;
      this.vectors = vals.vectors;
      this.svg_show = (vals.vectors[0].svg);
      this.zone = response.data.data;

    }).catch(error => console.log(error)).finally(console.log("Called"));
  },
  data: function () {
    return {
      display_chart : false,
      display_map : true,
      zone : null,
      vectors : [],
      options: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: ['Food Security', 'Water Stress', 'Health', 'Conservation', 'Migration']
        }
      },
      series: [{
        name: 'series-1',
        data: [70, 65, 45, 50]
      }],
      optionDonuts: {},
      serieDonuts: [44, 55, 41, 17],
      color: '',
      region: 'Cameroon',

      show_items: [
        {name : 'Far North' , color : '#c9f2d0'},
        {name : 'North' , color : '#beffe8'},
        {name : 'Adamawa' , color : '#e9ffbe'},
        {name : 'Centre' , color : '#f7f2d2'},
        {name : 'South' , color : '#cebff2'},
        {name : 'East' , color : '#fcd6c5'},
        {name : 'Littoral' , color : '#e8befe'},
        {name : 'West' , color : '#defcc7'},
        {name : 'South West' , color : '#dac6f5'},
        {name : 'North West' , color : '#e9ffbe'},
      ],

      show_items_cmr: [
        {name : 'Far North' , color : '#c9f2d0'},
        {name : 'North' , color : '#beffe8'},
        {name : 'Adamawa' , color : '#e9ffbe'},
        {name : 'Centre' , color : '#f7f2d2'},
        {name : 'East' , color : '#cebff2'},
        {name : 'South' , color : '#fcd6c5'},
        {name : 'Littoral' , color : '#e8befe'},
        {name : 'West' , color : '#defcc7'},
        {name : 'South West' , color : '#dac6f5'},
        {name : 'North West' , color : '#e9ffbe'},
      ],

      show_items_far_north: [
        {name : 'Logone - Et - Chari' , color : '#c6d496'},
        {name : 'Diamaré' , color : '#8bbf8d'},
        {name : 'Mayo-Danay' , color : '#9fc2d6'},
        {name : 'Mayo-Kani' , color : '#c2bfa3'},
        {name : 'Mayo-Tsanaga' , color : '#d19ba9'},
        {name : 'Mayo-Sava' , color : '#c0b2d4'}
      ],

      show_items_mayo_danay: [
        {name : 'Datchéka Subdivision' , color : '#beffe7'},
        {name : 'Gobo Subdivision' , color : '#c19ed7'},
        {name : 'Guéré Subdivision' , color : '#ffbebe'},
        {name : 'Kalfou Subdivision' , color : '#b2b2b2'},
        {name : 'Kar Hay Subdivision' , color : '#d19ba9'},
        {name : 'Kay Kay Subdivision' , color : '#ffffbe'},
        {name : 'Maga Subdivision' , color : '#adf1b0'},
        {name : 'Porhi Subdivision' , color : '#ffbee7'},
        {name : 'Tchatibali Subdivision' , color : '#ffbebe'},
        {name : 'Vélé Subdivision' , color : '#e9ffbe'},
        {name : 'Wina Subdivision' , color : '#de9e66'},
        {name : 'Yagoua Subdivision' , color : '#df72ff'}
      ],

      svg_show : ``,

      seriesLine: [{
        name: 'Website Blog',
        type: 'column',
        data: [440, 505, 414, 671]
      }, {
        name: 'Social Media',
        type: 'line',
        data: [23, 42, 35, 27]
      }],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
        },
        stroke: {
          width: [0, 4]
        },
        title: {
          text: 'Traffic Sources'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001',],
        xaxis: {
          type: 'datetime'
        },
        yaxis: [{
          title: {
            text: 'Website Blog',
          },

        }, {
          opposite: true,
          title: {
            text: 'Social Media'
          }
        }]
      },

      seriesHistogram: [{
        data: [ 40, 28, 70, 68]
      }],
      chartOptionsHistogram: {
        chart: {
          type: 'bar',
          height: 380
        },
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom'
            },
          }
        },
        colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
          '#f48024', '#69d2e7'
        ],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: ['Floods', 'Droughts', 'Land Slides', 'Bush Fires'
          ],
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        title: {
          text: 'Custom DataLabels',
          align: 'center',
          floating: true
        },
        subtitle: {
          text: 'Category Names as DataLabels inside bars',
          align: 'center',
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return ''
              }
            }
          }
        }
      },


    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #tooltip {
    background: #42b983;
    color: white;
    font-size: 0.7em;
    border: 1px solid white;
    border-radius: 10px;
    padding-bottom: 5px;
    padding-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
  }
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .active{
    stroke-width:  2px;
    fill: #42b983;
  }
</style>
