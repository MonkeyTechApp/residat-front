<template>
  <div>
<!--    Top Menu-->
    <div style="height: 60px; width: 100%; background: white; margin: 0px; display: flex; justify-content: space-between; align-items: center">
      <div style="display: flex; align-items: center">
        <a v-if="show_return === true" href="#" style="padding-left: 20px;" >
          <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
          <i @click="getZone(null, null,1)" class="fas fa-arrow-left fa-2x" style="color: black"></i>
        </a>
        <label style="font-family: 'Oswald'; padding-left: 20px; font-size: 20px;
        float: left">Residat - {{ region }}</label>
      </div>
      <ul style="float: right; list-style: none; vertical-align: middle; margin: 0;">
        <li><a href="#" style="text-decoration: none">Climatic Hazard</a></li>
        <li><a href="#" style="text-decoration: none">Location</a></li>
        <li><a href="#" style="text-decoration: none">Images</a></li>
        <li><a href="#" style="text-decoration: none">Additional Data</a></li>
        <li><a href="#" style="text-decoration: none">Contact</a></li>
      </ul>
    </div>

    <div  class="map_content" >
<!--      Left Keys-->
      <div class="key" style="">
        <ul style="display: inline-block; float: left; margin-left: 20px;">
          <h4>Keys</h4>
          <li v-for="item in this.mapKeys" :key="item.name" style="display: block; padding: 8px 1px" >
            <div  v-if="item.map_key_type_id === 1" style="width: 10px; display: inline-block;
             margin-right: 10px; height: 10px; " :style="{'background-color' : item.color }"></div>
            <div  v-if="item.map_key_type_id === 2 && item.map_key_size_id === 1"
                  style="width: 15px; display: inline-block; border-radius: 50%;
             margin-right: 10px; height: 15px; " :style="{'background-color' : item.color }"></div>
            <div  v-if="item.map_key_type_id === 2 && item.map_key_size_id === 2"
                  style="width: 12.5px; display: inline-block; border-radius: 50%;
             margin-right: 10px; height: 12.5px; " :style="{'background-color' : item.color }"></div>
            <div  v-if="item.map_key_type_id === 2 && item.map_key_size_id === 3"
                  style="width: 10px; display: inline-block; border-radius: 50%;
             margin-right: 10px; height: 10px; " :style="{'background-color' : item.color }"></div>
            <div  v-if="item.map_key_type_id === 2 && item.map_key_size_id === 4"
                  style="width: 7.5px; display: inline-block; border-radius: 50%;
             margin-right: 10px; height: 7.5px; " :style="{'background-color' : item.color }"></div>
            <label style="font-size: 0.70em;
                  font-family: 'Montserrat SemiBold'">{{item.name}}</label>
          </li>
        </ul>
        <!--Zone to display image of previous elt in the layout-->
<!--        <div  style=" float: left ; display: inline-block" >-->
<!--          <img @click="getZone(null, null)" style="height: 200px;" v-bind:src="'https://api.residat.com'+  this.zone.image"/>-->
<!--        </div>-->
      </div>

<!--      Map loading-->
      <div class="map">
        <ul>
          <li v-for="item in vectors" :key="item.type.name" style="display: block; padding: 8px">
<!--            Map title-->
            <label style="font-size: 1.1em; display: block;
                  font-family: 'Montserrat SemiBold'">{{item.type.name}}</label>
            <div id="tooltip" display="none" style="position: absolute; display: none;"></div>
<!--            Map-->
            <div v-if="item.graphic_type.id === 1"  style="text-align: center;  display: inline-block;"/>
              <inline-svg
                :src="'http://localhost:8080/'+ item.path"
                viewBox="0 0 1000 1500"
                @mousemove="handleStateHover"
                @mouseout="handleStateLeave"
                @loaded="svgLoaded"
                @click="handleStateClick"
                @unloaded="svgUnloaded"
                @error="svgLoadError"
                width="auto"
                height="auto"
                fill="black"
                aria-label="item."
              ></inline-svg>
