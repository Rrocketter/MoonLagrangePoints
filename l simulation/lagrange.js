

"use strict";

var worldRotation = 0.0;
var worldRotationSpeed = 0.0;
var earth, moon, jupiter, charon, pluto, sun, bluePlanet, redMoon
var targetShipTexture, shipTexture, thrustTexture, explosionTexture
var body1, body2
var textureProgramInfo;
var textureNoLightingProgramInfo;
var starProgramInfo;
var pointProgramInfo;
var colorProgramInfo;
var equipProgramInfo;
var colorPlainProgramInfo;
var angleRes = 64; // was 16
var stoppedCheck;
var animating = false;
var zoom3d = .56
var maxZoom3d;
var sqrt12 = Math.sqrt(.5)
var forwardThrust = 0
var outwardThrust = 0
var shipLength;
var meshes
var gl
var timeMult
var shipAngle
var autopilotState = 0
var autopilotGoal = 0
var autopilotGoalStart = 0
var autopilotDeltaTime
var autopilotUsed = false
var deltaV = 0
var autopilotText
var success = false
var explosion
var distScalar
var deltaTimeWithoutSpeed
var viewAnimationTimer
var zoomRate = 0
var yearLength = 0
var distKm = 0
var alerted = false
var debugA = false
var lagrangePoints = [];
var potentialScale;

var lengthUnit

// standard gravitational parameter
var mu1 // in lengthUnits^3/hours^2
var mu2
const thrustMult = 10
const minThrustDelta = .00015
var body1Offset, bodyDistance

var shipOrbit
var body1Orbit
var body2Orbit

var rotating
var lastViewFrame = ""
var vertexCountWF
var explosion

var rotationMatrix = mat4.create()
var inverseRotationMatrix = mat4.create()

var refresh;
var time = 0

var mouseDown = 0, mouseX, mouseY;
var lastOrbitAngle = 50;
var stars = []
const siderealDay = 23.9344696

function vecLength(x) {
  return Math.hypot(x[0], x[1], x[2])
}

function round(x) {
  return Math.round(x*100)/100;
}

function timeString(t) {
  var str = ""
  var y = 24*365;
  if (t > y) {
    str = Math.floor(t/y) + "y ";
    t %= y;
  }
  if (t > 24) {
    str += Math.floor(t/24) + "d "
    t %= 24
  }
  str += Math.floor(t) + "h " + Math.floor((t*60) % 60) + "m " +
         Math.floor((t*3600) % 60) + "s"
  return str
}

const kmsAdjust = lengthUnit/3600

// calculate radius of apoapsis for an orbit
function calcApoapsis(orb) {
  // avoid exception
  if (orb == null)
    return 5
  return orb.semiAxis * (1+orb.eccentricity)
}

function orbitData(info, orb) {
    info.innerHTML += "<br>period = " + round(orb.period) + " hr, "
    var vel = vecLength(orb.velocity)
    info.innerHTML += "v = " + round(vel * kmsAdjust) + " km/s"
    info.innerHTML += "<br>e = " + round(orb.eccentricity)
    info.innerHTML += ", semimajor axis = " + 
        Math.round(orb.semiAxis * lengthUnit) + " km"
    var pos = orb.position
    info.innerHTML += "<br>altitude = " + 
        Math.round((vecLength(pos)-1)*lengthUnit) + " km"
}

function distanceText(dist) {
  dist *= lengthUnit;
  var au = 149.6e6;
  if (dist > .5*au)
    return round(dist / au) + " AU";
  return round(dist) + " km";
}

// update info text
function updateValues() {
    var info = document.getElementById("values");

    if (!shipOrbit)
      return;

    var dist = vec3.create()
    vec3.subtract(dist, shipOrbit.position, body2Orbit.position)
    info.innerHTML = "distance to " + body2.name + " = " + distanceText(vecLength(dist));
    vec3.subtract(dist, shipOrbit.position, body1Orbit.position)
    info.innerHTML += "<br>distance to " + body1.name + " = " + distanceText(vecLength(dist));
    info.innerHTML += "<br>mass ratio = " + round(mu1/mu2);
    var velDiff = vec3.create()
    vec3.subtract(velDiff, shipOrbit.velocity, body2Orbit.velocity)
    //info.innerHTML += "<br>rel vel = " + round(kmsAdjust * vecLength(velDiff)) + " km/s"
    info.innerHTML += "<br>t = " + timeString(time)

    var status = document.getElementById("status");
    distKm = lengthUnit*vecLength(dist)
    if (distKm < 50)
      success = true
}

function addMouseEvents(canvas) {
  canvas.onmousedown = function (event) {
    mouseDown = 1;
    mouseX = event.clientX
    mouseY = event.clientY
  }

  canvas.onmouseup = function (event) {
    mouseDown = 0;
  }

  canvas.onmousemove = function (event) {
    if (mouseDown) {
      var dx = event.clientX - mouseX
      var dy = event.clientY - mouseY
      mouseX = event.clientX
      mouseY = event.clientY

      // rotate view matrix
      var mtemp = mat4.create()
      mat4.rotate(mtemp, mtemp, dx*.01, [0, 1, 0]);
      mat4.rotate(mtemp, mtemp, dy*.01, [1, 0, 0]);
      mat4.multiply(rotationMatrix, mtemp, rotationMatrix);
    }
    refresh();
  }

  canvas.addEventListener("wheel", function (event) {
      zoom3d *= Math.exp(-event.deltaY * .001)
      //zoom3d = Math.min(Math.max(zoom3d, .005), 500)
      refresh()
  })

	var lastTap;
  var sim = this;
  
  // convert touch events to mouse events
	canvas.addEventListener("touchstart", function (e) {
  		var touch = e.touches[0];
  		var etype = "mousedown";
  		lastTap = e.timeStamp;
  		
  		var mouseEvent = new MouseEvent(etype, {
    			clientX: touch.clientX,
    			clientY: touch.clientY
  		});
  		e.preventDefault();
  		canvas.dispatchEvent(mouseEvent);
  }, false);
  
	canvas.addEventListener("touchend", function (e) {
  		var mouseEvent = new MouseEvent("mouseup", {});
  		e.preventDefault();
  		canvas.dispatchEvent(mouseEvent);
  }, false);
  
	canvas.addEventListener("touchmove", function (e) {
  		var touch = e.touches[0];
  		var mouseEvent = new MouseEvent("mousemove", {
    			clientX: touch.clientX,
    			clientY: touch.clientY
  		});
  		e.preventDefault();
  		canvas.dispatchEvent(mouseEvent);
	}, false);

	// Get the position of a touch relative to the canvas
	function getTouchPos(canvasDom, touchEvent) {
  		var rect = canvasDom.getBoundingClientRect();
  		return {
    			x: touchEvent.touches[0].clientX - rect.left,
    			y: touchEvent.touches[0].clientY - rect.top
  		};
	}


}

function enableThrustButtons() {
    forward.disabled = backward.disabled = inward.disabled = outward.disabled =
       stoppedCheck.checked
}

function resizeCanvas(cv) {
    var width = cv.clientWidth;
    var height = cv.clientHeight;
    if (cv.width != width ||
        cv.height != height) {
       cv.width = width;
       cv.height = height;
    }
}

// called when models are loaded
function gotModels(m) {
  meshes = m
  OBJ.initMeshBuffers(gl, meshes.csm)
}

// add handlers for buttons so they work on both desktop and mobile
function handleButtonEvents(id, func, func0) {
  var button = document.getElementById(id)
  button.addEventListener("mousedown", func, false)
  button.addEventListener("touchstart", func, false)

  button.addEventListener("mouseup", func0, false)
  button.addEventListener("mouseleave", func0, false)
  button.addEventListener("touchend", func0, false)
}

