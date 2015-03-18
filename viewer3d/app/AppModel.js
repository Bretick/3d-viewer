/*
Copyright © 2014, Bretislav Mazoch

This file is part of 3D viewer app.

3D viewer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Foobar is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/


/*
==========================================
File Name: 
AppModel.js

Project: 
Viewer of 3D models with animations

Author: 
Bretislav Mazoch, b.mazoch@email.cz

Created On: 
01/2014

Last Change On: 
05/2014
==========================================
*/



//=======================
//Viewer3D.AppModel class
//=======================


/** @namespace */
var Viewer3D = Viewer3D || {};





//some constants 
Viewer3D.ROTATE_SPEED = 1.0;
Viewer3D.ZOOM_SPEED = 3.0;
Viewer3D.PAN_SPEED = 1.0;
Viewer3D.MIN_DISTANCE = 1;
Viewer3D.MAX_DISTANCE = 200;

Viewer3D.DEFAULT_CAMERA_X = 0;
Viewer3D.DEFAULT_CAMERA_Y = 0;
Viewer3D.DEFAULT_CAMERA_Z = 60;

Viewer3D.DEFAULT_WIDTH = 920;
Viewer3D.DEFAULT_HEIGHT = 690;
Viewer3D.MIN_WIDTH = 560;
Viewer3D.MIN_HEIGHT = 420;






/**
* Viewer3D.AppModel 
* @class Business logic for the app.
* 
* @param {number} width Width of viewer.
* @param {number} height Height of the viewer (viewer total height is height argument + tabs height).
* @param {string} sourcePathArg Path to the model.
* @param {number} modelScale Value to scale the model.
* @param {array} animationsList Animations of the loaded model.
* @param {array} looksList Cameras which define different looks on the loaded model.
* @param {array} objectsList Objects of the loaded model at which can be changed their properties.
* 
*/
Viewer3D.AppModel = function (width, height, sourcePath, modelScale, animationsList, looksList, objectsList) {			
	
	//who is observing the model?
	this._observers = new Array();	


	//PROPERTIES
	this._scene, this._group, this._renderer, this._container3D, this._stats, this._containerStats,
	this._orbitControls, this._cameraFree, this._activeAnimation, this._activeCamera, this._loader, 
	this._clock, this._delta;	
	
	
	
	//VIEWER OPTIONS
	this._sourcePath = sourcePath || undefined;
	this._modelScale = modelScale || undefined;
	
	this._width = ((width || Viewer3D.DEFAULT_WIDTH) < Viewer3D.MIN_WIDTH) ? Viewer3D.MIN_WIDTH : (width || Viewer3D.DEFAULT_WIDTH);
	this._height = ((height || DEFAULT_HEIGHT) < Viewer3D.MIN_HEIGHT) ? Viewer3D.MIN_HEIGHT : (height || DEFAULT_HEIGHT);
	
	this._originalWidth = this._width;
	this._originalHeight = this._height;
	
	
	
		
	// class of container with all available control properties
	function GUIControls() {
		
		//MENU CONTROLS
		this.looksList = looksList || [];
		this.looksList.unshift('volný pohled'); //moves default item to begging
		this.activeLookName = this.looksList[0];
		this.animationsList = animationsList || [];
		this.animationsList.unshift('vypnuto'); //moves default item to begging
		this.activeAnimationName = this.animationsList[0];
		this.objectsList = objectsList || [];
		this.performaceStatistics = false;		
		
		//STATE CONTROLS
		this.fullscreen = false;
		this.orbit = true; //if true then orbit controls are updated	
		this.animationPlaying = false;
		this.animationPaused = false;
		this.animationWasPlaying = false;
		
	};
	
	this.guiControls = new GUIControls();	
	
    	
} // ends Viewer3D.AppModel





/**
 * Initializates the model.
 * 
 * @param {DOMelement} container Container of canvas for 3D.
 * 
 */		
