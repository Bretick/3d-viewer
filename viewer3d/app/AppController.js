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
AppController.js

Project: 
Viewer for 3D models with animations

Author: 
Bretislav Mazoch, b.mazoch@email.cz

Created On: 
01/2014

Last Change On: 
05/2014
==========================================
*/



//============================
//Viewer3D.AppController class
//============================


/** @namespace */
var Viewer3D = Viewer3D || {};





/**
* Viewer3D.AppController 
* @class Controller which is interlink beetween the view and the model, manages user-input and application logic.
* 
* @param {object} model The model of the viewer.
* @param {object} view The view of the viewer.
*  
*/
Viewer3D.AppController = function (model, view) {
	
	this._appModel = model;
	this._appView = view;		
	
	this.init();
   
    	
} // ends Viewer3D.AppController




/**
 * Initializates the controller.
 * 
 */		
Viewer3D.AppController.prototype.init = function () {		
		
	//sets size of the viewer
	var size = this._appModel.getSize(false);
	this._appView.setSize(size.width, size.height);	
	

	//help function for WebGL detection
	var webGLSupported = function () {			
	
		//detection code from https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js
		try { var canvas = document.createElement('canvas'); return !! window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext( 'experimental-webgl')); } catch(e) { return false; }
	
	}			
	

	//test for WebGL support
	if (!webGLSupported()) {
		
		//webGL is not supported so the message is shown (webGL is not supported because of: 1 - browser or GPU, 2 - only browser).
		window.WebGLRenderingContext ? this._appView.showMessageWebGLNotSupported(1) : this._appView.showMessageWebGLNotSupported(2);		
		
	} else {
		
	    //WebGL is supported so Viewer3D can be initiated		
    	this.initObservers();    	
    	this._appView.init();	
    	this._appModel.init();
    	
	}   
 	
}





/**
 * Inits listening of the view and the model and inits functions.
 * 
 */		
