// Start MQTT Connection
const clientId = "clientId-" + Math.random().toString(16);   // Like clientId-1
const client = new Paho.MQTT.Client("broker.hivemq.com", Number(8884), "/mqtt", clientId);

// Set MQTT Callback Function
client.onMessageArrived = onMessageArrived;
client.onConnectionLost = onConnectionLost;
client.connect({
  useSSL: true,
  onSuccess: onConnect,
  onFailure: onFailure
});


// Create Data Variables
var ax1_data = [];
var ay1_data = [];
var az1_data = [];
var gx1_data = [];
var gy1_data = [];
var gz1_data = [];
var ax2_data = [];
var ay2_data = [];
var az2_data = [];
var gx2_data = [];
var gy2_data = [];
var gz2_data = [];
var axm_data = [];
var aym_data = [];
var azm_data = [];
var gxm_data = [];
var gym_data = [];
var gzm_data = [];
var hr_data = [];

var xlabel = {
    title: "Data Point",
    range: [0, 50],
    autorange: true
  };
var ylabel = {
    title: "Value",
    range: [0, 30],
    autorange: true
  };
var legend = {
    y:0.5,
    font:{size: 16}
    // traceorder: 'reversed',
  };
// MQTT Connect Function
function onConnect() {
  console.log("Connected");
  client.subscribe("ton/server/#");
  message = new Paho.MQTT.Message(JSON.stringify({"data":"HELLO MQTT"}));
  message.destinationName = "ton/server";
  // client.send(message);
}

// MQTT Connection Failure Function
function onFailure(responseObject) {
  console.log("Connection Failed: " + responseObject.errorMessage);
}

// MQTT Connection Lost Function
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("Connection Lost"+responseObject.errorMessage);
  }
}

// MQTT Message Arrive Function
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
  var data = JSON.parse(message.payloadString);
  if ("ax1" in data){
    ax1_data = ax1_data.concat(data.ax1);
    ay1_data = ay1_data.concat(data.ay1);
    az1_data = az1_data.concat(data.az1);
    gx1_data = gx1_data.concat(data.gx1);
    gy1_data = gy1_data.concat(data.gy1);
    gz1_data = gz1_data.concat(data.gz1);
    plot_data1();
  }
  else if ("ax2" in data){
    ax2_data = ax2_data.concat(data.ax2);
    ay2_data = ay2_data.concat(data.ay2);
    az2_data = az2_data.concat(data.az2);
    gx2_data = gx2_data.concat(data.gx2);
    gy2_data = gy2_data.concat(data.gy2);
    gz2_data = gz2_data.concat(data.gz2);
    plot_data2();
  }
  else if ("axm" in data){
    axm_data = axm_data.concat(data.axm);
    aym_data = aym_data.concat(data.aym);
    azm_data = azm_data.concat(data.azm);
    gxm_data = gxm_data.concat(data.gxm);
    gym_data = gym_data.concat(data.gym);
    gzm_data = gzm_data.concat(data.gzm);
    plot_data_m();
  }
  else if ("hr" in data){
    hr_data = hr_data.concat(data.hr);
    plot_data_hr();
  }
  else if ("name" in data) {
    document.getElementById("data").innerHTML = "Username : " + data.name;
  }

}

// Function To Plot Data 1
function plot_data1() {
  var ax_plot = ax1_data.slice(-50);
  var ay_plot = ay1_data.slice(-50);
  var az_plot = az1_data.slice(-50);
  var gx_plot = gx1_data.slice(-50);
  var gy_plot = gy1_data.slice(-50);
  var gz_plot = gz1_data.slice(-50);
  ax = document.getElementById("ax");
  Plotly.newPlot("ax1", [{y: ax_plot, mode:"lines", name:"ax", marker:{color:"red"}}], {title:"Accel X1", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("ay1", [{y: ay_plot, mode:"lines", name:"ay", marker:{color:"blue"}}], {title:"Accel Y1", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("az1", [{y: az_plot, mode:"lines", name:"ay", marker:{color:"green"}}], {title:"Accel Z1", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("gx1", [{y: gx_plot, mode:"lines", name:"gx", marker:{color:"red"}}], {title:"Gyro X1", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("gy1", [{y: gy_plot, mode:"lines", name:"gy", marker:{color:"blue"}}], {title:"Gyro Y1", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("gz1", [{y: gz_plot, mode:"lines", name:"gy", marker:{color:"green"}}], {title:"Gyro Z1", xaxis:xlabel, yaxis:ylabel});
}

// Function To Plot Data 2
function plot_data2() {
  var ax_plot = ax2_data.slice(-50);
  var ay_plot = ay2_data.slice(-50);
  var az_plot = az2_data.slice(-50);
  var gx_plot = gx2_data.slice(-50);
  var gy_plot = gy2_data.slice(-50);
  var gz_plot = gz2_data.slice(-50);
  ax = document.getElementById("ax");
  Plotly.newPlot("ax2", [{y: ax_plot, mode:"lines", name:"ax", marker:{color:"red"}}], {title:"Accel X2", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("ay2", [{y: ay_plot, mode:"lines", name:"ay", marker:{color:"blue"}}], {title:"Accel Y2", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("az2", [{y: az_plot, mode:"lines", name:"ay", marker:{color:"green"}}], {title:"Accel Z2", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("gx2", [{y: gx_plot, mode:"lines", name:"gx", marker:{color:"red"}}], {title:"Gyro X2", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("gy2", [{y: gy_plot, mode:"lines", name:"gy", marker:{color:"blue"}}], {title:"Gyro Y2", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("gz2", [{y: gz_plot, mode:"lines", name:"gy", marker:{color:"green"}}], {title:"Gyro Z2", xaxis:xlabel, yaxis:ylabel});
}

// Function To Plot Data M5
function plot_data_m() {
  var ax_plot = axm_data.slice(-50);
  var ay_plot = aym_data.slice(-50);
  var az_plot = azm_data.slice(-50);
  var gx_plot = gxm_data.slice(-50);
  var gy_plot = gym_data.slice(-50);
  var gz_plot = gzm_data.slice(-50);
  ax = document.getElementById("ax");
  Plotly.newPlot("axm", [{y: ax_plot, mode:"lines", name:"ax", marker:{color:"red"}}], {title:"Accel X", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("aym", [{y: ay_plot, mode:"lines", name:"ay", marker:{color:"blue"}}], {title:"Accel Y", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("azm", [{y: az_plot, mode:"lines", name:"ay", marker:{color:"green"}}], {title:"Accel Z", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("gxm", [{y: gx_plot, mode:"lines", name:"gx", marker:{color:"red"}}], {title:"Gyro X", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("gym", [{y: gy_plot, mode:"lines", name:"gy", marker:{color:"blue"}}], {title:"Gyro Y", xaxis:xlabel, yaxis:ylabel});
  Plotly.newPlot("gzm", [{y: gz_plot, mode:"lines", name:"gy", marker:{color:"green"}}], {title:"Gyro Z", xaxis:xlabel, yaxis:ylabel});
}

// Function To Plot HR Data
function plot_data_hr() {
  Plotly.newPlot("hr", [{y: hr_data, mode:"lines", name:"Hr", marker:{color:"chartreuse"}}], {title:"Heart Rate", xaxis:xlabel, yaxis:ylabel});
}
