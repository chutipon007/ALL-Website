document.getElementById("modeSelect").addEventListener("change", modeChange);
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
let running = false;
let dist1_data = [];
let dist2_data = [];
let distm_data = [];
let dist1 = 0;
let dist2 = 0;
let distm = 0;
let color1 = "green";
let color2 = "green";
let colorm = "green"
let currentMode = "Analog";
let currentHR = 0;

// Start MQTT Connection
const clientId = "clientId-" + Math.random().toString(16);   // Like clientId-1
const client = new Paho.MQTT.Client("broker.emqx.io", Number(8084), "/mqtt", clientId);

// Set MQTT Callback Function
client.onMessageArrived = onMessageArrived;
client.onConnectionLost = onConnectionLost;

// Function to Start MQTT Connection
function conn(){
  running = true;
  if (!client.isConnected()){
    client.connect({
      useSSL: true,
      onSuccess: onConnect,
      onFailure: onFailure,
    });
  }
  console.log("Start");
}

// Function to Stop MQTT Connection
function disconn(){
  running = false;
  console.log("Stop");
}

// Function to Reset Array Data
function reset(){
  ax1_data.length = 0;
  ay1_data.length = 0;
  az1_data.length = 0;
  gx1_data.length = 0;
  gy1_data.length = 0;
  gz1_data.length = 0;
  ax2_data.length = 0;
  ay2_data.length = 0;
  az2_data.length = 0;
  gx2_data.length = 0;
  gy2_data.length = 0;
  gz2_data.length = 0;
  axm_data.length = 0;
  aym_data.length = 0;
  azm_data.length = 0;
  gxm_data.length = 0;
  gym_data.length = 0;
  gzm_data.length = 0;
  hr_data.length = 0;
  console.log("Reset");
}
  
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
    console.log("Attempting to reconnect...");
    setTimeout(() => {
      client.connect({
        useSSL: true,
        onSuccess: onConnect,
        onFailure: onFailure
      });
    }, 100);  // Attempt to reconnect after 5 seconds
  }
}

