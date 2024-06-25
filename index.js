// Start MQTT Connection
const clientId = "clientId-" + Math.random().toString(16);   // Like clientId-1
const client = new Paho.MQTT.Client("broker.emqx.io", Number(8084), "/mqtt", clientId);

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
  try {
    var data = JSON.parse(message.payloadString);
    // Process the payload
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
    falling_check();
  }catch (e) {
    console.error('Failed to parse JSON:', e);
    console.error('Original message payload:', message.payloadString);
  }
}

// Function To Plot Data 1
function plot_data1() {
  var ax_plot = movingAverage(ax1_data.slice(-50), 5);
  var ay_plot = movingAverage(ay1_data.slice(-50), 5);
  var az_plot = movingAverage(az1_data.slice(-50), 5);
  var gx_plot = movingAverage(gx1_data.slice(-50), 5);
  var gy_plot = movingAverage(gy1_data.slice(-50), 5);
  var gz_plot = movingAverage(gz1_data.slice(-50), 5);

  var ax_ = {y:ax_plot, type: 'lines', name:"Accel X1", showlegend:false, marker:{color:"red"}};
  var ay_ = {y:ay_plot, type: 'lines', name:"Accel Y1", showlegend:false, xaxis: 'x2', yaxis: 'y2', marker:{color:"green"}};
  var az_ = {y:az_plot, type: 'lines', name:"Accel Z1", showlegend:false, xaxis: 'x3', yaxis: 'y3', marker:{color:"blue"}};
  var gx_ = {y:gx_plot, type: 'lines', name:"Gyro X1", showlegend:false, marker:{color:"red"}};
  var gy_ = {y:gy_plot, type: 'lines', name:"Gyro Y1", showlegend:false, xaxis: 'x2', yaxis: 'y2', marker:{color:"green"}};
  var gz_ = {y:gz_plot, type: 'lines', name:"Gyro Z1", showlegend:false, xaxis: 'x3', yaxis: 'y3', marker:{color:"blue"}};
  
  Plotly.newPlot("ax1", [ax_, ay_, az_], {title:"Right Wheel Acceleration", 
    xaxis:{
      title: "Accel X1",
      range: [0, 50],
      autorange: false
    }, xaxis2:{
      title: "Accel Y1",
      range: [0, 50],
      autorange: false
    }, xaxis3:{
      title: "Accel Z1",
      range: [0, 50],
      autorange: false
    }, yaxis:{
      title: "Gravity (g)",
      range: [-1.5, 1.5],
      autorange: false
    }, yaxis2:{
      range: [-1.5, 1.5],
      autorange: false
    }, yaxis3:{
      range: [-1.5, 1.5],
      autorange: false
    }, grid: {rows: 1, columns: 3, pattern: 'independent'}});

  Plotly.newPlot("gx1", [gx_, gy_, gz_], {title:"Right Wheel Gyroscope", 
    xaxis:{
      title: "Gyro X1",
      range: [0, 50],
      autorange: false
    }, xaxis2:{
      title: "Gyro Y1",
      range: [0, 50],
      autorange: false
    }, xaxis3:{
      title: "Gyro Z1",
      range: [0, 50],
      autorange: false
    }, yaxis:{
      title: "Velocity (deg/s)",
      range: [-250, 250],
      autorange: false
    }, yaxis2:{
      range: [-250, 250],
      autorange: false
    }, yaxis3:{
      range: [-250, 250],
      autorange: false
    }, grid: {rows: 1, columns: 3, pattern: 'independent'}});
}

// Function To Plot Data 2
function plot_data2() {
  var ax_plot = movingAverage(ax2_data.slice(-50), 5);
  var ay_plot = movingAverage(ay2_data.slice(-50), 5);
  var az_plot = movingAverage(az2_data.slice(-50), 5);
  var gx_plot = movingAverage(gx2_data.slice(-50), 5);
  var gy_plot = movingAverage(gy2_data.slice(-50), 5);
  var gz_plot = movingAverage(gz2_data.slice(-50), 5);

  var ax_ = {y:ax_plot, type: 'lines', name:"Accel X2", showlegend:false, marker:{color:"red"}};
  var ay_ = {y:ay_plot, type: 'lines', name:"Accel Y2", showlegend:false, xaxis: 'x2', yaxis: 'y2', marker:{color:"green"}};
  var az_ = {y:az_plot, type: 'lines', name:"Accel Z2", showlegend:false, xaxis: 'x3', yaxis: 'y3', marker:{color:"blue"}};
  var gx_ = {y:gx_plot, type: 'lines', name:"Gyro X2", showlegend:false, marker:{color:"red"}};
  var gy_ = {y:gy_plot, type: 'lines', name:"Gyro Y2", showlegend:false, xaxis: 'x2', yaxis: 'y2', marker:{color:"green"}};
  var gz_ = {y:gz_plot, type: 'lines', name:"Gyro Z2", showlegend:false, xaxis: 'x3', yaxis: 'y3', marker:{color:"blue"}};

  Plotly.newPlot("ax2", [ax_, ay_, az_], {title:"Left Wheel Acceleration", 
    xaxis:{
      title: "Accel X2",
      range: [0, 50],
      autorange: false
    }, xaxis2:{
      title: "Accel Y2",
      range: [0, 50],
      autorange: false
    }, xaxis3:{
      title: "Accel Z2",
      range: [0, 50],
      autorange: false
    }, yaxis:{
      title: "Gravity (g)",
      range: [-1.5, 1.5],
      autorange: false
    }, yaxis2:{
      range: [-1.5, 1.5],
      autorange: false
    }, yaxis3:{
      range: [-1.5, 1.5],
      autorange: false
    }, grid: {rows: 1, columns: 3, pattern: 'independent'}});

  Plotly.newPlot("gx2", [gx_, gy_, gz_], {title:"Left Wheel Gyroscope", 
    xaxis:{
      title: "Gyro X2",
      range: [0, 50],
      autorange: false
    }, xaxis2:{
      title: "Gyro Y2",
      range: [0, 50],
      autorange: false
    }, xaxis3:{
      title: "Gyro Z2",
      range: [0, 50],
      autorange: false
    }, yaxis:{
      title: "Velocity (deg/s)",
      range: [-250, 250],
      autorange: false
    }, yaxis2:{
      range: [-250, 250],
      autorange: false
    }, yaxis3:{
      range: [-250, 250],
      autorange: false
    }, grid: {rows: 1, columns: 3, pattern: 'independent'}});
}