// parse stars.txt data file
function parseStars(text) {
  var lines = text.split("\n")
  var i
  for (i = 0; i != lines.length; i++) {
    var line = lines[i]
    var rah = line.substring(0, 2)
    var ram = line.substring(2, 4)
    var ras = line.substring(4, 8)
    var dech = line.substring(8, 11)
    var decm = line.substring(11, 13)
    var decs = line.substring(13, 15)
    var raval = Number(rah)+ram/60+ras/3600
    var sgn = (dech > 0) ? 1 : -1
    var decval = Number(dech)+sgn*(decm/60+decs/3600);
    var mag = Number(line.substring(15, 20))
    stars.push(raval, decval, mag)
  }
}

function loadStars() {
  var client = new XMLHttpRequest();
  client.open('GET', 'stars.txt');
  client.onload = function() {
    parseStars(client.responseText)
  }
  client.send();
}

function main() {
  const canvas = document.querySelector('#glcanvas');
  gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  OBJ.downloadMeshes({ 'csm': 'csm.obj', }, gotModels);

  stoppedCheck = document.getElementById("stoppedCheck");
  addMouseEvents(canvas)

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform vec3 uLightPosition;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.5, 0.5, 0.5);
      highp vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
      //highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      highp vec3 directionalVector = 3. * normalize(uLightPosition - (uNormalMatrix * aVertexPosition).xyz);

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexNormal, aTextureCoord,
  // and look up uniform locations.
  textureProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  const vsNoLightingSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
      vLighting = vec3(1.0, 1.0, 1.0);
    }
  `;

  const shaderNoLightingProgram = initShaderProgram(gl, vsNoLightingSource, fsSource);

  textureNoLightingProgramInfo = {
    program: shaderNoLightingProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderNoLightingProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderNoLightingProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderNoLightingProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderNoLightingProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderNoLightingProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderNoLightingProgram, 'uNormalMatrix'),
      lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
      uSampler: gl.getUniformLocation(shaderNoLightingProgram, 'uSampler'),
    },
  };

  // Fragment shader program

  const fsColorSource = `
    varying highp vec3 vLighting;
    uniform highp vec4 uColor;

    void main(void) {
      gl_FragColor = vec4(uColor.rgb * vLighting, uColor.a);
    }
  `;

  const colorShaderProgram = initShaderProgram(gl, vsSource, fsColorSource);

  colorProgramInfo = {
    program: colorShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(colorShaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(colorShaderProgram, 'aVertexNormal'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(colorShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(colorShaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(colorShaderProgram, 'uNormalMatrix'),
      lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
      color: gl.getUniformLocation(colorShaderProgram, 'uColor'),
    },
  };

  const fsColorNoLightingSource = `
    uniform highp vec4 uColor;

    void main(void) {
      gl_FragColor = uColor;
    }
  `;

  const colorPlainShaderProgram = initShaderProgram(gl, vsSource, fsColorNoLightingSource);

  colorPlainProgramInfo = {
    program: colorPlainShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(colorPlainShaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(colorPlainShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(colorPlainShaderProgram, 'uModelViewMatrix'),
      color: gl.getUniformLocation(colorPlainShaderProgram, 'uColor'),
    },
  };

  const starVsSource = `
    attribute vec3 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    void main()
    {
        vec3 pos2 = vec3(aVertexPosition.x * 15. * 3.14159265 / 180.,
                        aVertexPosition.y * 3.14159265 / 180.,
                         100000.);
        vec4 realPos = vec4(pos2.z * cos(pos2.y) * cos(pos2.x),
                        pos2.z * cos(pos2.y) * sin(pos2.x),
                        pos2.z * sin(pos2.y),
                        1.);
        gl_Position = uProjectionMatrix * uModelViewMatrix * realPos;
        gl_PointSize = 5.-.8*aVertexPosition.z;
    }
  `;

  const starFsSource = `
     uniform highp vec4 uColor;
     void main()
     {
         if (distance(gl_PointCoord, vec2(.5, .5)) > .5)
             discard;
         gl_FragColor = uColor;
     }
  `;

  const starShaderProgram = initShaderProgram(gl, starVsSource, starFsSource);

  starProgramInfo = {
    program: starShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(starShaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(starShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(starShaderProgram, 'uModelViewMatrix'),
      color: gl.getUniformLocation(starShaderProgram, 'uColor'),
    },
  };

  const pointVsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    void main()
    {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        gl_PointSize = 10.;
    }
  `;

  const pointShaderProgram = initShaderProgram(gl, pointVsSource, starFsSource);

  pointProgramInfo = {
    program: pointShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(pointShaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(pointShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(pointShaderProgram, 'uModelViewMatrix'),
      color: gl.getUniformLocation(pointShaderProgram, 'uColor'),
    },
  };

  const vsEquipSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying highp vec3 vPosition;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vPosition = aVertexPosition.xyz;
    }
  `;

  const fsEquipSource = `
    varying highp vec3 vPosition;
    uniform highp vec4 uBody1Position; // w = mu1
    uniform highp vec4 uBody2Position; // w = mu2
    uniform highp vec4 uRotationVector; // w = scale

    highp float potential(highp vec3 pos) {
      highp vec3 vr = cross(uRotationVector.xyz, pos);
      return (-uBody1Position.w/length(pos-uBody1Position.xyz)
              -uBody2Position.w/length(pos-uBody2Position.xyz)
              -0.5*dot(vr, vr)) * uRotationVector.w;
    }

    void main(void) {
      highp float r1 = potential(vPosition);
      if (r1 < -100.) discard;
      //highp float r2 = potential(vPosition + vec3(.05, 0., 0.));
      //highp float r3 = potential(vPosition + vec3(0., .05, 0.));
      gl_FragColor = (fract(r1) < .5) ?  vec4(.5, .5, .5, 1.) : vec4(.25, .25, .25, 1.);
      //highp float q = fract(r*100.);
      //gl_FragColor = vec4(q, q, q, 1.);
    }
  `;

  const equipShaderProgram = initShaderProgram(gl, vsEquipSource, fsEquipSource);

  equipProgramInfo = {
    program: equipShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(equipShaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(equipShaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(equipShaderProgram, 'uModelViewMatrix'),
      body1Position: gl.getUniformLocation(equipShaderProgram, 'uBody1Position'),
      body2Position: gl.getUniformLocation(equipShaderProgram, 'uBody2Position'),
      rotationVector: gl.getUniformLocation(equipShaderProgram, 'uRotationVector'),
    },
  };

  const buffers = initBuffers(gl);

  earth = {
    name: "Earth",
    texture: loadTexture(gl, 'earthmap512.jpg'),
    rotationSpeed: Math.PI*2/siderealDay,
    axialTilt: Math.PI*(23.5)/180
  };

  moon = {
    name: "Moon",
    texture: loadTexture(gl, 'moonmap512.jpg'),
    // rotationSpeed is filled in elsewhere
    axialTilt: Math.PI*(1.5)/180
  };

  jupiter = {
    name: "Jupiter",
    texture: loadTexture(gl, 'jupitermap.jpg'),
    rotationSpeed: Math.PI*2/9.925,
    axialTilt: Math.PI*3/180
  };

  pluto = {
    name: "Pluto",
    texture: loadTexture(gl, 'plutomap512.jpg'),
    rotationSpeed: Math.PI*2/(24*6.387),
    axialTilt: Math.PI*120/180
  };

  charon = {
    name: "Charon",
    texture: loadTexture(gl, 'charon.jpg'),
    // rotationSpeed is filled in elsewhere
    axialTilt: 0   // w.r.t. Pluto's orbital plane (tidally locked w/ Pluto)
  };

  bluePlanet = {
    name: "Blue Planet",
    texture: loadTexture(gl, 'blue.png'),
    rotationSpeed: 0,
    axialTilt: 0
  };

  redMoon = {
    name: "Red Moon",
    texture: loadTexture(gl, 'red.png'),
    rotationSpeed: 0,
    axialTilt: 0
  };

  sun = { name: "Sun" }
  
  shipTexture = loadTexture(gl, 'ship-texture.png')
  thrustTexture = loadTexture(gl, 'thrust.png')
  explosionTexture = loadTexture(gl, 'explosion.png')

  var then = 0;

  // Draw the scene
  function render(now) {
    now *= 0.001;  // convert to seconds
    var deltaTime = (then) ? now - then : 0;
    then = now;

    // avoid large jumps when switching tabs
    deltaTime = Math.min(deltaTime, .03)

    deltaTimeWithoutSpeed = deltaTime
    var speed = document.getElementById("speed").value;
    speed = Math.exp(speed/10-5)
    deltaTime *= speed*timeMult

    resizeCanvas(canvas)
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene(gl, buffers, deltaTime);
    updateValues()

    animating = !stoppedCheck.checked;
    if (!animating)
        then = 0
    else
        requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  animating = true;
  refresh = function () {
      if (!animating)
          requestAnimationFrame(render);
  }

  // refresh when changing something (needed if stopped)
  stoppedCheck.onchange = function () {
    refresh()
    enableThrustButtons()
  }
  document.getElementById("viewFrame").onchange = refresh
/*
  autopilotCheck.onchange = function () {
    autopilotState = 0
    autopilotText = null
    enableThrustButtons()
  }
*/

  reset()

  // add button event handlers
  var func = function(event) { event.preventDefault(); thrust(1, 0); return false; }
  var func0 = function(event) { event.preventDefault(); thrust(0, 0); return false; }
  handleButtonEvents("forward", func, func0)

  func = function(event) { event.preventDefault(); thrust(-1, 0); return false; }
  handleButtonEvents("backward", func, func0)

  func = function(event) { event.preventDefault(); thrust(0, -1); return false; }
  handleButtonEvents("inward", func, func0)

  func = function(event) { event.preventDefault(); thrust(0, 1); return false; }
  handleButtonEvents("outward", func, func0)

  func  = function(event) { event.preventDefault(); zoom(1); return false; }
  func0 = function(event) { event.preventDefault(); zoom(0); return false; }
  handleButtonEvents("zoomin", func, func0)

  func  = function(event) { event.preventDefault(); zoom(-1); return false; }
  handleButtonEvents("zoomout", func, func0)

  loadStars();
}

function initBuffers(gl) {

  // create a buffer for sphere vertices
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [];
  var latcount = angleRes;
  var loncount = angleRes;
  var i, j;
  var r = 1;
  for (j = 0; j <= loncount; j++) 
     for (i = 0; i <= latcount; i++) {
        var th =   Math.PI*j/latcount;
        var ph = 2*Math.PI*i/loncount;
	positions.push(r*Math.sin(th)*Math.cos(ph), r*Math.sin(th)*Math.sin(ph), r*Math.cos(th));
     }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // set up normals
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  var vertexNormals = [];
  for (j = 0; j <= loncount; j++)
     for (i = 0; i <= latcount; i++) {
        var th =   Math.PI*j/latcount;
        var ph = 2*Math.PI*i/loncount;
	      vertexNormals.push(Math.sin(th)*Math.cos(ph), Math.sin(th)*Math.sin(ph), Math.cos(th));
     }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  var textureCoordinates = []
  for (j = 0; j <= loncount; j++)
    for (i = 0; i <= latcount; i++) {
      textureCoordinates.push(i/latcount, j/loncount);
    }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  var indices = [];
  var skip = latcount+1;
  for (j = 0; j != loncount; j++)
      for (i = 0; i != latcount; i++) {
         var i2 = (i+1);
         var j2 = (j+1);
         // create triangles for sphere
         indices.push(i+j*skip, i2+j*skip, i+j2*skip);
         indices.push(i2+j*skip, i+j2*skip, i2+j2*skip);
      }

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const indexWFBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexWFBuffer);

  // add wireframe indices
  var indicesWF = [];
  var skip = latcount+1;
  for (j = 0; j != loncount; j++)
      for (i = 0; i != latcount; i++) {
         var i2 = (i+1);
         var j2 = (j+1);
         indicesWF.push(i+j*skip, i2+j*skip, i+j*skip, i+j2*skip);
      }
  vertexCountWF = indicesWF.length;

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesWF), gl.STATIC_DRAW);

  const extraBuffer = gl.createBuffer();
  const extra2Buffer = gl.createBuffer();
  const extra3Buffer = gl.createBuffer();

  return {
    position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
    indicesWF: indexWFBuffer,
    extra: extraBuffer,
    extra2: extra2Buffer,
    extra3: extra3Buffer,
    stars: gl.createBuffer()
  };
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

// calculate current position in orbit
function calcOrbitPosition(orbit, t) {
  var period = Math.pow(bodyDistance, 1.5) * 2*Math.PI / Math.sqrt(mu1+mu2)
  orbit.period = period
  var Ldot = Math.PI*2/period
  var meanAnomaly = t * Ldot
  orbit.meanAnomaly = meanAnomaly

  var a = orbit.semiAxis
  var E = meanAnomaly
  orbit.position = [a * Math.cos(E),
                    0,
                    a * Math.sin(E)]
  
  orbit.velocity = [-a * Math.sin(E) * Ldot, 0, a * Math.cos(E) * Ldot]
  //var vel = Math.sqrt((mu1+mu2)/orbit.semiAxis)
  //console.log("vels " + vel + " " + (a*Ldot))
  //orbit.velocity = [-vel * Math.sin(E), 0, vel * Math.cos(E)]


 /* var rot = mat4.create()
  mat4.rotate(rot, rot, orbit.argumentOfPeriapsis, [0,1,0])
  vec3.transformMat4(orbit.position, orbit.position, rot)
  vec3.transformMat4(orbit.velocity, orbit.velocity, rot)*/

  // update earth position
  vec3.scale(body1Orbit.position, body2Orbit.position, -body1Offset/body2Orbit.semiAxis)
  vec3.scale(body1Orbit.velocity, body2Orbit.velocity, -body1Offset/body2Orbit.semiAxis)
}

// get semi axis for given orbit assuming given thrust
function semiAxisForVelocity (orbit, thrust, deltaTime) {
  var vel = thrustVelocity(orbit, thrust, 0, deltaTime)
  var rnorm2 = vec3.dot(orbit.position, orbit.position)
  var vnorm2 = vec3.dot(vel, vel)
  var a = 1/(2/Math.sqrt(rnorm2) - vnorm2/mu1)
  if (a < 0)
    console.log("negative a??")
  return a
}

// convert position/velocity to Kepler orbit elements
// see https://downloads.rene-schwarz.com/download/M002-Cartesian_State_Vectors_to_Keplerian_Orbit_Elements.pdf
function updateKeplerParameters (orbit) {
  var h = vec3.create()
  vec3.cross(h, orbit.position, orbit.velocity)
  var e0 = vec3.create()
  vec3.cross(e0, orbit.velocity, h)
  vec3.scale(e0, e0, 1/mu1)
  var i
  var rn = vec3.create()
  var rnorm2 = vec3.dot(orbit.position, orbit.position)
  var vnorm2 = vec3.dot(orbit.velocity, orbit.velocity)
  vec3.normalize(rn, orbit.position)
  var evec = vec3.create()

  // get vector eccentricity
  vec3.subtract(evec, e0, rn)

  // get scalar eccentricity
  var e = Math.sqrt(vec3.dot(evec, evec))

  var a = 1/(2/Math.sqrt(rnorm2) - vnorm2/mu1)
  var n = [-h[1], h[0], 0]
  var nnorm = Math.sqrt(vec3.dot(n, n))
  var arg = Math.acos(vec3.dot(n, evec)/(e*nnorm))
  if (evec[2] > 0)
    arg = Math.PI*2-arg;
  var posnorm = Math.sqrt(vec3.dot(orbit.position, orbit.position))
  var nuarg = vec3.dot(evec, orbit.position)/(e*posnorm)
  if (nuarg < -1) nuarg = -1;  // avoid Nan when doing acos on this
  if (nuarg >  1) nuarg = 1;
  var nu = Math.acos(nuarg)
  if (vec3.dot(orbit.position, orbit.velocity) < 0)
    nu = Math.PI*2 - nu
  var ea = 2*Math.atan(Math.tan(nu/2)/Math.sqrt((1+e)/(1-e)))
  var ma = ea - e*Math.sin(ea)

  // we can't handle parabolic orbits
  if (a < 0)
    return;

  if (isNaN(ma) && !alerted) {
    alerted = true
    alert("got NaN when calculating orbit parameters")
  }
  orbit.eccentricity = e
  orbit.argumentOfPeriapsis = arg
  orbit.semiAxis = a
  orbit.meanAnomaly = ma
  if (orbit == shipOrbit)
    orbit.period = Math.pow(orbit.semiAxis, 1.5) * 2*Math.PI * Math.sqrt(1/(mu1+mu2))
}

var rk_k1 = []
var rk_k2 = []
var rk_k3 = []
var rk_k4 = []
var rk_yn = []
var oldY = []

// runge-kutta integration
function rk(order, Y, t, stepsize, getForce) {
  var i
  for (i = 0; i != order; i++)
    rk_yn[i] = Y[i];
  getForce(rk_k1, t, rk_yn, stepsize)
  for (i = 0; i != order; i++)
    rk_yn[i] = (Y[i] + 0.5*stepsize*rk_k1[i]);
  getForce(rk_k2, t+stepsize*.5, rk_yn, stepsize)
  for (i = 0; i != order; i++)
    rk_yn[i] = (Y[i] + 0.5*stepsize*rk_k2[i]);
  getForce(rk_k3, t+stepsize*.5, rk_yn, stepsize)

  for (i = 0; i != order; i++)
    rk_yn[i] = (Y[i] + stepsize*rk_k3[i]);
  getForce(rk_k4, t+stepsize, rk_yn, stepsize)
  for (i = 0; i != order; i++)
    Y[i] = Y[i] + stepsize*(rk_k1[i]+2*(rk_k2[i]+rk_k3[i])+rk_k4[i])/6;
}

// calculate new velocity for ship with given thrust
function thrustVelocity(orbit, fthrust, othrust, deltaTime) {
  var vunit = vec3.create()
  var punit = vec3.create()
  vec3.normalize(vunit, orbit.velocity)
  vec3.normalize(punit, orbit.position)
  const mult = thrustMult*deltaTime
  var v = vec3.create()
  vec3.scaleAndAdd(v, orbit.velocity, vunit, mult*fthrust)
  vec3.scaleAndAdd(v, v, punit, mult*othrust)
  return v
}

function doGravityForObject(obj, center, deltaTime, param) {
  var dist = vec3.create()
  vec3.subtract(dist, obj.position, center)
  var r = Math.sqrt(vec3.dot(dist, dist))
  vec3.scaleAndAdd(obj.velocity, obj.velocity, dist, -param*deltaTime/Math.pow(r, 3))
}

function runPhysicsForObject(obj, deltaTime) {
  const maxstep = .001*timeMult
  var Y = [obj.position[0], obj.position[2], obj.velocity[0], obj.velocity[2]]
  var t = time
  var ignore2 = document.getElementById("ignoreBody2").checked;
  while (deltaTime > 0) {
    var step = Math.min(maxstep, deltaTime)
    //vec3.scaleAndAdd(obj.position, obj.position, obj.velocity, step)
    rk(4, Y, t, step, function (result, t, y, stepsize) {
      calcOrbitPosition(body2Orbit, t)
      result[0] = y[2]
      result[1] = y[3]
      var ye0 = y[0]-body1Orbit.position[0]
      var ye1 = y[1]-body1Orbit.position[2]
      var ra = Math.hypot(ye0, ye1)
      var ra3 = ra*ra*ra
      var yt0 = y[0]-body2Orbit.position[0]
      var yt1 = y[1]-body2Orbit.position[2]
      var rb = Math.hypot(yt0, yt1)
      var rb3 = rb*rb*rb
      if (ignore2)
	yt0 = yt1 = 0;
      result[2] = (-mu1*ye0/ra3 - mu2*yt0/rb3)
      result[3] = (-mu1*ye1/ra3 - mu2*yt1/rb3)
      //console.log("force " + (result[2]/result[3])/(y[0]/y[1]))
/*
      var v2r = (y[2]*y[2]+y[3]*y[3])/Math.hypot(y[0], y[1])
      if (debugA) {
        console.log("v2r " + (v2r / Math.hypot(result[2], result[3])))
        console.log("ang = " + Math.atan2(result[3], result[2])*180/Math.PI + " " + 
                               Math.atan2(y[3], y[2])*180/Math.PI);
        debugA = false
      }
*/
    })
    deltaTime -= step
    t += step
    //console.log("Y " + Y[0] + " " + Y[1] + " " + Y[2] + " " + Y[3])
  }
  obj.position[0] = Y[0]
  obj.position[2] = Y[1]
  obj.velocity[0] = Y[2]
  obj.velocity[2] = Y[3]
  updateKeplerParameters(obj)
  //console.log(obj.position[0] + " " + obj.position[1])
}

// run physics simulation for current frame
function runPhysics(deltaTime) {
  if (explosion) {
    explosion.time += deltaTimeWithoutSpeed
    explosion.size = Math.sin(explosion.time)
    if (explosion.size < 0)
      explosion = null
  }
  if (!shipOrbit)
    return

  // we can't handle parabolic orbits so limit the forward thrust to avoid that
  if (Math.abs(shipOrbit.eccentricity-1) < .01) {
    outwardThrust = 0
    if (forwardThrust > 0)
      forwardThrust = 0
  }

  vec3.scale(body1Orbit.position, body2Orbit.position, -body1Offset/body2Orbit.semiAxis)
  runPhysicsForObject(shipOrbit, deltaTime)
  //calcOrbitPosition(shipOrbit, deltaTime)
  time += deltaTime
  calcOrbitPosition(body2Orbit, time)
  if (forwardThrust != 0 || outwardThrust != 0) {
    var v = thrustVelocity(shipOrbit, forwardThrust, outwardThrust, deltaTime)
    shipOrbit.velocity = v
    deltaV += thrustMult*deltaTime*(Math.abs(forwardThrust)+Math.abs(outwardThrust))
/*
    updateKeplerParameters(shipOrbit)
    var vunit = vec3.create()
    var punit = vec3.create()
    vec3.normalize(vunit, shipOrbit.velocity)
    vec3.normalize(punit, shipOrbit.position)
    const mult = thrustMult * .001;
    vec3.scaleAndAdd(shipOrbit.position, shipOrbit.position, vunit, mult*forwardThrust)
    vec3.scaleAndAdd(shipOrbit.position, shipOrbit.position, punit, mult*outwardThrust)
*/
  }
  var diff1 = vec3.create()
  var diff2 = vec3.create()
  vec3.subtract(diff1, shipOrbit.position, body1Orbit.position);
  vec3.subtract(diff2, shipOrbit.position, body2Orbit.position);
  if (vecLength(diff1) < 1 || vecLength(diff2) < body2.radius) {
    explosion = { position: shipOrbit.position, size: 0, time: 0 };
    shipOrbit = null
  }
  zoom3d *= Math.exp(deltaTimeWithoutSpeed*zoomRate)
  //zoom3d = Math.min(Math.max(zoom3d, .005), 500)
}

function angleDiff(a, b) {
  if (a > b)
    a -= Math.PI*2
  return b-a
}

function minimumAngleDiff(a, b) {
  var d = Math.abs(a-b) % (Math.PI*2)
  if (d > Math.PI)
    d = 2*Math.PI - d
  return d
}

// current angular position in orbit
function orbitAngle(orb) {
  return orb.meanAnomaly - orb.argumentOfPeriapsis
}

const minDeltaTime = .000001

// pilot the ship to a particular mean anomaly.  returns true when done
function pilotToAngle() {
  while (true) {
    var angularStep = autopilotDeltaTime*(2*Math.PI/shipOrbit.period)
    var dist = minimumAngleDiff(shipOrbit.meanAnomaly, autopilotGoal)
    if (dist > angularStep)
      return false
    if (autopilotDeltaTime < minDeltaTime)
      return true

    // reduce delta time when we're close
    autopilotDeltaTime /= 2
    angularStep /= 2
  }
}

// pilot the ship to a particular angular difference.  returns true when done
function pilotToAngleDifference() {
  while (true) {
    var angularStepShip = autopilotDeltaTime*(2*Math.PI/shipOrbit.period)
    var angularStepTarget = autopilotDeltaTime*(2*Math.PI/body2Orbit.period)
    var angularStep = Math.abs(angularStepTarget-angularStepShip)
    var dist = minimumAngleDiff(orbitAngle(shipOrbit)+autopilotGoal, orbitAngle(body2Orbit))
    //console.log("pilot to angle diff " + dist + " " + angularStep)
    if (dist > angularStep)
      return false
    if (autopilotDeltaTime < minDeltaTime)
      return true

    // reduce delta time when we're close
    autopilotDeltaTime /= 2
    angularStep /= 2
  }
}

// verify if x is between a and b
function checkInRange(a, x, b) {
  if (a <= x && x <= b)
    return true
  if (b <= x && x <= a)
    return true
  return false
}

// pilot the ship by thrusting until our orbit has a particular semi-major axis
function pilotToSemiAxis() {
  autopilotDeltaTime = Math.min(minThrustDelta, autopilotDeltaTime)
  while (true) {
    var th = 1
    if (autopilotGoal < autopilotGoalStart)
      th = -1
    // 1.1 is fudge factor to make sure we stop in time
    var newA = semiAxisForVelocity(shipOrbit, th, autopilotDeltaTime*1.1)
    if (!checkInRange(shipOrbit.semiAxis, autopilotGoal, newA)) {
      forwardThrust = th
      return false
    }
    // reduce time step if close
    if (autopilotDeltaTime < minDeltaTime)
      return true
    autopilotDeltaTime /= 2
  }
}

// pilot the ship by thrusting until our orbit has a particular velocity
function pilotToVelocity() {
  autopilotDeltaTime = Math.min(minThrustDelta, autopilotDeltaTime)
  while (true) {
    var th = 1
    if (autopilotGoal < autopilotGoalStart)
      th = -1
    var vel = thrustVelocity(shipOrbit, th, 0, autopilotDeltaTime*1.1)
    if (!checkInRange(vecLength(shipOrbit.velocity), autopilotGoal, vecLength(vel))) {
      forwardThrust = th
      return false
    }
    // reduce time step if close
    if (autopilotDeltaTime < minDeltaTime)
      return true
    autopilotDeltaTime /= 2
  }
}

// create rotation matrix for ship-centered view
// sign = 1 has ship on left (for autopilot), -1 has ship on right (for display).  for historical reasons.
function shipRotationMatrix(orb, sign) {
  var px = vec3.create();
  var vel = vec3.create()
  vec3.normalize(vel, orb.velocity)
  vec3.cross(px, vel, [0, 1, 0])
  var m = mat4.create()
  for (var i = 0; i != 3; i++) {
    m[i*4  ] = sign*px[i]               // x = perpendicular to velocity and y axis
    m[i*4+1] = (i == 1) ? 1 : 0    // y = y axis
    m[i*4+2] = -sign*vel[i]             // z = velocity vector
  }
  return m
}

function dumpOrbit(orb, name) {
  console.log(name + "Orbit.meanAnomaly = " + orb.meanAnomaly)
  console.log(name + "Orbit.eccentricity = " + orb.eccentricity)
  console.log(name + "Orbit.semiAxis = " + orb.semiAxis)
  console.log(name + "Orbit.argumentOfPeriapsis = " + orb.argumentOfPeriapsis)
}

function drawScene(gl, buffers, deltaTime) {
  // slow down simulation when thrusting
  if (forwardThrust != 0 || outwardThrust != 0)
    deltaTime = Math.min(minThrustDelta, deltaTime)
  runPhysics(deltaTime)

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const projectionMatrix = mat4.create();

  // if window is more tall than wide, adjust fov to zoom out or the earth will be cut off on the sides
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var fov = Math.atan(aspect > 1 ? 1 : 1/aspect);
  mat4.perspective(projectionMatrix, fov, aspect, 0.1, 100000);

  var viewFrame = document.getElementById("viewFrame").value;
  if (viewFrame != lastViewFrame) {
    lastViewFrame = viewFrame
    rotationMatrix = mat4.create()
    if (viewFrame != "particle")
      mat4.rotate(rotationMatrix, rotationMatrix, -Math.PI/2, [1, 0, 0])
    if (viewFrame != "ship")
      zoom3d = 2.0/Math.max(calcApoapsis(shipOrbit), calcApoapsis(body2Orbit))
    viewAnimationTimer = 0
  }

  rotating = (viewFrame == "rotating")

  var viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [0, 0, -6]);
  mat4.multiply(viewMatrix, viewMatrix, rotationMatrix);
  if (viewFrame == "rotating")
    mat4.rotate(viewMatrix, viewMatrix, body2Orbit.meanAnomaly, [0, 1, 0]);
  mat4.scale(viewMatrix, viewMatrix, [zoom3d, zoom3d, zoom3d])
  mat4.invert(inverseRotationMatrix, rotationMatrix)

  if (viewFrame == "ship" && shipOrbit) {
    // rotate and translate so ship is at center facing up
    var m = shipRotationMatrix(shipOrbit, -1)
    viewAnimationTimer += deltaTimeWithoutSpeed
    var anim = Math.min(1, viewAnimationTimer*2.5)
    if (anim < 1) {
      // animate rotation
      var angle = Math.atan2(-m[2], m[0])
      m = mat4.create()
      mat4.rotate(m, m, anim*angle, [0, 1, 0])
    }
    mat4.multiply(viewMatrix, viewMatrix, m)
    var npos = vec3.create()
    vec3.scale(npos, shipOrbit.position, -anim)
    mat4.translate(viewMatrix, viewMatrix, npos)
  }
  if (viewFrame == "body2") {
    mat4.rotate(viewMatrix, viewMatrix, body2Orbit.meanAnomaly, [0, 1, 0]);
    var npos = vec3.create()
    vec3.scale(npos, body2Orbit.position, -1);
    mat4.translate(viewMatrix, viewMatrix, npos);
  }

  drawStars(gl, buffers, projectionMatrix, viewMatrix)
  drawPoints(gl, buffers, projectionMatrix, viewMatrix)

  var toScale = document.getElementById("toScaleCheck").checked;

  // draw planet
  var sc = Math.max(.6 * .3/Math.max(zoom3d, maxZoom3d), 1)
  if (toScale)
    sc = 1;
  if (yearLength == 0)
    drawSun(gl, buffers, projectionMatrix, viewMatrix, body1, body1Orbit.position, sc);
  else
    drawPlanet(gl, buffers, projectionMatrix, viewMatrix, body1, body1Orbit.position, sc);

  sc = 1.8 * .3/Math.max(zoom3d, maxZoom3d)
  var dist = vec3.create()
  if (shipOrbit) {
    vec3.subtract(dist, shipOrbit.position, body2Orbit.position)
    distScalar = vecLength(dist)-body2.radius
    if (sc > distScalar)
      sc = Math.max(distScalar, .3 * .3/zoom3d)
  }
  var psc = Math.max(sc/3, body2.radius);
  if (toScale)
    psc = body2.radius;
  drawPlanet(gl, buffers, projectionMatrix, viewMatrix, body2, body2Orbit.position, psc);
  sc = Math.min(sc, .8 * .3/zoom3d)
  if (toScale)
    sc = shipLength;
  if (shipOrbit)
    drawShip(gl, buffers, projectionMatrix, viewMatrix, sc, shipOrbit, shipTexture);

  if (explosion)
    drawExplosion(gl, buffers, projectionMatrix, viewMatrix);

  if (document.getElementById("showOrbit").checked)
    drawOrbit(gl, buffers, projectionMatrix, viewMatrix, body2Orbit);
  if (document.getElementById("showPotential").checked)
    drawEquips(gl, buffers, projectionMatrix, viewMatrix);

  if (shipOrbit) {
    // calculate coriolis
    // find difference between velocity in fixed and rotating frames
    var velocityAdj = vec3.create()
    var rotVec = vec3.create()
    rotVec[0] = rotVec[2] = 0
    rotVec[1] = -Math.PI*2/body2Orbit.period
    vec3.cross(velocityAdj, rotVec, shipOrbit.position)
  
    var velocityUnit = vec3.create();
    var velocityFixed = vec3.create();
    var arrowDir = vec3.create()
  
    // get velocity in rotating frame
    var velocity = vec3.create();
    vec3.subtract(velocity, shipOrbit.velocity, velocityAdj)

    // rotation vector times -1 (since Coriolis force expression is negative)
    rotVec[1] *= -100000
    vec3.cross(arrowDir, rotVec, velocity)

    //vec3.scale(arrowDir, velocity, 10000)

    //if (document.getElementById("showCoriolis").checked)
      //drawArrow(gl, buffers, projectionMatrix, viewMatrix, shipOrbit.position, arrowDir, [1,.5,0])
  }

  if (!stoppedCheck.checked) {
     // update world rotation and particle position
     worldRotationSpeed = 1
     worldRotationSpeed *= Math.PI*2/siderealDay
     worldRotation += deltaTime*worldRotationSpeed
  }
}

function drawStars(gl, buffers, projectionMatrix, viewMatrix) {
  gl.useProgram(starProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
  mat4.scale(modelViewMatrix, modelViewMatrix, [1/zoom3d, 1/zoom3d, 1/zoom3d])
      
  mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI*(23.5)/180,    [0, 0, 1]); // axial tilt
  mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI/2, [1, 0, 0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.stars);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stars), gl.STATIC_DRAW);
          
  gl.vertexAttribPointer(starProgramInfo.attribLocations.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(starProgramInfo.attribLocations.vertexPositionAttribute);
      
  gl.uniformMatrix4fv(starProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(starProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(starProgramInfo.uniformLocations.color, 1, 1, 1, 1);

  gl.disable(gl.DEPTH_TEST);
  gl.drawArrays(gl.POINTS, 0, stars.length/3);
  gl.enable(gl.DEPTH_TEST);
  gl.disableVertexAttribArray(starProgramInfo.attribLocations.vertexPositionAttribute);
}

function drawPoints(gl, buffers, projectionMatrix, viewMatrix) {
  gl.useProgram(pointProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);
      
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
          
  gl.vertexAttribPointer(pointProgramInfo.attribLocations.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(pointProgramInfo.attribLocations.vertexPositionAttribute);
      
  gl.uniformMatrix4fv(pointProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(pointProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);

  // draw lagrange points
  var vec = vec3.create();
  for (var i = 0; i != 5; i++) {
    vec3.rotateY(vec, lagrangePoints[i], [0, 0, 0], -body2Orbit.meanAnomaly);
    var verts = Array.from(vec);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
    if (i == 0)
      gl.uniform4f(pointProgramInfo.uniformLocations.color, 1, 0, 0, 1);
    if (i == 1)
      gl.uniform4f(pointProgramInfo.uniformLocations.color, 1, .5, 0, 1);
    if (i == 2)
      gl.uniform4f(pointProgramInfo.uniformLocations.color, 1, 1, 0, 1);
    if (i == 3)
      gl.uniform4f(pointProgramInfo.uniformLocations.color, 0, .8, 0, 1);
    if (i == 4)
      gl.uniform4f(pointProgramInfo.uniformLocations.color, 0, 0, 1, 1);
    gl.drawArrays(gl.POINTS, 0, verts.length/3);
  }

  // draw barycenter
  var verts = [0, 0, 0]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.uniform4f(pointProgramInfo.uniformLocations.color, 0, 1, 1, 1);
  gl.drawArrays(gl.POINTS, 0, verts.length/3);

  gl.disableVertexAttribArray(pointProgramInfo.attribLocations.vertexPositionAttribute);
}

function drawOrbit(gl, buffers, projectionMatrix, viewMatrix, orbit) {
  gl.useProgram(colorPlainProgramInfo.program);
  const modelViewMatrix = mat4.create();
  
  mat4.copy(modelViewMatrix, viewMatrix);
  mat4.rotate(modelViewMatrix, modelViewMatrix, orbit.argumentOfPeriapsis, [0, 1, 0])

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  var verts = [];
  var i;
  var semiAxis = orbit.semiAxis
  var ecc = orbit.eccentricity
  var stepCount = 1000
  for (i = 0; i != stepCount; i++) {
    var ang = Math.PI*2*i/stepCount;
    var r = semiAxis*(1-ecc*ecc)/(1+ecc*Math.cos(ang));
    verts.push(r*Math.cos(ang), 0, r*Math.sin(ang));
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(colorPlainProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);

  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);

  gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, 1, 1, 0, 1); // yellow
  gl.drawArrays(gl.LINE_LOOP, 0, verts.length/3);
}

// set sun position when doing lighting if sun is not present
function setSunPosition(uni, pos) {
  if (yearLength == 0)
    vec = [-pos[0], 0, -pos[2]]
  else {
    var ang = time*Math.PI*2/(yearLength*24);
    var vec = [1000*Math.cos(ang), 0, 1000*Math.sin(ang)];
  }
  gl.uniform3fv(uni, vec);
}

function drawPlanet(gl, buffers, projectionMatrix, viewMatrix, planet, pos, scale) {
  const modelViewMatrix = mat4.create();

  // this is flipped compared to coriolis, etc. because rockets were orbiting wrong way around
  mat4.copy(modelViewMatrix, viewMatrix);

  mat4.translate(modelViewMatrix, modelViewMatrix, pos)

  const normalMatrix = mat4.create();
  //mat4.rotate(normalMatrix, normalMatrix, Math.PI*(23.5)/180,    [0, 0, 1]); // axial tilt
  //mat4.rotate(normalMatrix, normalMatrix, -worldRotation, [0, 1, 0]);
  mat4.rotate(normalMatrix, normalMatrix, planet.axialTilt, [0, 0, 1]); // axial tilt
  mat4.rotate(normalMatrix, normalMatrix, -time*planet.rotationSpeed, [0, 1, 0]);
  mat4.rotate(normalMatrix, normalMatrix, Math.PI/2,    [1, 0, 0]);
  if (planet == jupiter)
    mat4.scale(normalMatrix, normalMatrix, [1, 1, 1-.06487]); // oblate

  // copy transformations from normal matrix to model view matrix
  mat4.multiply(modelViewMatrix, modelViewMatrix, normalMatrix);

  var programInfo = textureProgramInfo

  mat4.scale(modelViewMatrix, modelViewMatrix, [scale, scale, scale, 1])

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix,     false, normalMatrix);

  setSunPosition(programInfo.uniformLocations.lightPosition, pos);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, planet.texture);
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  gl.drawElements(gl.TRIANGLES, angleRes*angleRes*3*2, gl.UNSIGNED_SHORT, 0);
  gl.disableVertexAttribArray(programInfo.attribLocations.textureCoord);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexNormal);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function drawSun(gl, buffers, projectionMatrix, viewMatrix, planet, pos, scale) {
  const modelViewMatrix = mat4.create();

  // this is flipped compared to coriolis, etc. because rockets were orbiting wrong way around
  mat4.copy(modelViewMatrix, viewMatrix);

  mat4.translate(modelViewMatrix, modelViewMatrix, pos)

  var programInfo = colorPlainProgramInfo
  gl.useProgram(programInfo.program);

  mat4.scale(modelViewMatrix, modelViewMatrix, [scale, scale, scale, 1])

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, 1, 1, 1, 1); // yellow

  gl.drawElements(gl.TRIANGLES, angleRes*angleRes*3*2, gl.UNSIGNED_SHORT, 0);
}

function drawArrow(gl, buffers, projectionMatrix, viewMatrix, pos, arrowVec, col) {
  gl.useProgram(colorPlainProgramInfo.program);
  const modelViewMatrix = mat4.create();
  mat4.copy(modelViewMatrix, viewMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);

  var vecLen = Math.sqrt(vec3.dot(arrowVec, arrowVec))

  // calculate arrow points
  var arrowLen = 1
  var arrowHeadSize = 1/vecLen
  if (arrowHeadSize > arrowLen)
     arrowHeadSize = 1
  var verts = []
  var arrowTip = []
  var headVec = vec3.create()
  var zVec = vec3.create()

  // find a vector perpendicular to arrow vector and eye vector, so the arrowhead can be seen
  vec3.transformMat4(zVec, [0, 0, 1], inverseRotationMatrix)
  vec3.cross(headVec, arrowVec, zVec)

  verts = verts.concat(Array.from(pos))
  for (var i = 0; i != 3; i++)
    arrowTip.push(pos[i]+arrowVec[i]*arrowLen)
  verts = verts.concat(arrowTip, arrowTip)
  for (i = 0; i != 3; i++)
    verts.push(pos[i]+arrowVec[i]*(arrowLen-arrowHeadSize)+headVec[i]*arrowHeadSize)
  verts = verts.concat(arrowTip)
  for (i = 0; i != 3; i++)
    verts.push(pos[i]+arrowVec[i]*(arrowLen-arrowHeadSize)-headVec[i]*arrowHeadSize)

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorPlainProgramInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorPlainProgramInfo.attribLocations.vertexPosition);

  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(colorPlainProgramInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniform4f(colorPlainProgramInfo.uniformLocations.color, col[0], col[1], col[2], 1);
  gl.drawArrays(gl.LINES, 0, 6);
}

function drawShip(gl, buffers, projectionMatrix, viewMatrix, scale, orb, texture) {
  var diff1 = vec3.create()
  vec3.subtract(diff1, orb.position, body1Orbit.position);
  var distToBody1 = vecLength(diff1)-1
  if (scale > distToBody1)
    scale = distToBody1
  scale /= 18   // model is 18 units long

  if (!meshes)
    return;

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();
  var pos = orb.position

  var stoppedCheck = document.getElementById("stoppedCheck");

  // start with viewMatrix
  mat4.copy(modelViewMatrix, viewMatrix);

  // position
  mat4.translate(modelViewMatrix, modelViewMatrix, pos);

  // align with orbital plane
  mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI/2, [1, 0, 0])

  // point in right direction
  var vel = orb.velocity
  var angle = Math.atan2(vel[0], vel[2])
  if (orb == shipOrbit) {
    if (forwardThrust < 0)
      angle += Math.PI
    if (outwardThrust > 0)
      angle = Math.atan2(pos[0], pos[2])
    if (outwardThrust < 0)
      angle = Math.atan2(-pos[0], -pos[2])
  }
  mat4.rotate(modelViewMatrix, modelViewMatrix, -angle, [0, 0, 1])

  // turn so target is face up
  const targetTwist = -1.8
  mat4.rotate(modelViewMatrix, modelViewMatrix, targetTwist, [0, 1, 0])

  // calculate normal matrix before scale
  const normalMatrix = mat4.create();
  mat4.rotate(normalMatrix, normalMatrix, Math.PI/2, [1, 0, 0])
  mat4.rotate(normalMatrix, normalMatrix, -angle, [0, 0, 1])
  mat4.rotate(normalMatrix, normalMatrix, targetTwist, [0, 1, 0])

  mat4.scale(modelViewMatrix, modelViewMatrix, [scale, scale, scale, 1])

  var mesh = meshes.csm
  var programInfo = textureProgramInfo

  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer)
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer)
  gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer)
  gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer)
  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix,     false, normalMatrix);
  setSunPosition(programInfo.uniformLocations.lightPosition, pos);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.disableVertexAttribArray(programInfo.attribLocations.textureCoord);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexNormal);



  var v = vec3.create()
  vec3.scale(v, orb.velocity, 5)
  //drawArrow(gl, buffers, projectionMatrix, viewMatrix, pos, v, [0,1,0])

  if (forwardThrust == 0 && outwardThrust == 0 || orb != shipOrbit)
    return;

  // draw thrust
  programInfo = textureNoLightingProgramInfo
  gl.useProgram(programInfo.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  const tx = 8
  const ty = -20 - 50*Math.random()
  var verts = [-tx, -18, 0,  -tx, ty, 0,  tx, -18, 0,  -tx, ty, 0,  tx, -18, 0,  tx, ty, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  var verts = [0, 0,  0, 1,  1, 0,  0, 1,  1, 0,  1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

  mat4.rotate(modelViewMatrix, modelViewMatrix, -targetTwist, [0, 1, 0])

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, thrustTexture);
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  //gl.enable(gl.BLEND);
  //gl.disable(gl.DEPTH_TEST);
  //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
  gl.disableVertexAttribArray(programInfo.attribLocations.textureCoord);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  //gl.disable(gl.BLEND);
  //gl.enable(gl.DEPTH_TEST);
}

function drawExplosion(gl, buffers, projectionMatrix, viewMatrix) {
  var programInfo = textureNoLightingProgramInfo
  gl.useProgram(programInfo.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  const tx = 1
  const ty = 1
  var verts = [-tx, -ty, 0,  -tx, ty, 0,  tx, -ty, 0,  -tx, ty, 0,  tx, -ty, 0,  tx, ty, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra2);
  var verts = [0, 0,  0, 1,  1, 0,  0, 1,  1, 0,  1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

  var modelViewMatrix = mat4.create()
  mat4.copy(modelViewMatrix, viewMatrix)
  mat4.translate(modelViewMatrix, modelViewMatrix, explosion.position)
  mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI/2, [1, 0, 0])
  var sc = explosion.size*.8
  mat4.scale(modelViewMatrix, modelViewMatrix, [sc, sc, sc])

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, modelViewMatrix);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, explosionTexture);
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
  gl.disableVertexAttribArray(programInfo.attribLocations.textureCoord);
  gl.disableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.disable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
}

// draw equipotentials using a shader made for that purpose
function drawEquips(gl, buffers, projectionMatrix, viewMatrix) {
  var programInfo = equipProgramInfo;
  gl.useProgram(programInfo.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.extra);
  var y = .1;
  var xz = 5*body2Orbit.semiAxis;
  var verts = [-xz, y, -xz, -xz, y, xz, xz, y, -xz, xz, y, xz];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,  false, viewMatrix);
  var ignore2 = document.getElementById("ignoreBody2").checked;
  gl.uniform4f(programInfo.uniformLocations.body1Position, body1Orbit.position[0],
               body1Orbit.position[1], body1Orbit.position[2], mu1);
  gl.uniform4f(programInfo.uniformLocations.body2Position, body2Orbit.position[0],
               body2Orbit.position[1], body2Orbit.position[2], ignore2 ? 0 : mu2);
  gl.uniform4f(programInfo.uniformLocations.rotationVector, 0, 2*Math.PI/body2Orbit.period, 0, potentialScale);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function thrust(x, y) {
  forwardThrust = x
  outwardThrust = y
}

function zoom(x) {
  zoomRate = x
}

function randomEccentricity(axis) {
  if (Math.random() < .6)
    return 0
  var ecc = Math.random()*.5+.1

  // make sure it doesn't crash into earth
  if (axis*(1-ecc) < 1.03)
    return 0
  return ecc
}

function randomPeriapsis() {
  return (Math.random()*2-1)*Math.PI
}

// Newton's method
function findRoot(x, calc)
{
  var i
  for (i = 0; i != 1000; i++) {
    var fx = calc(x);
    var dx = 1e-6;
    var fxdx = calc(x+dx);
    var x0 = x;
    x -= fx/((fxdx-fx)/dx);
    //console.log("x " + x);
    if (Math.abs(x-x0) < 1e-8)
      break;
  }
  return x;
}

function setSystem(mu1real, mu2real, r1, r2, axis, yl, b1, b2, tm, ps) {
  // r1 is radius of body1 in km.  we use that as our length scale
  lengthUnit = r1;
  
  // mu1real, mu2real are in m^3/s^2, change that to length units^3/hr^2
  mu1 = mu1real*3600*3600/Math.pow(lengthUnit*1e3, 3);
  mu2 = mu2real*3600*3600/Math.pow(lengthUnit*1e3, 3);

  if (b1 == bluePlanet) {
    var rr = document.getElementById("massRatioSlider").value/100;
    var ratio = Math.exp(rr*7)+.01;
    mu2 = mu1/ratio;
  }

  body2Orbit.semiAxis = axis/lengthUnit;
  yearLength = yl;
  body1 = b1;
  body2 = b2;
  body1.radius = 1;
  body2.radius = r2/lengthUnit;
  shipLength = .008/lengthUnit;
  timeMult = tm;
  potentialScale = ps;

  document.getElementById("ignoreBody2Label").innerHTML = "Ignore " + body2.name + " gravity:";
  document.getElementById("showOrbitLabel").innerHTML = "Show " + body2.name + " orbit:";
  document.getElementById("viewFrameBody2").innerHTML = body2.name;
  var system = document.getElementById("systemSelect").value
  document.getElementById("horseshoe").disabled = !(system == "sunEarth" || system == "sunJupiter");
  document.getElementById("orbitEarth").innerHTML = "Example: Orbiting " + body1.name;
  document.getElementById("orbitMoon").innerHTML = "Example: Orbiting " + body2.name;
}

function getLagrangePoint(which, pos, vel) {
  if (which <= 3) {
    var start = (which == 1) ? bodyDistance/2 :
                (which == 2) ? bodyDistance * 1.01 : -bodyDistance;
    var moonV = vecLength(body2Orbit.velocity)
    var x = findRoot(start, function (x) {
      var v = moonV * x/body2Orbit.semiAxis;
      var re = body1Offset + x;
      var rm = body2Orbit.semiAxis - x;
      var centrif = v*v/x;
      var rs = Math.sign(re)*mu1/(re*re) - Math.sign(rm)*mu2/(rm*rm);
      return centrif-rs;
    })
    vec3.scale(pos, body2Orbit.position, x / body2Orbit.semiAxis)
    vec3.scale(vel, body2Orbit.velocity, Math.sign(x)*vecLength(pos)/body2Orbit.semiAxis)
  } else {
    var angle = (which == 4) ? -Math.PI/3 : Math.PI/3
    vec3.scale(body1Orbit.position, body2Orbit.position, -body1Offset/body2Orbit.semiAxis)
    vec3.rotateY(pos, body2Orbit.position, body1Orbit.position, angle)

    // get magnitude of the velocity
    var velMag = vecLength(body2Orbit.velocity)*vecLength(pos)/body2Orbit.semiAxis

    // set velocity perpendicular to ship position vector
    vel[0] = -pos[2]
    vel[2] =  pos[0]
    vec3.scale(vel, vel, velMag/vecLength(vel));
  }
}

// calculate pos & vel to orbit a body in circular orbit
function orbitBody(body, r, mu) {
  var bodyR = vecLength(body.position);
  vec3.scale(shipOrbit.position, body.position, (bodyR+r)/bodyR)
  //vec3.rotateY(shipOrbit.position, shipOrbit.position, body1Orbit.position, Math.PI)
  var velMag = Math.sqrt(mu/r);
  vec3.copy(shipOrbit.velocity, [0, 0, -velMag]);
  vec3.add(shipOrbit.velocity, shipOrbit.velocity, body.velocity);
}

function reset() {
  body1Orbit = { }
  body2Orbit = { eccentricity: 0,
                  semiAxis: 60.39,
                  argumentOfPeriapsis: 0, // randomPeriapsis(),
                  meanAnomaly: 0 // Math.random()*Math.PI*2
  }

  var system = document.getElementById("systemSelect").value
  if (system == "sunEarth")
    setSystem(1.32712440018e20, 3.986004418e14, 6.957e5, 6.3781e3, 149.6e6, 0, sun, earth, 10, 491)
  else if (system == "earthMoon")
    setSystem(3.986004418e14, 4.9048695e12, 6.3781e3, 1737.4, 384748, 365.24, earth, moon, 1, 165)
  else if (system == "sunJupiter")
    setSystem(1.32712440018e20, 1.26686534e17, 6.957e5, 69911, 778.57e6, 0, sun, jupiter, 100, 12265)
  else if (system == "plutoCharon")
    setSystem(8.71e11, 105850908800, 1188, 606, 17181, 90560, pluto, charon, .5, 60)
  else if (system == "custom")
    setSystem(8e11, 10e11, 1000, 600, 17000, 90000, bluePlanet, redMoon, .5, 60)

  document.getElementById("massRatioSlider").disabled = (system != "custom");
  document.getElementById("ignoreBody2").checked = false;

  shipOrbit = { eccentricity: 0,
                semiAxis: 10,
                argumentOfPeriapsis: 0, // randomPeriapsis(),
                meanAnomaly: 0
  }
  bodyDistance = body2Orbit.semiAxis / (mu1/(mu1+mu2))
  body1Offset = bodyDistance * mu2 / (mu1 + mu2)
  body1Orbit.position = vec3.create()
  body1Orbit.velocity = vec3.create()

  calcOrbitPosition(body2Orbit, 0)

  // fill in rotation speed for charon/moon assuming it's body2 (harmless if it's not)
  charon.rotationSpeed = moon.rotationSpeed = Math.PI*2/body2Orbit.period

  shipOrbit.position = vec3.create()
  shipOrbit.velocity = vec3.create()

  for (var i = 0; i != 5; i++) {
    var vel = [];
    var pos = [0, 0, 0];
    getLagrangePoint(i+1, pos, vel);
    lagrangePoints[i] = pos;
  }
  var example = document.getElementById("exampleSelect").value
  if (example.length == 1) {
    var which = parseInt(example, 10);
    getLagrangePoint(which, shipOrbit.position, shipOrbit.velocity);
  } else if (example == "tadpole") {
    getLagrangePoint(4, shipOrbit.position, shipOrbit.velocity);
    vec3.rotateY(shipOrbit.position, shipOrbit.position, [0, 0, 0], .05);
  } else if (example == "horseshoe") {
    // .98 works for sun/jupiter, .99 for sun/earth
    var mult = (system == "sunEarth") ? .99 : .98;
    var r = mult * vecLength(body2Orbit.position)
    vec3.scale(shipOrbit.position, body2Orbit.position, r/body2Orbit.semiAxis)
    vec3.rotateY(shipOrbit.position, shipOrbit.position, body1Orbit.position, Math.PI)
    //var velMag = Math.sqrt((mu1+mu2)/r);
    var velMag = Math.sqrt(mu1/r);
    vec3.copy(shipOrbit.velocity, [0, 0, -velMag]);
/*
    var r = body2Orbit.semiAxis*.88;
    orbitBody(body1Orbit, r, mu1);
    vec3.rotateY(shipOrbit.position, shipOrbit.position, body1Orbit.position, -Math.PI/2);
    vec3.rotateY(shipOrbit.velocity, shipOrbit.velocity, [0,0,0], -Math.PI/2);
*/
  } else if (example == "orbitEarth") {
    var r = body2Orbit.semiAxis/2;
    orbitBody(body1Orbit, r, mu1);
  } else if (example == "orbitMoon") {
    var L1L2 = vec3.create();
    // get diameter of Hill sphere (dist from L1 to L2)
    vec3.subtract(L1L2, lagrangePoints[0], lagrangePoints[1]);
    var r = vecLength(L1L2)/8;
    orbitBody(body2Orbit, r, mu2);
  }

/*
  autopilotState = 0
  autopilotCheck.checked = false
  autopilotCheck.onchange()
*/

  time = forwardThrust = outwardThrust = deltaV = 0
  autopilotText = null
  autopilotUsed = success = false
  explosion = null
  refresh()
  zoom3d = maxZoom3d = 2.0/vecLength(lagrangePoints[1])
  debugA = true
}

window.onload = main

