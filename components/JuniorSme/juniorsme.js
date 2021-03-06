var templatejuniorsme = `
<div id="juniorsmecomponent">
  <div class="container-fluid">
    <div class="btn-group">
  <button type="button" class="btn btn-danger btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    {{current_location}}
  </button>
  <img class="country" v-bind:src="'images/' + this.current_location + '.png'" >
  <div class="dropdown-menu">
    <a v-for="location in this.all_location"class="dropdown-item" href="#" @click="change_location(location)">{{location}}</a>
  </div>
</div>
    <div class="table-responsive">  
      <table class="table table-hover table-dark">
        <thead>
          <tr>
            <th class="th-sm" scope="col">Hour</th>
            <th class="th-sm" scope="col">Agent Available</th>
            <th  class="th-sm" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(agent,index) in this.junior_sme_daily" v-bind:class="['clickable-row',{ 'bg-info': index == current_hours }]"  role="button">
            <td>{{ index }}:00</td>
            <td>{{agent}}</td>
            <td ><p v-if="index==current_hours && agent" @click="hangoutLink(agent)">Ping Me! <i class="fas fa-comment-dots fa-lg"></i></p></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
`;

var juniorsme = Vue.component("juniorsme", {
  template: templatejuniorsme,
  data() {
    return {
      count: 0,
      junior_sme_daily: "",
      junior_sme_global: "",
      hangout_link: "",
      current_day: "",
      current_hours: "",
      all_location: "",
      current_location: ""
    };
  },
  activated: function () {
    console.log('Junior SME activated')
  },
  deactivated: function () {
    console.log('Junior SME deactivated')
  },
  mounted: function () {
    var current_date = new Date();
    this.current_day = current_date.getDay()
    this.current_hours = current_date.getHours()
    var location;
    // everytime the component is mounted, I get location from local storage
    chrome.storage.sync.get(['location'], function (result) {
      if (result.location) {
        location = result.location;
        this.current_location = result.location;
      }
      else {
        location = "Dublin"
        this.current_location = result.location;
      }

    })
    // console.log(current_date)
    // console.log(this.current_day)
    // console.log(this.current_hours)
    fetch(gitlabUrl + gitlabDataRepo + 'g_junior_sme.json')
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        // console.log(data.juniorsme[this.current_day])
        this.junior_sme_global = data
        this.all_location = Object.keys(data)
        this.current_location = location
        console.log(data[this.current_location])
        this.junior_sme_daily = data[this.current_location].juniorsme[this.current_day]
        this.hangout_link = data[this.current_location].hangout_link
        // console.log(this.hangout_link)
      })
      .catch(error => console.error(error))
    console.log('Junior SME mounted')
  },
  destroyed: function () {
    console.log('Junior SME destroyed')
  },
  methods: {
    hangoutLink(agent) {

      console.log("hangout")
      window.open(this.hangout_link[agent]);
    },
    change_location(location) {
      console.log(location)
      this.current_location = location;
      this.junior_sme_daily = this.junior_sme_global[this.current_location].juniorsme[this.current_day];
      chrome.storage.sync.set({ location: location }, function (result) {
        console.log("location set to " + location);
      });
    }
  },
});