Viewer3D.AppModel.prototype.init = function () {		

	//set clock for animation purposes
	this._clock = new THREE.Clock();

	//create the scene
	this._scene = new THREE.Scene();		


	//init the WebGL renderer, sets alpha to true because of use of gradient background
	this._renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});		
	this._renderer.setSize(this._width, this._height);	 
	this._renderer.setClearColor(0x000000, 0);	
	
	this._container3D.appendChild(this._renderer.domElement);
	
		
	//create the camera (field of vision, aspect ratio, nearest point, farest point) 
	this._cameraFree = new THREE.PerspectiveCamera(45, this._width / this._height, 1, 2000);
	this._cameraFree.position.set(Viewer3D.DEFAULT_CAMERA_X, Viewer3D.DEFAULT_CAMERA_Y, Viewer3D.DEFAULT_CAMERA_Z);	
	this._activeCamera = this._cameraFree;
	
	
	//init orbit controls		
	this._orbitControls = new THREE.OrbitControls(this._cameraFree, this._container3D);
	
	this._orbitControls.rotateSpeed = Viewer3D.ROTATE_SPEED;
	this._orbitControls.zoomSpeed = Viewer3D.ZOOM_SPEED;
	this._orbitControls.keyPanSpeed = Viewer3D.PAN_SPEED;
	this._orbitControls.minDistance = Viewer3D.MIN_DISTANCE;
	this._orbitControls.maxDistance = Viewer3D.MAX_DISTANCE;
	
	this._orbitControls.noZoom = false;
	this._orbitControls.noPan = false;
	this._orbitControls.noKeys = true; //disables keyboard manipulation - problems with window scrollbar


	//add default ambient light
	var ambient = new THREE.AmbientLight(0x111111);
	this._scene.add(ambient);	
	
	
	
	//create group for objects
	this._group = new THREE.Object3D();
	this._scene.add(this._group);	
	
	
	//init stats utility
	this._stats = new Stats();
	this._containerStats.appendChild(this._stats.domElement);
	

	//loading 3D model				
	this.sourceLoader(this._sourcePath);		
	
	
	//render 3D
	this.render();	


	//we need update AppView by AppController
    this.notifyInitModelComplete();	
		
}





/**
 * Renders the scene and relaunches it - infinite render cycle.
 * 
 */	 
Viewer3D.AppModel.prototype.render = function () {		

	//animations
	this.animate();

	//render 3D scene
	this._renderer.render(this._scene, this._activeCamera);

	//update orbit controls
	this._orbitControls.update();
	
	//update stats
	this._stats.update();
	
	//relaunch the 'timer'
	requestAnimationFrame(this.render.bind(this)); //bind function - http://stackoverflow.com/questions/6065169/requestanimationframe-with-this-keyword

}





/**
 * Returns size parameters width and height.
 * 
 * @param {boolean} original If true, returns original size, current size otherwise.
 * 
 * @return {object} Object represented width and height.
 * 
 */			
Viewer3D.AppModel.prototype.getSize = function (original) {	
	
	var sizeObject = original ? {width: this._originalWidth, height: this._originalHeight} : {width: this._width, height: this._height};
	
	return sizeObject;
	
}





/**
 * Sets size of the canvas and also sets camera for correct rendering of 3D view.
 * 
 * @param {number} width Width of the canvas for 3D.
 * @param {number} height Height of the canvas for 3D.
 * 
 */		
Viewer3D.AppModel.prototype.setSize = function (width, height) {		

	this._width = width;
	this._height = height;

	this._activeCamera.aspect = width / height;
	this._activeCamera.updateProjectionMatrix();

	this._renderer.setSize(width, height);
		
}





/**
 * Sets active camera look.
 * 
 * @param {string} value Name of the look.
 * 
 */		