// MQTT Message Arrive Function
function onMessageArrived(message) {
  // console.log("onMessageArrived:"+message.payloadString);
  if (running){
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
        dist1 = cumsum(data.gz1, dist1_data, dist1);

        if (currentMode == "Analog"){
          plot_data1();
          plot_dist1();
        }
        else if (currentMode == "Digital"){
          if (Math.abs(data.gz1[data.gz1.length - 1]) > 450){
            color1 = "red";
          }
          else if (Math.abs(data.gz1[data.gz1.length - 1]) > 400){
            color1 = "orange";
          }
          else if (Math.abs(data.gz1[data.gz1.length - 1]) > 350){
            color1 = "yellow";
          }
          else{
            color1 = "green";
          }
          plot_digital_data_1();
        }
      }
      else if ("ax2" in data){
        ax2_data = ax2_data.concat(data.ax2);
        ay2_data = ay2_data.concat(data.ay2);
        az2_data = az2_data.concat(data.az2);
        gx2_data = gx2_data.concat(data.gx2);
        gy2_data = gy2_data.concat(data.gy2);
        gz2_data = gz2_data.concat(data.gz2);
        dist2 = cumsum(data.gz2, dist2_data, dist2);
        
        if (currentMode == "Analog"){
          plot_data2();
          plot_dist2();
        }
        else if (currentMode == "Digital"){
          if (Math.abs(data.gz2[data.gz2.length - 1]) > 450){
            color2 = "red";
          }
          else if (Math.abs(data.gz2[data.gz2.length - 1]) > 400){
            color2 = "orange";
          }
          else if (Math.abs(data.gz2[data.gz2.length - 1]) > 350){
            color2 = "yellow";
          }
          else{
            color2 = "green";
          }
          plot_digital_data_2();
        }
      }
      else if ("axm" in data){
        axm_data = axm_data.concat(data.axm);
        aym_data = aym_data.concat(data.aym);
        azm_data = azm_data.concat(data.azm);
        gxm_data = gxm_data.concat(data.gxm);
        gym_data = gym_data.concat(data.gym);
        gzm_data = gzm_data.concat(data.gzm);
        if (currentMode == "Analog"){
          plot_data_arm();
        }
        else if (currentMode == "Digital"){
          if (Math.abs(data.gzm[data.gzm.length - 1]) > 450){
            colorm = "red";
          }
          else if (Math.abs(data.gzm[data.gzm.length - 1]) > 400){
            colorm = "orange";
          }
          else if (Math.abs(data.gzm[data.gzm.length - 1]) > 350){
            colorm = "yellow";
          }
          else{
            colorm = "green";
          }
          plot_digital_data_arm();
        }
      }
      else if ("hr" in data){
        hr_data = hr_data.concat(data.hr);
        if (currentMode == "Analog"){
          plot_data_hr();
        }
        else if (currentMode == "Digital"){
          plot_digital_hr();
        }
        currentHR = hr_data[hr_data.length - 1];
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

// Function To Plot Arm Data
function plot_data_arm() {
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
  if (data.length > 0){
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
  else{
    return data;
  }
}

// Function to Check if Wheelchair is falling
function falling_check() {
  let led_label = document.getElementById("led_label");
  let led_color = document.getElementById("led_span");
  if (az1_data.length > 1 || az2_data.length > 1){
    let last_idx = az1_data[az1_data.length - 1];
    let last_id2 = az2_data[az2_data.length - 1];
    if ((last_idx < -0.7 || last_idx > 0.7) || (last_id2 < -0.7 || last_id2 > 0.7)){
      led_color.style.color = "red";
      led_label.innerHTML = "Falling Status : Falling";
    }
    else {
      led_color.style.color = "green";
      led_label.innerHTML = "Falling Status : Not Falling";
    }
  }
}

// Function to plot dist 1
function plot_dist1(){
  var _dist = {y:dist1_data, type: 'lines', name:"Distance 1", showlegend:false, marker:{color:"red"}};
  
  Plotly.newPlot("dist1",[_dist], {title:"Right Wheel Distance", 
    xaxis:{
      title: "Distance",
      range: [0, 50],
      autorange: true
    }, yaxis:{
      title: "Distance (m)",
      range: [-1.5, 1.5],
      autorange: true
    }, grid: {rows: 1, columns: 1, pattern: 'independent'}});
}

// Function to plot dist 2
function plot_dist2(){
  var _dist = {y:dist2_data, type: 'lines', name:"Distance 2", showlegend:false, marker:{color:"red"}};
  
  Plotly.newPlot("dist2",[_dist], {title:"Left Wheel Distance", 
    xaxis:{
      title: "Distance",
      range: [0, 50],
      autorange: true
    }, yaxis:{
      title: "Distance (m)",
      range: [-1.5, 1.5],
      autorange: true
    }, grid: {rows: 1, columns: 1, pattern: 'independent'}});
}

// Function to Plot Digital Data 1
function plot_digital_data_1(){
  var data = [
      {
          title: { text: "Right Wheel Speed (deg/s)" },
          type: "indicator",
          value: Math.abs(gz1_data[gz1_data.length-1]),
          delta: { reference: Math.abs(gz1_data[gz1_data.length-2]) },
          gauge: { axis: { range: [null, 500] }, bar: { color: color1 },  steps: [
            { range: [0, 250], color: "cyan" },
            { range: [250, 400], color: "royalblue" }
          ],},
          domain: { row:0, column:0 },
          mode: "gauge+number+delta",
      },
      {
          title: { text: "Right Wheel Distance (m)" },
          type: "indicator",
          value: dist1_data[dist1_data.length-1],
          delta: { reference: dist1_data[dist1_data.length-2] },
          gauge: { axis: { range: [null, 500] } },
          domain: { row:0, column:1 },
          mode: "gauge+number+delta",
      },
    ];    
  var layout = { grid: { rows: 1, columns: 2, pattern: "independent" }, autosize:true};
  Plotly.newPlot('digital1', data, layout);
}

// Function to Plot Digital Data 2
function plot_digital_data_2(){
  var data = [
      {
        title: { text: "Left Wheel Speed (deg/s)" },
        type: "indicator",
        value: Math.abs(gz2_data[gz2_data.length-1]),
        delta: { reference: Math.abs(gz2_data[gz2_data.length-2]) },
        gauge: { axis: { range: [null, 500] }, bar: { color: color2 }, steps: [
          { range: [0, 250], color: "cyan" },
          { range: [250, 400], color: "royalblue" }
        ], },
        domain: { row:0, column:0 },
        mode: "gauge+number+delta",
    },
    {
        title: { text: "Left Wheel Distance (m)" },
        type: "indicator",
        value: dist2_data[dist2_data.length-1],
        delta: { reference: dist2_data[dist2_data.length-2] },
        gauge: { axis: { range: [null, 500] } },
        domain: { row:0, column:1 },
        mode: "gauge+number+delta",
    }
    ];    
  var layout = { grid: { rows: 1, columns: 2, pattern: "independent" }, autosize:true};
  Plotly.newPlot('digital2', data, layout);
}

// Function to Plot Digital Data Arm
function plot_digital_data_arm(){
  var data = [
      {
        title: { text: "Arm Speed (deg/s)" },
        type: "indicator",
        value: Math.abs(gzm_data[gzm_data.length-1]),
        delta: { reference: Math.abs(gzm_data[gzm_data.length-2]) },
        gauge: { axis: { range: [null, 500] }, bar: { color: colorm }, steps: [
          { range: [0, 250], color: "cyan" },
          { range: [250, 400], color: "royalblue" }
        ], },
        domain: { row:0, column:0 },
        mode: "gauge+number+delta",
    },
    {
        title: { text: "Arm Distance (m)" },
        type: "indicator",
        value: distm_data[distm_data.length-1],
        delta: { reference: distm_data[distm_data.length-2] },
        gauge: { axis: { range: [null, 500] } },
        domain: { row:0, column:1 },
        mode: "gauge+number+delta",
    }
    ];    
  var layout = { grid: { rows: 1, columns: 2, pattern: "independent" }, autosize:true};
  Plotly.newPlot('digitalArm', data, layout);
}

// Function to Plot Digital Heart Rate
function plot_digital_hr(){
  var data = [
    {
      type: "indicator",
      mode: "number+delta",
      value: hr_data[hr_data.length - 1],
      delta: { reference: currentHR, valueformat: ".0f" },
      domain: { y: [0, 1], x: [0.25, 0.75] },
      title: { text: "Heart Rate" }
    },
    {
      y: hr_data,
      line: {
        color: 'chartreuse'                 // Color for the line
      }
    }
  ];
  
  var layout = { height: 450, xaxis: { range: [0, 62], autorange: true } ,yaxis: { title: "Heart Rate (bpm)" } , autosize: true };
  Plotly.newPlot('digitalHr', data, layout);  
}

// Cumulative Sum
function cumsum(arr, dist_data, dist_num){
  // Using map to perform transformations
  arr.map((e)=>{
      e = Math.abs(e) * 0.3 / 10 * Math.PI / 180;
      if (e > 0.05){
        dist_num = dist_num + e;
      }
      dist_data.push(dist_num);
  });
  return dist_num;
}

// Function to Choose Current Mode
function modeChange(event){
  const selectMode = event.target.value;
  currentMode = selectMode;
  const analog = document.getElementById("AnalogTab");
  const digital = document.getElementById("DigitalTab");
  if (currentMode == "Analog"){
    analog.style.display = "block";
    digital.style.display = "none";
  }
  else if (currentMode == "Digital"){
    analog.style.display = "none";
    digital.style.display = "block";
  }
  console.log("Mode", selectMode);
}

// Call Initial Functions
plot_data1();
plot_data2();
plot_data_arm();
plot_data_hr();
conn();