// Function To Plot Data M5
function plot_data_m() {
  var ax_plot = movingAverage(axm_data.slice(-50), 5);
  var ay_plot = movingAverage(aym_data.slice(-50), 5);
  var az_plot = movingAverage(azm_data.slice(-50), 5);
  var gx_plot = movingAverage(gxm_data.slice(-50), 5);
  var gy_plot = movingAverage(gym_data.slice(-50), 5);
  var gz_plot = movingAverage(gzm_data.slice(-50), 5);

  var ax_ = {y:ax_plot, type: 'lines', name:"Accel X2", showlegend:false, marker:{color:"red"}};
  var ay_ = {y:ay_plot, type: 'lines', name:"Accel Y2", showlegend:false, xaxis: 'x2', yaxis: 'y2', marker:{color:"green"}};
  var az_ = {y:az_plot, type: 'lines', name:"Accel Z2", showlegend:false, xaxis: 'x3', yaxis: 'y3', marker:{color:"blue"}};
  var gx_ = {y:gx_plot, type: 'lines', name:"Gyro X2", showlegend:false, marker:{color:"red"}};
  var gy_ = {y:gy_plot, type: 'lines', name:"Gyro Y2", showlegend:false, xaxis: 'x2', yaxis: 'y2', marker:{color:"green"}};
  var gz_ = {y:gz_plot, type: 'lines', name:"Gyro Z2", showlegend:false, xaxis: 'x3', yaxis: 'y3', marker:{color:"blue"}};

  Plotly.newPlot("axm", [ax_, ay_, az_], {title:"Arm Acceleration", 
    xaxis:{
      title: "Accel X",
      range: [0, 50],
      autorange: false
    }, xaxis2:{
      title: "Accel Y",
      range: [0, 50],
      autorange: false
    }, xaxis3:{
      title: "Accel Z",
      range: [0, 50],
      autorange: false
    }, yaxis:{
      title: "Gravity (g)",
      range: [-1.5, 1.5],
      autorange: false
    }, yaxis2:{
      range: [-1.5, 1.5],
      autorange: false
    }, yaxis3:{
      range: [-1.5, 1.5],
      autorange: false
    }, grid: {rows: 1, columns: 3, pattern: 'independent'}});

  Plotly.newPlot("gxm", [gx_, gy_, gz_], {title:"Arm Gyroscope", 
    xaxis:{
      title: "Gyro X",
      range: [0, 50],
      autorange: false
    }, xaxis2:{
      title: "Gyro Y",
      range: [0, 50],
      autorange: false
    }, xaxis3:{
      title: "Gyro Z",
      range: [0, 50],
      autorange: false
    }, yaxis:{
      title: "Velocity (deg/s)",
      range: [-250, 250],
      autorange: false
    }, yaxis2:{
      range: [-250, 250],
      autorange: false
    }, yaxis3:{
      range: [-250, 250],
      autorange: false
    }, grid: {rows: 1, columns: 3, pattern: 'independent'}});
}

// Function To Plot HR Data
function plot_data_hr() {
  Plotly.newPlot("hr", [{y: hr_data, mode:"lines", name:"Hr", marker:{color:"chartreuse"}}], {title:"Heart Rate", 
    xaxis:{
      title: "Data",
      range: [0, 30],
      autorange: true
    }, yaxis:{
      title: "Heart Rate (bpm)",
      range: [0, 30],
      autorange: true
    }});
}

// Function To Calculate Moving Average
function movingAverage(data, windowSize) {
  if (windowSize <= 0) {
      throw new Error("Window size must be greater than 0");
  }
  if (data.length < windowSize) {
      throw new Error("Data length must be greater than or equal to the window size");
  }

  let movingAverages = [];

  for (let i = 0; i <= data.length - windowSize; i++) {
      let window = data.slice(i, i + windowSize);
      let sum = window.reduce((acc, num) => acc + num, 0);
      movingAverages.push(sum / windowSize);
  }

  return movingAverages;
}

// Function to Check if Wheelchair is falling
function falling_check() {
  if (az1_data.length > 1 && az2_data.length > 1){
    let last_idx = az1_data.pop();
    let last_id2 = az2_data.pop();
    let led_label = document.getElementById("led_label");
    let led_color = document.getElementById("led_span");
    if ((last_idx > -0.7 && last_idx < 0.7) && (last_id2 > -0.7 && last_id2 < 0.7)){
      led_color.style.color = "green";
      led_label.innerHTML = "Falling Status : Not Falling";
    }
    else {
      led_color.style.color = "red";
      led_label.innerHTML = "Falling Status : Falling";
    }
  }
}
