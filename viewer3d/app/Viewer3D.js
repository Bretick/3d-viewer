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
Viewer3D.js

Project: 
Viewer of 3D models with animations

Author: 
Bretislav Mazoch, b.mazoch@email.cz

Created On: 
01/2014

Last Change On: 
05/2014
==========================================

Comments:
var naming convention and special constructions
_var - is private variable
$var - is jQuery object variable
var self = this; - "Getting Out of Binding Situations in JavaScript" http://alistapart.com/article/getoutbindingsituations 

*/









//==================
//Viewer3D.App class
//==================


/** @namespace */
var Viewer3D = Viewer3D || {};




/**
* Viewer3D.App 
* @class For creating Viewer3D app instances - initializes the MVC (Model-View-Controller) compontents together.
* 
* @param {object} options(id, width, height, path, scale, animations, looks, objects) Settings options for the viewer.
*  
*/
Viewer3D.App = function (options) {	

	var appModel = new Viewer3D.AppModel(options.width, options.height, options.path, options.scale, options.animations, options.looks, options.objects);
	var appView = new Viewer3D.AppView(options.id);
	new Viewer3D.AppController(appModel, appView);	
    	
} 
	
	


//=========================
//end of Viewer3D.App class
//=========================
