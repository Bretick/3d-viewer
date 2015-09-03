Interactive 3D Viewer
==

*Interactive viewer of 3D objects and animations for web environment based on WebGL technology*

**Live example** of the 3D Viewer: http://is.muni.cz/th/325233/fi_m/web/pages/3d-prohlizec.html

The viewer enables use of multiple instances on the same page and can load 3D models in open-source file format SEA3D, which is optimized for web environment. User of the viewer can interactively manipulate with 3D model through the mouse controls or graphic user interface. There is also available menu with options to choose specified 3D animation or camera view and also options for hidding parts of 3D model. If 3D animation is choosen there will be shown panel of animation player. The viewer is based on WebGL technology which is not available on all browsers and devices. In this case user gets information about it and can display alternative content if it is set.

The web application of 3D viewer is under GNU General Public License, is based on **HTML5**, **CSS3** and **WebGL** technology and uses JavaScript libraries **Three.js**, **OrbitControls.js**, **SEA3D.js**, **jQuery.js**, **jQueryUI.js**, **Dat.gui.js** and **Stats.js**.   

**Shortcut** to core JS files of the app:
* Viewer3D.App class<br /> 
https://github.com/Bretick/3d-viewer/blob/master/viewer3d/app/Viewer3D.js 
* Viewer3D.AppModel class<br /> 
https://github.com/Bretick/3d-viewer/blob/master/viewer3d/app/AppModel.js 
* Viewer3D.AppView class<br /> 
https://github.com/Bretick/3d-viewer/blob/master/viewer3d/app/AppView.js
* Viewer3D.AppController class<br />
https://github.com/Bretick/3d-viewer/blob/master/viewer3d/app/AppController.js


Basic use
--

Conditions for use of the 3D Viewer on the page:
* the page has to be written in HTML5
* there has to be included "viewer3d/css/viewer3d.css" and "viewer3d/app/viewer3d.all.min.js" 
* placement of the viewer in the page is defined by DIV element with specific ID, e.g. tooth-model (there can be also added alternative content like static images, text description, etc.)

Initialization code of the viewer can look like this:
```
new Viewer3D.App({
		id: 'tooth-model',
		width: 920,
		height: 690,
		path: '../js/viewer3d/models/tooth-model.sea',
		animations: ['rotace y', 'rotace x'],
		looks: ['detail01', 'detail02', 'detail03'],
		objects: ['zub - zdravy', 'zub - choroba', 'zubni nerv'],
		scale: 0.75
  });
```


Additional info
--
Sources of this project are part of my final thesis from Master's studies at Masaryk University, the Faculty of Informatics in Brno, Czech Republic. The topic of the thesis is **Web-based interactive visualization of 3D objects and its use in the field of e-learning** http://is.muni.cz/th/325233/fi_m/

*Abstract of the thesis*

Web technologies and tools are together with computing performance of devices in a state where it is possible to make interactive 3D visualizations accessible by web browsers to a large number of web users. Thus, interactive 3D graphics do not have to be a privilege of desktop applications only, but it can be used in the web environment either. The thesis deals with analysis of web technologies and tools for using interactive 3D graphics on the web and describes their abilities, features and aspects of use. Information gained from the analysis became the solid foundation for the choice of a suitable combination of these technologies and tools for a realization of specific application. The application, developed by the author of the thesis, is a viewer of 3D models and animations, which are created by Servisni stredisko pro e-learning na MU. The thesis describes the design of the web application and solution of main implementation problems and presents basic information necessary for preparation and use of 3D models and animations. The thesis focuses especially on the use in the field of e-learning and therefore the author as well analyses and introduces specific examples of the use of interactive 3D graphics in the mentioned field.