Viewer3D.AppModel.prototype.setActiveCamera = function (value) {
		
	this.resetLook();	
	
	//if true then sets default camera, otherwise sets camera by choosen look
	if (this.guiControls.looksList[0] === value) {		
		
		this._orbitControls.enabled = true;				
				
	} else {						

		this._orbitControls.enabled = false;	
		
		var camera = this._loader.getCamera(this.guiControls.activeLookName);				
		this._activeCamera.position.set(camera.position.x, camera.position.y, camera.position.z);	
		this._activeCamera.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);			
																							
	}
		
}





/**
 * Sets 3D container.
 * 
 * @param {DOMelement} container3D DOM element of container for 3D canvas.
 * @param {DOMelement} containerStats DOM element of container for stats utility.
 * 
 */		
Viewer3D.AppModel.prototype.setContainers = function (container3D, containerStats) {		
	
	this._container3D = container3D;	
	this._containerStats = containerStats;
		
}


	
	
/**
 * Loads Sea3D models.
 * 
 * @param {string} sourcePathArg Path to the model.
 * 
 */	
Viewer3D.AppModel.prototype.sourceLoader = function (sourcePathArg) {	

    this._loader = new THREE.SEA3D();
    
	var self = this;
    this._loader.onComplete = function (e) {	
        
        //if there is no lights in model we add default lights
        if(!self._loader.lights) {	
			var dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
			dirLight1.position.set(0, -1, -1);
			self._scene.add(dirLight1);
	
			var dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
			dirLight2.position.set(0, 1, 1);
			self._scene.add(dirLight2);	      
        }
     
     
        //if scale of model is setted then scales meshes		
		if(self._modelScale) {
			self._group.scale.set(self._modelScale, self._modelScale, self._modelScale);			
		}  
		
        self.notifySourceLoadingComplete();   
        		
    };
        
   
    this._loader.container = this._group;
	this._loader.parser = THREE.SEA3D.DEFAULT; //compatible mode
        
    
	self.notifySourceLoadingStart();   	
 	$.get(sourcePathArg, function() {
	    self._loader.load(sourcePathArg);	       
    });
    
};	





/**
 * Animates active animations.
 * 
 */	 
Viewer3D.AppModel.prototype.animate = function () {		

	//delta = how much time passes with each frame
	this._delta = this._clock.getDelta();		
		
	if(this.guiControls.animationPlaying) {		
		
		//updates animation handler for keyframe animation
		for(var i in this._loader.meshes) {
			if (this._loader.meshes[i].animation)
				this._loader.meshes[i].animation.update(this._delta * 1000);
		}
				
		//get and update some values for animation slider
		var activeAnimationParams = this.getParamsOfActiveAnimation();
		this.notifyAnimationUpdate({percent: activeAnimationParams.percent, time: activeAnimationParams.time, duration: activeAnimationParams.duration});	
	}
		
}





/**
 * Sets active animation.
 * 
 * @param {string} value Name of the animation.
 * 
 */		
Viewer3D.AppModel.prototype.setActiveAnimation = function (value) {		
	
	//if true then sets animation off, otherwise sets choosen animation
	if(this.guiControls.animationsList[0] === value) {
		
		this._activeAnimation = undefined;
		
	} else {
		
		this.resetLook();		
			
		//choose mesh with the longest active animation length (in case that source file of model is not prepared correctly)
		var countOfFrames = 0;
		for(var i in this._loader.meshes) {
			if (this._loader.meshes[i].animation) {
				if(this._loader.meshes[i].animation.animationSet.getAnimationByName(this.guiControls.activeAnimationName).length > countOfFrames) {
					this._activeAnimation = this._loader.meshes[i].animation.animationSet.getAnimationByName(this.guiControls.activeAnimationName);
					countOfFrames = this._activeAnimation.length;
				}
			}
		}		
		
	}			
		
}





/**
 * Gets params of active animation.
 * 
 * @return {object} Object represented active animation params (percent (in percents), time (in miliseconds), frame (number), duration (in miliseconds)).
 * 
 */		
