Interactive 3D Viewer
==

**Interactive viewer of 3D objects and animations** for web environment based on WebGL technology.

**Live example** of the 3D Viewer: http://is.muni.cz/th/325233/fi_m/web/pages/3d-prohlizec.html

The viewer enables use of multiple instances on the same page and can load 3D models in open-source file format SEA3D, which is optimized for web environment. User of the viewer can interactively manipulate with 3D model through the mouse controls or graphic user interface. There is also available menu with options to choose specified 3D animation or camera view and also options for hidding parts of 3D model. If 3D animation is choosen there will be shown panel of animation player. The viewer is based on WebGL technology which is not available on all browsers and devices. In this case user gets information about it and can display alternative content if it is set.

The web application of 3D viewer is under GNU General Public License, is based on **HTML5**, **CSS3** and **WebGL** technology and uses JavaScript libraries **Three.js**, **OrbitControls.js**, **SEA3D.js**, **jQuery.js**, **jQueryUI.js**, **Dat.gui.js** and **Stats.js**.




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