Viewer3D.AppController.prototype.initObservers = function () {			

	//keep a reference to ourselves
	var self = this;
		
	
		
	//help function which converts time in milliseconds to string representation
	var millisecondsToString = function (milliseconds) {
	    var oneMinute = 60000;
	    var oneSecond = 1000;
	    var seconds = 0;
	    var minutes = 0;
	    var result;
	
	
	    if (milliseconds >= oneMinute) {
	        minutes = Math.floor(milliseconds / oneMinute);
	    }
	
	    milliseconds = minutes > 0 ? (milliseconds - minutes * oneMinute) : milliseconds;
	
	    if (milliseconds >= oneSecond) {
	        seconds = Math.floor(milliseconds / oneSecond);
	    }
	
	    milliseconds = seconds > 0 ? (milliseconds - seconds * oneSecond) : milliseconds;
	
	    if (minutes > 0) {
	        result = (minutes > 9 ? minutes : "0" + minutes) + ":";
	    } else {
	        result = "00:";
	    }
	
	    if (seconds > 0) {
	        result += (seconds > 9 ? seconds : "0" + seconds);
	    } else {
	        result += "00";
	    }
	
	    return result;
	}		
	
	
	
	
	
    
	//listen to the view - create concrete observer of the view 
	var viewObserver = new Viewer3D.ViewObserver({		
		
		initViewComplete: function (data) {
			self._appModel.setContainers(data.container3D, data.containerStats);
		},
		
		
		//FULLSCREEN
		fullscreenChange: function (data) {  
			self._appModel.guiControls.fullscreen = data.active;
				  
			if (data.active) {
				//sets new values to renderer
				self._appModel.setSize(data.width, data.height);	
			} else {
				var size = self._appModel.getSize(true);
	
				//sets original viewer size
				self._appView.setSize(size.width, size.height);
				
				//sets original values to renderer
				self._appModel.setSize(size.width, size.height);
			}
		},
		
		windowSizeChange: function (data) {    		
			self._appModel.setSize(data.width, data.height);
		},
		
		
		
		//CONTROLS
		resetLook: function () {           
			self._appModel.resetLook();
		},		
		
		rotationRight: function () {
  	       	self._appModel.rotateLook(0);
		},		
		
		rotationUp: function () {
  	       	self._appModel.rotateLook(1);
		},		
		
		rotationLeft: function () {
  	       	self._appModel.rotateLook(2); 	
		},		
		
		rotationDown: function () {
  	       	self._appModel.rotateLook(3);
		},		
		
		translationRight: function () {  
  	       	self._appModel.translateLook(0); 
		},		
		
		translationUp: function () {
  	       	self._appModel.translateLook(1);
		},		
		
		translationLeft: function () {
  	       	self._appModel.translateLook(2);
		},		
		
		translationDown: function () {
  	       	self._appModel.translateLook(3);
		},
		
		zoomIn: function () {    
			self._appModel.zoomLook(0);   
		},		
		
		zoomOut: function () {
			self._appModel.zoomLook(1);   
		},		
		
		
		
		//ANIMATION
		playAnimation: function () {			
			if(!self._appModel.guiControls.animationPlaying) {
				self._appModel.playAllAnimations(self._appModel.guiControls.activeAnimationName);
			} else {
				self._appModel.pauseAllAnimations();
			}	
		},	
		
		stopAnimation: function () {	
			self._appModel.stopAllAnimations();
		},	
		
		speedChange: function (data) {	
			self._appModel.setTimeScale(data.value);
		},	
		
		animationSlide: function (data) {	
			self._appModel.setTime(data.percent);
		},	
		
		animationSlideStart: function () {
			if(self._appModel.guiControls.animationPlaying) {
				self._appModel.guiControls.animationWasPlaying = true;
				self._appModel.pauseAllAnimations();
			} else {
				self._appModel.guiControls.animationWasPlaying = false;
			}
		},	
		
		animationSlideStop: function () {	
			if(self._appModel.guiControls.animationWasPlaying) {
				self._appModel.playAllAnimations(self._appModel.guiControls.activeAnimationName);
			}
		},
		
		
		
		//MENU		
		animationChange: function (data) {						
			
			self._appModel.setActiveAnimation(data.name);			
					
			if (self._appModel.guiControls.animationsList[0] === data.name) {		
				self._appView.hideAnimationPanel();		
				self._appView.stopPlayingAnimation();					
			} else {								
				self._appView.showAnimationPanel();		
				self._appView.stopPlayingAnimation();		
				self._appView.togglePlayingAnimation();															
			}				
		},
		
		lookChange: function (data) {	
			
			if (self._appModel.guiControls.looksList[0] === data.name) {						
				self._appView.showControlsPanel();						
			} else {							
				self._appView.hideControlsPanel();																									
			}			
			
			self._appModel.setActiveCamera(data.name);
				
			var size = self._appModel.getSize(!self._appModel.guiControls.fullscreen);
			self._appModel.setSize(size.width, size.height);							
		}
	});
	this._appView.addObserver(viewObserver);
        
	    
    
    
    
	//listen to the model - create concrete observer of the model 
	var modelObserver = new Viewer3D.ModelObserver({
		
		initModelComplete: function () { 
			//...
		},
		
		animationUpdate: function (data) { 						
			self._appView.animationSlideTo(data.percent, millisecondsToString(data.time), millisecondsToString(data.duration)); 			
		},		
		
		sourceLoadingStart: function () {
			self._appView.showLoading();			
		},		
		
		sourceLoadingComplete: function () {
			self._appView.hideLoading();
			self._appView.initMenu(self._appModel.guiControls, self._appModel.getAvailableAnimations(), self._appModel.getAvailableLooks(), self._appModel.getAvailableObjects());	
		}
	
		
	});
	this._appModel.addObserver(modelObserver);
	
		
	
	
	
}





/**
 * Viewer3D.ViewObserver
 * @class Observer of the view.
 * 
 * @param {object} list List of functions, which the concrete observer has to implement if it want to respond on the view state changes.
 * 
 * @return {object} List of available methods.
 * 
 */	
Viewer3D.ViewObserver = function (list) {		

	if(!list) list = {};
	
	return $.extend({
		
		//list of predefined empty functions for easier and immediate use
		initViewComplete: function() { },
		fullscreenChange: function() { },
		windowSizeChange: function() { },
		resetLook: function() { },
		rotationRight: function() { },
		rotationUp: function() { },
		rotationLeft: function() { },
		rotationDown: function() { },
		translationRight: function() { },
		translationUp: function() { },
		translationLeft: function() { },
		translationDown: function() { },
		zoomIn: function() { },
		zoomOut: function() { },
		playAnimation: function() { },
		stopAnimation: function() { },
		speedChange: function() { },
		animationSlide: function() { },
		animationSlideStart: function() { },
		animationSlideStop: function() { },
		animationChange: function() { },
		lookChange: function() { }
		
	}, list);
			
}





/**
 * Viewer3D.ModelObserver
 * @class Observer of the model.
 * 
 * @param {object} list List of functions, which the concrete observer has to implement if it want to respond on the model state changes.
 * 
 * @return {object} List of available methods.
 * 
 */	
Viewer3D.ModelObserver = function (list) {		

	if(!list) list = {};
	
	return $.extend({
		
		//list of predefined empty functions for easier and immediate use
		initModelComplete: function() { },
		animationUpdate: function() { },
		sourceLoadingStart: function() { },
		sourceLoadingComplete: function() { }
		
	}, list); 
			
}






//===================================
//end of Viewer3D.AppController class
//===================================