Viewer3D.AppModel.prototype.getParamsOfActiveAnimation = function () {		

		var countOfFrames = 0;
		var currentFrame = 0;
		var frameMill = 0;
		
		var durationTime = 0;
		var currentTime = 0;
		var animationPosition = 0; //in percent
		
		if(this._activeAnimation) {
			countOfFrames = this._activeAnimation.length;
			currentFrame = Math.round(this._activeAnimation.frame);
			frameMill = this._activeAnimation.frameMill;			
			durationTime = Math.round(this._activeAnimation.duration);
			currentTime = currentFrame * frameMill;
			animationPosition = (currentFrame / countOfFrames) * 100; //in percents			
		}
		
		var returnObject = {percent: animationPosition, time: currentTime, frame: currentFrame, duration: durationTime};
		
		return returnObject;	
		
}



	
	
/**
 * Plays all animations of given name of animation sequence.
 * 
 * @param {string} name Name of the animation sequence to play.
 * 
 */	
Viewer3D.AppModel.prototype.playAllAnimations = function (name) {

	this.guiControls.animationPlaying = true;
	
	// play all animations of given name	
	for(var i in this._loader.meshes) {
		if (this._loader.meshes[i].animation)
		{
			(this.guiControls.animationPaused) ? this._loader.meshes[i].animation.resume() : this._loader.meshes[i].animation.play(name, .3);			
		}
	}
	
	this.guiControls.animationPaused = false;
	
}





/**
 * Stops all active animations.
 * 
 */				
Viewer3D.AppModel.prototype.stopAllAnimations = function () {
	
	this.guiControls.animationPlaying = false;	
	
	//stop animations
	for(var i in this._loader.meshes) {
		if (this._loader.meshes[i].animation) {
			this._loader.meshes[i].animation.stop(); 
		}
	}	

	//get and update some values for animation slider
	var activeAnimationParams = this.getParamsOfActiveAnimation();
	this.notifyAnimationUpdate({percent: 0, time: 0, duration: activeAnimationParams.duration});

}





/**
 * Pauses all active animations.
 * 
 */				
Viewer3D.AppModel.prototype.pauseAllAnimations = function () {
	
	this.guiControls.animationPlaying = false;
	this.guiControls.animationPaused = true;

	for(var i in this._loader.meshes) {
		if (this._loader.meshes[i].animation) {
			this._loader.meshes[i].animation.pause();
		}
	}	

}





/**
 * Scales time by appropriate value.
 * 
 * @param {number} timeScale Value of the scale (greater than 1 => faster, least than 1 => slower).
 * 
 */			
Viewer3D.AppModel.prototype.setTimeScale = function (timeScale) {		
				
	//set time scale in all animations
	for(var i in this._loader.meshes) {
		if (this._loader.meshes[i].animation) {
			this._loader.meshes[i].animation.timeScale = timeScale;
		}
	}	
	
}





/**
 * Sets active animation to specific time expressed by percent value.
 * 
 * @param {number} value Value in percent where to move active animation.
 * 
 */			
Viewer3D.AppModel.prototype.setTime = function (value) {		
	
	var activeAnimationParams = this.getParamsOfActiveAnimation();

	//set specific position in all animations
	for(var i in this._loader.meshes) {
		if (this._loader.meshes[i].animation) {				
			this._loader.meshes[i].animation.time = (value / 100) * activeAnimationParams.duration;			
			this._loader.meshes[i].animation.updateState();
			this._loader.meshes[i].animation.updateAnimation();
		}
	}		
				
	//get and update some values for animation slider
	this.notifyAnimationUpdate({percent: activeAnimationParams.percent, time: activeAnimationParams.time, duration: activeAnimationParams.duration});	
	
}





/**
 * Resets look.
 * 
 */			