<!--            <inline-svg-->
<!--              :src="'https://residat.com/'+item.path"-->
<!--              viewBox="0 0 1000 1500"-->
<!--              @mousemove="handleStateHover"-->
<!--              @mouseout="handleStateLeave"-->
<!--              @loaded="svgLoaded"-->
<!--              @click="handleStateClick"-->
<!--              @unloaded="svgUnloaded"-->
<!--              @error="svgLoadError"-->
<!--              width="100%"-->
<!--              height="auto"-->
<!--              fill="black"-->
<!--              aria-label="item."-->
<!--            ></inline-svg>-->
            <div v-if="item.graphic_type.id === 2" style="text-align: center; display: inline-block;">
              <img  style="width: 80%;" v-bind:src="'https://api.residat.com/'+ item.svg"/>
            </div>
          </li>
        </ul>
        <!--        map carousel-->
        <div v-if="display_chart === true" class="data_display" style="">
          <div style="display: flex; width: 750px; overflow-x: scroll; margin-left: -610px">
            <div v-for="img in images" :key="img">
              <img src="../assets/KAY-KAY.png" width="160px" height="120px" alt="img">
            </div>
          </div>
        </div>
      </div>
      <div style="clear: both"/>
    </div>

<!--    last visible zone-->
    <div v-if="display_chart === true" class="data_display">
      <b-container style="width: 90%; justify-content: space-between; display: flex; flex-direction: column; gap: 50px; margin: 10px 1px">
        <div>
          <h4>Climate Degree of Impact</h4>
          <apexchart width="350" type="donut" :options="optionDonuts" :series="serieDonuts"></apexchart>
        </div>
        <div>
          <h4>Climate Hazard Vulnerability Index</h4>
          <apexchart type="bar" height="350" :options="chartOptionsHistogram" :series="seriesHistogram"></apexchart>
        </div>
        <div>
          <h4>Climate Risk Threats</h4>
          <apexchart type="bar" height="320" :options="chartOptions" :series="seriesLine"></apexchart>
        </div>
      </b-container>

      <div style="clear: both"></div>
    </div>

    <!--    main chart right info sheet-->
    <div v-if="display_chart === false" class="data_display">
      <p style="text-align: justify; padding: 10px;">
        <label style="font-family: 'Montserrat SemiBold'">Residat </label>is an integrated Geospatial web service profiling climate hazards of vulnerable communities in Cameroon. It displays analyzed climate risks data in GIS format and provides climate hazard models that informs risk recommendations for community stakeholders. Its interactive maps serve both as dashboards for forecasting and visualizing updated community climate hazard models and as a data pool for community climate reality. Its integrated SMS and MMS (under development) platform allows subscribers to receive environmental notifications and climate hazard warnings while allowing the user to query visualized data for their subscribed local communities.  This platform is intended to serve as a reference for obtaining reliable community data (data based on administrative sub divisions) to address climate risk in Cameroon and possible beyond. We are prototyping in Mayo-Danay division of the Far North region, Wouri division in Littoral and Noun Division of the West Region of Cameroon. Key technologies involves GIS, Drones and Big data.
      </p>
      <div style="width: 50% ; min-height: 100px; background: #7bed9f; text-align: left; color: #000000; padding: 8px;
          margin-left: 10px; border-radius: 4px" >
        <h1 style="font-family: 'Open Sans Condensed'; font-size: 50px; display: inline-block; margin: 0; padding-right: 10px">45</h1> <img width="24px" src="increasing.png"/>
        <br/><label style="font-family: 'Montserrat SemiBold' ; font-size: 0.8em"> Sub Divisions Covered</label>
      </div>
      <div style="width: 40% ; display: inline-block; min-height: 100px; background: #ff6b81; text-align: left; color: #000000; padding: 8px;
              margin-left: 2.5%; margin-top: 16px; border-radius: 4px" >
        <h1 style="font-family: 'Open Sans Condensed'; font-size: 50px; display: inline-block; margin: 0; padding-right: 10px">41</h1>
        <img width="24px" src="increasing.png"/>
        <br/><label style="font-family: 'Montserrat SemiBold' ; font-size: 0.8em">Bush fires</label>
      </div>

      <div style="width: 40% ; display: inline-block; min-height: 100px; background: #70a1ff; text-align: left; color: #000000; padding: 8px;
              margin-left: 2.5%; margin-top: 16px; border-radius: 4px" >
        <h1 style="font-family: 'Open Sans Condensed'; font-size: 50px; display: inline-block; margin: 0; padding-right: 10px">30</h1>
        <img width="24px" src="increasing.png"/>
        <br/><label style="font-family: 'Montserrat SemiBold' ; font-size: 0.8em">Floods</label>
      </div>

      <div style="width: 40% ; display: inline-block; min-height: 100px; background: #ffffff; text-align: left; color: #000000; padding: 8px;
              margin-left: 2.5%; margin-top: 16px; border-radius: 4px" >
        <h1 style="font-family: 'Open Sans Condensed'; font-size: 50px; display: inline-block; margin: 0; padding-right: 10px">30</h1>
        <img width="24px" src="increasing.png"/>
        <br/><label style="font-family: 'Montserrat SemiBold' ; font-size: 0.8em">Droughts</label>
      </div>

      <div style="width: 40% ; display: inline-block; min-height: 100px; background: #eccc68; text-align: left; color: #000000; padding: 8px;
              margin-left: 2.5%; margin-top: 16px; border-radius: 4px" >
        <h1 style="font-family: 'Open Sans Condensed'; font-size: 50px; display: inline-block; margin: 0; padding-right: 10px">30</h1>
        <img width="24px" src="decreasing.png"/>
        <br/><label style="font-family: 'Montserrat SemiBold' ; font-size: 0.8em">Droughts</label>
      </div>
    </div>

  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'MapVue',
  props: {
    msg: String
  },
  methods: {
    handleStateHover: function (e) {
      if (e.target.tagName === 'path') {
        this.showTooltip(e, e.target.dataset.name)

        if (e.target.dataset.active === 'true') {
          this.color = e.target.style.fill
          e.target.style.fill = '#42b983'
          e.target.style.strokeWidth = '2px'
          e.target.style.stroke = '#ffffff'
          // this.region = e.target.dataset.name
        }
      }
    },
    handleStateLeave: function (e) {
      if (e.target.tagName === 'path') {
        this.hideTooltip()
        if ((e.target.dataset.active === 'true')) {
          e.target.style.fill = this.color
          e.target.style.strokeWidth = '0.25px'
        }
      }
    },
    svgLoaded: function (e) {
      console.log('svg loaded')
    },
    svgUnloaded: function (e) {
      console.log('svg notLoaded')
    },
    svgLoadError: function (e) {
      console.log('svg svgLoadError')
    },
    handleStateClick: function (e) {
      if (e.target.tagName === 'path') {
        if (e.target.dataset.active === 'true') {
          console.log('the zone id is ' + this.zone.id + ' the zone name is ' + this.zone.name)
          this.getZone(e.target.dataset.name, this.zone.id, 0)
        }
      }
      this.hideTooltip()
    },
    showTooltip: function (evt, text) {
      const tooltip = document.getElementById('tooltip')
      tooltip.innerHTML = text
      tooltip.style.display = 'block'
      tooltip.style.left = evt.pageX + 10 + 'px'
      tooltip.style.top = evt.pageY + 10 + 'px'
    },
    hideTooltip: function () {
      var tooltip = document.getElementById('tooltip')
      tooltip.style.display = 'none'
    },
    handleStateClickBtn: function (e) {
      console.log(e)
    },
    init () {
      // this.svg_show = this.svg_camer;
    },
    getZone: function (name, id, isReturn) {
      if (name == null) { name = this.zone.mother.tag_name }
      var URL = ''
      if (id === null) {
        if (this.zone.mother != null) {
          URL = '/adminZone/fetch/specific?tag=' + name + '&key=' + this.zone.mother.id + '&return=' + isReturn
        } else {
          URL = '/adminZone/fetch/specific?tag=' + name + '&return=' + isReturn
        }
      } else {
        URL = '/adminZone/fetch/specific?tag=' + name + '&key=' + id + '&return=' + isReturn
      }
      axios.request({
        url: URL,
        method: 'GET',
        baseURL: 'https://api.residat.com/api',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json'
        }
      }).then(response => {
        console.log(response.data.data)
        this.zone = response.data.data
        if (this.zone.has_data > 0) {
          this.display_chart = true
        } else {
          this.display_chart = false
        }
        this.region = this.zone.name
        this.svg_show = (this.zone.vectors[0].svg)
        this.vectors = (this.zone.vectors)
        this.mapKeys = this.zone.vectors[0].map_keys
        if (this.zone.mother !== null) {
          this.show_return = true
        } else {
          this.show_return = false
        }
        console.log(this.zone.mother)
      }).catch(error => console.log(error))
    }
  },
  mounted () {
    this.init()
    console.log('axios about to be called')
    axios.request({
      url: '/adminZone/1',
      method: 'get',
      baseURL: 'https://api.residat.com/api',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer 40|AcpwdJpFz41c3jffCUM1NvzYg0lpVL19eWHwWXKu'
      }
    }).then(response => {
      console.log('the response is there ')
      const vals = response.data.data
      this.vectors = vals.vectors
      this.svg_show = (vals.vectors[0].svg)
      this.zone = response.data.data
      this.mapKeys = this.zone.vectors[0].map_keys
      if (this.zone.mother === null) {
        this.show_return = false
      } else {
        this.show_retun = true
      }
      console.log('the Keys are '.this.mapKeys)
    }).catch(error => console.log(error)).finally(console.log('Called'))
  },
  data: function () {
    return {
      images: ['1', '11', '13', '14', '11', '13', '14', '11', '13', '14', '11', '13', '14', '11', '13', '14', '11', '13', '14', '11', '13', '14', '11', '13', '14', '18'],
      display_chart: false,
      display_map: true,
      zone: null,
      vectors: [],
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
      mapKeys: [],
      region: 'Cameroon',
      show_return: false,

      show_items: [
        { name: 'Far North', color: '#c9f2d0' },
        { name: 'North', color: '#beffe8' },
        { name: 'Adamawa', color: '#e9ffbe' },
        { name: 'Centre', color: '#f7f2d2' },
        { name: 'South', color: '#cebff2' },
        { name: 'East', color: '#fcd6c5' },
        { name: 'Littoral', color: '#e8befe' },
        { name: 'West', color: '#defcc7' },
        { name: 'South West', color: '#dac6f5' },
        { name: 'North West', color: '#e9ffbe' }
      ],

      show_items_cmr: [
        { name: 'Far North', color: '#c9f2d0' },
        { name: 'North', color: '#beffe8' },
        { name: 'Adamawa', color: '#e9ffbe' },
        { name: 'Centre', color: '#f7f2d2' },
        { name: 'East', color: '#cebff2' },
        { name: 'South', color: '#fcd6c5' },
        { name: 'Littoral', color: '#e8befe' },
        { name: 'West', color: '#defcc7' },
        { name: 'South West', color: '#dac6f5' },
        { name: 'North West', color: '#e9ffbe' }
      ],

      show_items_far_north: [
        { name: 'Logone - Et - Chari', color: '#c6d496' },
        { name: 'Diamaré', color: '#8bbf8d' },
        { name: 'Mayo-Danay', color: '#9fc2d6' },
        { name: 'Mayo-Kani', color: '#c2bfa3' },
        { name: 'Mayo-Tsanaga', color: '#d19ba9' },
        { name: 'Mayo-Sava', color: '#c0b2d4' }
      ],

      show_items_mayo_danay: [
        { name: 'Datchéka Subdivision', color: '#beffe7' },
        { name: 'Gobo Subdivision', color: '#c19ed7' },
        { name: 'Guéré Subdivision', color: '#ffbebe' },
        { name: 'Kalfou Subdivision', color: '#b2b2b2' },
        { name: 'Kar Hay Subdivision', color: '#d19ba9' },
        { name: 'Kay Kay Subdivision', color: '#ffffbe' },
        { name: 'Maga Subdivision', color: '#adf1b0' },
        { name: 'Porhi Subdivision', color: '#ffbee7' },
        { name: 'Tchatibali Subdivision', color: '#ffbebe' },
        { name: 'Vélé Subdivision', color: '#e9ffbe' },
        { name: 'Wina Subdivision', color: '#de9e66' },
        { name: 'Yagoua Subdivision', color: '#df72ff' }
      ],

      svg_show: '',

      seriesLine: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56]
      }],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Floods', 'Droughts', 'Land Slides', 'Bush Fires']
        },
        yaxis: {
          title: {
            text: '$ (thousands)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return '$ ' + val + ' thousands'
            }
          }
        }
      },
      seriesHistogram: [{
        data: [40, 28, 70, 68]
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
            }
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
            return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
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
          ]
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
          align: 'center'
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
      }

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

  .map_content{
    display: block; text-align: left; margin: 0; float: left; width: 65%
  }

  .data_display{
    display: block; text-align: left; margin: 0;  float: right; width: 35%
  }

  .key{
    display: inline-block; float: left; min-height: 100px; width: 20%; text-align: left
  }

  .map{
    display: block; float: left; text-align: center; width: 80%;
  }

  @media only screen and (max-width:800px){
    .map_content{
      width: 100%
    }

    .data_display{
      width: 100%
    }

    .key{
      width: 100%;
      text-align: center;
    }

    .map{
      width: 100%;
    }
  }

  ::-webkit-scrollbar {
    height: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 5px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: black;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: gray;
  }
</style>