Viewer3D.AppModel.prototype.resetLook = function () {	

	this._orbitControls.target = new THREE.Vector3(0, 0, 0);          
	this._cameraFree.position.set(Viewer3D.DEFAULT_CAMERA_X, Viewer3D.DEFAULT_CAMERA_Y, Viewer3D.DEFAULT_CAMERA_Z);
	this._cameraFree.rotation.set(0, 0, 0);       
	this._orbitControls.update(); 
	
}





/**
 * Rotates look.
 * 
 * @param {number} direction Direction of rotation: 0 - right, 1 - up, 2 - left, 3 - down.
 * 
 */			
Viewer3D.AppModel.prototype.rotateLook = function (direction) {	
	
	switch (direction) {
		
		//rotation right
		case 0: {
  	      	this._cameraFree.translateX(-Viewer3D.ROTATE_SPEED);
		  	break;
		}
		
		//rotation up
		case 1: {
			var lastCameraZ = this._cameraFree.position.z;	
			this._cameraFree.translateY(-Viewer3D.ROTATE_SPEED);
			
			//limit control for z position of camera
			if((lastCameraZ > 0) && (this._cameraFree.position.z < 0)) {
				this._cameraFree.translateY(Viewer3D.ROTATE_SPEED);				
			} else if((lastCameraZ < 0) && (this._cameraFree.position.z > 0)) {
				this._cameraFree.translateY(Viewer3D.ROTATE_SPEED);				
			}	
			
		  	break;
		}
		
		//rotation left
		case 2: {
	       	this._cameraFree.translateX(Viewer3D.ROTATE_SPEED);
		 	break;
		}
		
		//rotation down
		case 3: {
			var lastCameraZ = this._cameraFree.position.z;						
			this._cameraFree.translateY(Viewer3D.ROTATE_SPEED);
			
			//limit control for z position of camera
			if((lastCameraZ > 0) && (this._cameraFree.position.z < 0)) {
				this._cameraFree.translateY(-Viewer3D.ROTATE_SPEED);				
			} else if((lastCameraZ < 0) && (this._cameraFree.position.z > 0)) {
				this._cameraFree.translateY(-Viewer3D.ROTATE_SPEED);				
			}					
			
		  	break;
		}
	
	}
	
	this._orbitControls.update();  	
	
}





/**
 * Translates look.
 * 
 * @param {number} direction Direction of translation: 0 - right, 1 - up, 2 - left, 3 - down.
 * 
 */			
Viewer3D.AppModel.prototype.translateLook = function (direction) {	
	
	switch (direction) {
		
		//translation right
		case 0: {
			this._orbitControls.target.x += Viewer3D.PAN_SPEED;         
            this._cameraFree.position.x += Viewer3D.PAN_SPEED;              
			this._orbitControls.update();
		  	break;
		}
		
		//translation up
		case 1: {
            this._orbitControls.target.y += Viewer3D.PAN_SPEED;         
            this._cameraFree.position.y += Viewer3D.PAN_SPEED;  
			this._orbitControls.update(); 
		  	break;
		}
		
		//translation left
		case 2: {
            this._orbitControls.target.x -= Viewer3D.PAN_SPEED;     
            this._cameraFree.position.x -= Viewer3D.PAN_SPEED;  
			this._orbitControls.update(); 
		 	break;
		}
		
		//translation down
		case 3: {
            this._orbitControls.target.y -= Viewer3D.PAN_SPEED;         
            this._cameraFree.position.y -= Viewer3D.PAN_SPEED;  
			this._orbitControls.update(); 
		  	break;
		}
	
	}
	
	this._orbitControls.update();  	
	
}





/**
 * Zooms look.
 * 
 * @param {number} direction Direction of zoom: 0 - in, 1 - out.
 * 
 */			
Viewer3D.AppModel.prototype.zoomLook = function (direction) {	
	
	switch (direction) {
		
		//zoom in
		case 0: {
			this._cameraFree.translateZ(-Viewer3D.ZOOM_SPEED);
		  	break;
		}
		
		//zoom out
		case 1: {
			this._cameraFree.translateZ(Viewer3D.ZOOM_SPEED);
		  	break;
		}
	
	}
	
	this._orbitControls.update();  	
	
}





/**
 * Gets all available animations.
 * 
 * @return {array} List of names of available animations.
 * 
 */			
Viewer3D.AppModel.prototype.getAvailableAnimations = function () {	
		
	var availableAnimations = [];
	
	//makes list of available animations
	availableAnimations.push(this.guiControls.animationsList[0]); //animation off label
	
	for(var i = 1; i < this.guiControls.animationsList.length; i++) {	
		for(var j in this._loader.meshes) {
			
			if (this._loader.meshes[j].animation) {
				if(typeof this._loader.meshes[j].animation.animationSet.getAnimationByName(this.guiControls.animationsList[i]) !== 'undefined') {
					availableAnimations.push(this.guiControls.animationsList[i]);
					continue;
				}
			}
			
		}		
	}		
	
	if(availableAnimations.length == 1) {
		this.guiControls.animationsList[0] = 'není k dispozici';
		availableAnimations[0] = this.guiControls.animationsList[0];
	}
	
	return availableAnimations;
}





/**
 * Gets all available looks.
 * 
 * @return {array} List of names of available looks.
 * 
 */			
Viewer3D.AppModel.prototype.getAvailableLooks = function () {	
	
	var availableLooks = [];
	
	//makes list of available looks
	availableLooks.push(this.guiControls.looksList[0]); //free look label
	
	for(var i = 1; i < this.guiControls.looksList.length; i++) {	
		
		var object = this._loader.getCamera(this.guiControls.looksList[i]);
		if(typeof object !== 'undefined') {
			availableLooks.push(this.guiControls.looksList[i]);
		}
		
	}			
	
	return availableLooks;	
	
}





/**
 * Gets all available objects for manipulation.
 * 
 * @return {array} List of available objects.
 * 
 */			
Viewer3D.AppModel.prototype.getAvailableObjects = function () {	
		
	var availableObjects = [];
	
	//chooses specific objects according to list of objects
	for(i in this.guiControls.objectsList) {	
		
		var object = this._loader.getMesh(this.guiControls.objectsList[i]);
		if(typeof object !== 'undefined') {
			availableObjects.push(object);
		}
		
	}		
	
	return availableObjects;
}










//******************
//HANDLING OBSERVERS
//******************


/**
 * Adds observer of this model.
 * 
 * @param {object} observer Concrete observer.
 * 
 */		
Viewer3D.AppModel.prototype.addObserver = function (observer) {			
	this._observers.push(observer);			
}
	
	
/**
 * Notify all observers that initialization of the app model is complete.
 * 
 */			
Viewer3D.AppModel.prototype.notifyInitModelComplete = function () {			
	for(var i in this._observers) { 
		this._observers[i].initModelComplete(); 
	} 				
}
	
	
/**
 * Notify all observers that animation state was updated.
 * 
 * @param {object} data Current parameters of animation (data.percent, data.time, data.duration)
 * 
 */	
Viewer3D.AppModel.prototype.notifyAnimationUpdate = function (data) {			
	for(var i in this._observers) { 
		this._observers[i].animationUpdate(data); 
	} 				
}
	
	
/**
 * Notify all observers that started loading of the 3D source.
 * 
 */		
Viewer3D.AppModel.prototype.notifySourceLoadingStart = function () {			
	for(var i in this._observers) { 
		this._observers[i].sourceLoadingStart(); 
	} 				
}
	
	
/**
 * Notify all observers that loading of the 3D source is complete.
 * 
 */		
Viewer3D.AppModel.prototype.notifySourceLoadingComplete = function () {			
	for(var i in this._observers) { 
		this._observers[i].sourceLoadingComplete(); 
	} 				
}





//==============================
//end of Viewer3D.AppModel class
//==============================