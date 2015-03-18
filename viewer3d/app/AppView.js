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
AppView.js

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



//======================
//Viewer3D.AppView class
//======================


/** @namespace */
var Viewer3D = Viewer3D || {};





/**
* Viewer3D.AppView 
* @class Environment of the viewer - updates GUI and handles user events.
* 
* @param {string} idArg The name of the id where to put viewer in the DOM.
*  
*/
Viewer3D.AppView = function (id) {
	
	
	//who is observing to the view?
	this._observers = new Array();
		
	this._id = id;
	
	$('body').attr('id', 'present3d'); //sets specific id because of association with CSS styles
	


	//INIT FUNDAMENTALS...

	//tool for compression of HTML code -- http://www.textfixer.com/html/compress-html-compression.php
	this._$appTemplate = '<ul class="tabs"><li><a href="#' + this._id + '-vizualizace">Interaktivní 3D vizualizace</a></li><li><a href="#' + this._id + '-alternativni-obsah">Alternativní obsah</a></li></ul><div id="' + this._id + '-vizualizace">'
	
	
						//WEBGL NOT SUPPORTED MESSAGES
						+ '<div class="webgl-not-supported"><div class="webgl-error-message1"><p class="message"><strong>K&nbsp;zobrazení tohoto 3D obsahu je potřeba technologie <a target="_blank" class="ext_blank" title="Přejít na informace o WebGL (v angličtině)" href="http://www.khronos.org/webgl/">WebGL</a></strong>, která Vaším aktuálním internetovým prohlížečem buď pravděpodobně není podporována nebo v&nbsp;prohlížeči není aktivována, případně není podporována Vaší grafickou kartou.</p><p class="topmargin">Nyní máte následující možnosti, jak dále postupovat:</p>'
						+ '<ol><li><h4>Změnit internetový prohlížeč <a href="#message01option01" class="more-information" title="Zobrazit více informací">více</a></h4><div class="message01option01"><p>Pokud používáte internetový prohlížeč, který technologii WebGL nepodporuje (např.&nbsp;Internet Explorer verze 10 a&nbsp;nižší), doporučujeme nainstalovat a&nbsp;použít jeden z prohlížečů <strong><a title="Přejít na oficiální stránku prohlížeče" target="_blank" class="ext_blank" href="http://www.google.com/intl/cs/chrome/">Google Chrome</a></strong>, <strong><a title="Přejít na oficiální stránku prohlížeče" target="_blank" class="ext_blank" href="http://www.mozilla.org/cs/firefox/new/">Mozilla Firefox</a></strong> nebo <strong><a title="Přejít na oficiální stránku prohlížeče" target="_blank" class="ext_blank" href="http://windows.microsoft.com/en-us/internet-explorer/download-ie">Internet Explorer verze 11 a&nbsp;vyšší</a></strong>.</p></div></li>'
						+ '<li><h4>Pokusit se WebGL aktivovat <a href="#message01option02" class="more-information" title="Zobrazit více informací">více</a></h4><div class="message01option02"><p>Pokud již používáte jeden z&nbsp;prohlížečů <strong><a title="Přejít na oficiální stránku prohlížeče" target="_blank" class="ext_blank" href="http://www.google.com/intl/cs/chrome/">Google Chrome</a></strong> nebo <strong><a title="Přejít na oficiální stránku prohlížeče" target="_blank" class="ext_blank" href="http://www.mozilla.org/cs/firefox/new/">Mozilla Firefox</a></strong>, můžete se pokusit WebGL ve&nbsp;Vašem prohlížeči aktivovat podle jednoho z&nbsp;těchto postupů:</p><p><strong>Chrome</strong> &ndash; Do&nbsp;řádku pro&nbsp;zadání internetové adresy zadejte <em>chrome://flags</em> a&nbsp;stiskněte klávesu Enter. Povolte pomocí příslušného nastavení WebGL. Restartujte prohlížeč.</p><p><strong>Firefox</strong> &ndash; Do&nbsp;řádku pro&nbsp;zadání internetové adresy zadejte <em>about:config</em> a&nbsp;stiskněte klávesu Enter. Do&nbsp;vyhledávacího řádku napište <em>webgl.force-enabled</em>. Povolte pomocí příslušného nastavení WebGL. </p></div></li>'
						+ '<li><h4>Přejít na alternativní obsah <a href="#message01option03" class="more-information" title="Zobrazit více informací">více</a></h4><div class="message01option03"><p>Jestliže se Vám nepodařilo 3D obsah zobrazit podle bodu 1. ani 2., WebGL pravděpodobně není podporováno Vaší grafickou kartou (<a title="Přejít na informace o podporovaných konfiguracích zařízení" target="_blank" class="ext_blank" href="http://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists">seznam nepodporovaných GPU</a>). Pokud je tedy k&nbsp;dispozici <em>alternativní obsah</em>, můžete na&nbsp;něj přejít přes&nbsp;záložku <strong>Alternativní obsah</strong>.</p></div></li></ol></div><!-- konec message1 -->'						
						
						+ '<div class="webgl-error-message2"><p class="message"><strong>K&nbsp;zobrazení tohoto 3D obsahu je potřeba technologie <a target="_blank" class="ext_blank" title="Přejít na informace o podporovaných konfiguracích zařízení" href="http://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists">WebGL</a></strong>, která Vaším aktuálním internetovým prohlížečem pravděpodobně není podporována.</p><p class="topmargin">Nyní máte následující možnosti, jak dále postupovat:</p>' 
						+ '<ol><li><h4>Změnit internetový prohlížeč<a href="#message02option01" class="more-information" title="Zobrazit více informací">více</a></h4><div class="message02option01"><p>Pokud používáte internetový prohlížeč, který technologii WebGL nepodporuje (např.&nbsp;Internet Explorer verze 10 a&nbsp;nižší), doporučujeme nainstalovat a&nbsp;použít jeden z prohlížečů <strong><a title="Přejít na oficiální stránku prohlížeče" target="_blank" class="ext_blank" href="http://www.google.com/intl/cs/chrome/">Google Chrome</a></strong>, <strong><a title="Přejít na oficiální stránku prohlížeče" target="_blank" class="ext_blank" href="http://www.mozilla.org/cs/firefox/new/">Mozilla Firefox</a></strong> nebo <strong><a title="Přejít na oficiální stránku prohlížeče" target="_blank" class="ext_blank" href="http://windows.microsoft.com/en-us/internet-explorer/download-ie">Internet Explorer verze 11 a&nbsp;vyšší</a></strong>.</p></div></li>' 
						+ '<li><h4>Přejít na alternativní obsah <a href="#message02option02" class="more-information" title="Zobrazit více informací">více</a></h4><div class="message02option02"><p>Jestliže se Vám nepodařilo 3D obsah zobrazit podle bodu 1., WebGL pravděpodobně není podporováno Vaší grafickou kartou (<a title="Přejít na informace o podporovaných konfiguracích zařízení" target="_blank" class="ext_blank" href="http://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists">seznam nepodporovaných GPU</a>). Pokud je tedy k&nbsp;dispozici <em>alternativní obsah</em>, můžete na&nbsp;něj přejít přes&nbsp;záložku <strong>Alternativní obsah</strong>.</p></div></li></ol></div><!-- konec message2 --></div><!-- konec webgl-not-supported -->'				
						
						
						//PANEL MENU
	 					+ '<div class="place-for-3d"><div class="panel-menu"><button title="Zobrazit informace o aplikaci" class="info-button"></button><button title="Zobrazit nápovědu" class="help-button"></button><button title="Zobrazit přes celé okno" class="fullscreen-button"></button><div class="stats-utility"></div></div><!-- konec panel-menu -->'
	 					
	 					
	 					//PANEL ANIMATION
	 					+ '<div class="panel-animation"><button class="playpause-button" title="Spustit animaci"></button><button class="stop-button" title="Zpět na začátek animace"></button><div class="animation"><div class="animation-slider"></div><!-- konec slider --><div class="animation-speed">Rychlost <button title="Velmi pomalá rychlost">0.25x</button> <button title="Pomalá rychlost">0.5x</button> <button class="selected" title="Normální rychlost">1x</button></div><div class="animation-time">mm:ss / mm:ss</div></div></div><!-- konec panel-animation -->'
	 					
	 					
	 					//PANEL CONTROLS
	 					+ '<div class="panel-controls"><div class="controls"><div class="reset"><button class="reset-button" title="Resetovat pohled"></button><div class="controls-desc">Reset pohledu</div></div><div class="rotation"><button class="rotation-right-button" title="Rotovat doprava"></button><button class="rotation-up-button" title="Rotovat nahoru"></button><button class="rotation-left-button" title="Rotovat doleva"></button><button class="rotation-down-button" title="Rotovat dolů"></button><div class="controls-desc">Rotace</div></div><div class="translation"><button class="translation-right-button" title="Posun doprava"></button><button class="translation-up-button" title="Posun nahoru"></button><button class="translation-left-button" title="Posun doleva"></button><button class="translation-down-button" title="Posun dolů"></button><div class="controls-desc">Posun</div></div><div class="zoom"><button class="plus-button" title="Přiblížit"></button><button class="minus-button" title="Oddálit"></button><div class="zoom-slider"></div><!-- konec slider --><div class="controls-desc">Zoom</div></div></div><!-- konec controls --><button class="controls-button active" title="Skrýt pomocné ovládání">Skrýt ovládání</button></div><!-- panel-controls -->'
	 					
	 					
	 					//3D CONTAINER
	 					+ '<div class="container-3d"><div class="loading"><div class="loading-stripes"><div class="loading-image" title="Načítá se..."></div></div></div></div>'
	 					
	 					
	 					//INFO
	 					+ '<div class="info"><div class="info-text"><button class="close-info-button" title="Zavřít informace"></button><div class="info-icon"><h3>3D prohlížeč</h3><p>Aplikace 3D prohlížeče podléhá licenci <strong><a title="Informace k licenci | Odkaz do nového okna" href="http://www.gnu.org/copyleft/gpl.html" target="_blank">GNU General Public License</a></strong>,<br />je založena na&nbsp;<a href="http://cs.wikipedia.org/wiki/HTML5" title="HTML5 na Wikipedii | Odkaz do nového okna" target="_blank">HTML5</a>, <a href="http://cs.wikipedia.org/wiki/Kask%C3%A1dov%C3%A9_styly" title="CSS3 na Wikipedii | Odkaz do nového okna" target="_blank">CSS3</a> a&nbsp;technologii <a href="http://cs.wikipedia.org/wiki/WebGL" title="WebGL na Wikipedii | Odkaz do nového okna" target="_blank">WebGL</a> a&nbsp;ke&nbsp;své funkci využívá knihoven<br /><a href="https://github.com/mrdoob/three.js/" title="Three.js | Odkaz do nového okna" target="_blank">Three.js</a>, <a href="https://github.com/mrdoob/three.js/blob/master/examples/js/controls/" title="OrbitControls.js | Odkaz do nového okna" target="_blank">OrbitControls.js</a>, <a href="https://github.com/sunag/sea3d/" title="SEA3D.js | Odkaz do nového okna" target="_blank">SEA3D.js</a>, <a href="http://code.jquery.com/jquery/" title="jQuery.js | Odkaz do nového okna" target="_blank">jQuery.js</a>, <a href="http://code.jquery.com/ui/" title="jQueryUI.js | Odkaz do nového okna" target="_blank">jQueryUI.js</a>, <a href="http://code.google.com/p/dat-gui/" title="Dat.gui.js | Odkaz do nového okna" target="_blank">Dat.gui.js</a> a&nbsp;<a href="https://github.com/mrdoob/stats.js/" title="Stats.js | Odkaz do nového okna" target="_blank">Stats.js</a>.</p></div><div class="warning-icon"><h3>3D modely a animace</h3><p><span class="highlighted-text">Zobrazované 3D modely a&nbsp;animace vytvořilo <a href="http://is.muni.cz/stech/" title="Stránky Servisního střediska na Elportále | Odkaz do nového okna" target="_blank">Servisní středisko pro&nbsp;e-learning na&nbsp;MU</a><br />a&nbsp;je tedy jejími autory. Tyto 3D modely a&nbsp;animace podléhají licenci<br /><strong><a title"Informace k licenci | Odkaz do nového okna" href="http://creativecommons.org/licenses/by-nc-nd/3.0/cz/" target="_blank">Creative Commons Uveďte autora-Neužívejte dílo komerčně-Nezasahujte do díla 3.0 Česko</a></strong></p></div></div></div>'
	 					
	 					//HELP
	 					+ '<div class="help"><div class="help-text"><button class="close-help-button" title="Zavřít nápovědu"></button><div class="help-image" title="Nápověda k ovládání"></div></div></div></div><!-- konec place for 3D --></div><!-- konec 3D vizualizace -->';




	
	//CACHE CONTAINERS
	this._$viewerEl = $('#' + this._id);	
	this._$alternativeContentEl = $('<div id="' + this._id + '-alternativni-obsah"></div>');	
	this._$alternativeContentEl.html(this._$viewerEl.html()); //takes alternative content for further processing	
	this._$viewerEl.html(this._$appTemplate); //adds the template of the viewer to particular place on the page
	
	this._$viewerTabsEl = this._$viewerEl.find('ul.tabs');	
	this._$viewerTabEl = $('#' + this._id + '-vizualizace');
	this._$messageWebGLNotSupportedEl = this._$viewerEl.find('div.webgl-not-supported');
	this._$placeFor3DEl = this._$viewerEl.find('div.place-for-3d');
	this._$container3DEl = this._$viewerEl.find('div.container-3d');	
 	this._$statsEl = this._$viewerEl.find('div.stats-utility');	
 	this._$fpsInfoEl = this._$viewerEl.find('div.fps-info');	

	this._$panelMenuEl = this._$viewerEl.find('div.panel-menu');
	this._$panelAnimationEl = this._$viewerEl.find('div.panel-animation');
	this._$panelControlsEl = this._$viewerEl.find('div.panel-controls');
	this._$loadingEl = this._$viewerEl.find('div.loading');
	this._$infoEl = this._$viewerEl.find('div.info');
	this._$helpEl = this._$viewerEl.find('div.help');
 	this._$controlsEl = this._$viewerEl.find('div.controls');
	this._$animationSliderEl = this._$viewerEl.find('.animation-slider').slider({min: 0, range: 'min'});
 	this._$animationSpeedEl = this._$viewerEl.find('div.animation-speed');
 	this._$animationTimeEl = this._$viewerEl.find('div.animation-time');
	
	//CACHE BUTTONS
 	this._$infoBtnEl = this._$viewerEl.find('button.info-button');
 	this._$closeInfoBtnEl = this._$viewerEl.find('button.close-info-button');
 	this._$helpBtnEl = this._$viewerEl.find('button.help-button');
 	this._$closeHelpBtnEl = this._$viewerEl.find('button.close-help-button');
 	this._$fullscreenBtnEl = this._$viewerEl.find('button.fullscreen-button');
 	this._$controlsBtnEl = this._$viewerEl.find('button.controls-button');	
 	this._$resetBtnEl = this._$viewerEl.find('button.reset-button');
 	this._$rotationRightBtnEl = this._$viewerEl.find('button.rotation-right-button');	
 	this._$rotationUpBtnEl = this._$viewerEl.find('button.rotation-up-button');
 	this._$rotationLeftBtnEl = this._$viewerEl.find('button.rotation-left-button');
 	this._$rotationDownBtnEl = this._$viewerEl.find('button.rotation-down-button');
 	this._$translationRightBtnEl = this._$viewerEl.find('button.translation-right-button');
 	this._$translationUpBtnEl = this._$viewerEl.find('button.translation-up-button');
 	this._$translationLeftBtnEl = this._$viewerEl.find('button.translation-left-button');
 	this._$translationDownBtnEl = this._$viewerEl.find('button.translation-down-button');
 	this._$plusBtnEl = this._$viewerEl.find('button.plus-button');
 	this._$minusBtnEl = this._$viewerEl.find('button.minus-button');
 	this._$playPauseBtnEl = this._$viewerEl.find('button.playpause-button');
 	this._$stopBtnEl = this._$viewerEl.find('button.stop-button');
 	

 	
	//INIT MORE INFORMATION TOGGLERS (message about WebGL support)
	var $moreInformationLinks = this._$messageWebGLNotSupportedEl.find('a.more-information');
	var self = this;
	$moreInformationLinks.each(function () {
		
		//bind the click event handler
		$(this).on('click', function (e) {
			
			//show more information paragraph
			var hrefAttr = $(this).attr('href').replace('#', '');
			self._$viewerEl.find('div.' + hrefAttr).fadeIn('slow');			
			
			//hide more information link
			$(this).fadeOut('fast');
			
			//prevent the anchor's default click action
			e.preventDefault();
			
		});
		
	});



	//HANDLE ALTERNATIVE CONTENT AND INIT TABS
	//if alternative content doesn't exist than remove tabs, otherwise init tabs
	if(!$.trim(this._$alternativeContentEl.html())) {
		
		this._$viewerTabsEl.remove();
		
	} else {
				
		//takes alternative content and wrap it by some styled containers
		var $alternativeContentClass = $('<div class="alternative-content"></div>');
		var $contentClass = $('<div class="content"></div>').appendTo($alternativeContentClass);	
		(this._$alternativeContentEl.contents()).appendTo($contentClass);
		$alternativeContentClass.appendTo(this._$alternativeContentEl);	
		this._$alternativeContentEl.appendTo(this._$viewerEl);			
		
		//init tabs			
		this._$viewerEl.tabs({ 
			fx: { opacity: 'toggle' },
			
			//solution for vertical scrolling problem - http://stackoverflow.com/questions/243794/jquery-ui-tabs-causing-screen-to-jump/1635723#1635723
			select: function(event, ui) {
				$(this).css('height', $(this).height());
				$(this).css('overflow', 'hidden');
			},
			show: function(event, ui) {
				$(this).css('height', 'auto');
				$(this).css('overflow', 'visible');
			}
		});
		
			
	}
	
	
    	
} // ends Viewer3D.AppView





/**
 * Initializates the view.
 * 
 */		
Viewer3D.AppView.prototype.init = function () {		
	
	//keep a reference to ourselves
	var self = this;
	

	//prevent mousescrolling on the viewer
	this._$placeFor3DEl.bind('mousewheel DOMMouseScroll', function(e) { e.preventDefault(); });



	
	//INFO	
	this._$infoBtnEl.on('click', function (e) { self.toggleInfo(); });	
	
	this._$infoEl.on('click', function (e) { if(e.target == this) self.toggleInfo(); });
	
	this._$closeInfoBtnEl.on('click', function (e) { self.toggleInfo(); });	



	
	//HELP	
	this._$helpBtnEl.on('click', function (e) { self.toggleHelp(); });	
	
	this._$helpEl.on('click', function (e) { if(e.target == this) self.toggleHelp(); });
	
	this._$closeHelpBtnEl.on('click', function (e) { self.toggleHelp(); });	
		
	
	
	
	
	//FULLSCREEN
	this._$fullscreenBtnEl.on('click', function (e) { self.toggleFullscreen(); });	
		
	$(window).resize(function() { if(self._$placeFor3DEl.hasClass('fullscreen')) self.notifyWindowSizeChange({width: self._$container3DEl.width(), height: self._$container3DEl.height()}); });
	
	
	
	
	
	//CONTROLS	
	//show/hide controls
	this._$controlsBtnEl.on('click', function (e) {	self.toggleControls(); });	
		
	//reset look
	this._$resetBtnEl.on('click', function (e) { self.notifyResetLook(); });
	
	//roration right
	this._$rotationRightBtnEl.on('click', function (e) { self.notifyRotationRight(); });
	
	//roration up
	this._$rotationUpBtnEl.on('click', function (e) { self.notifyRotationUp(); });
	
	//roration left
	this._$rotationLeftBtnEl.on('click', function (e) { self.notifyRotationLeft(); });
	
	//roration down
	this._$rotationDownBtnEl.on('click', function (e) { self.notifyRotationDown(); });
	
	//translation right
	this._$translationRightBtnEl.on('click', function (e) { self.notifyTranslationRight(); });
	
	//translation up
	this._$translationUpBtnEl.on('click', function (e) { self.notifyTranslationUp(); });
	
	//translation left
	this._$translationLeftBtnEl.on('click', function (e) { self.notifyTranslationLeft(); });
	
	//translation down
	this._$translationDownBtnEl.on('click', function (e) { self.notifyTranslationDown(); });		
	
	//zoom in
	this._$plusBtnEl.on('click', function (e) { self.notifyZoomIn(); });		
	
	//zoom out
	this._$minusBtnEl.on('click', function (e) { self.notifyZoomOut(); });





	//ANIMATION
	//animation slider
	this._$animationSliderEl.bind('slide', function (e, ui) { self.notifyAnimationSlide({percent: ui.value}); });
	
	this._$animationSliderEl.bind('slidestart', function (e, ui) { self.notifyAnimationSlideStart(); });
	
	this._$animationSliderEl.bind('slidestop', function (e, ui) { self.notifyAnimationSlideStop(); });
	
	//play/pause animation
	this._$playPauseBtnEl.on('click', function (e) { self.togglePlayingAnimation(); });	
	
	//stop animation
	this._$stopBtnEl.on('click', function (e) { self.stopPlayingAnimation(); });	
	
	//speed of animation
	this._$animationSpeedEl.each(function () {			
		
		var btns = $(this).find('button');		
		var selected =  $(btns[2]);
		selected.addClass('selected');
				
		//bind the click event handler
		$(this).on('click', 'button', function (e) { 
		
			selected.removeClass('selected');		
			selected = $(this);				
			$(this).addClass('selected');
			self.notifySpeedChange({value: parseFloat($(this).text().replace(',','.').replace(' ',''))}); 
			
		});			
		
	});
	
	
	
	
	
	//STATS
	this._$fpsInfoEl.on('click', function (e) { self.notifyFpsMedianReset(); });	
	

	
	
	//we need update AppView by AppController
    this.notifyInitViewComplete({container3D: this._$container3DEl[0], containerStats: this._$statsEl[0]});	
	
		
}





/**
 * Shows message about WebGL support.
 * 
 * @param {number} typeOfMessage Which type of message has to be shown (webGL is not supported because of: 1 - browser or GPU, 2 - only browser).
 * 
 */		
Viewer3D.AppView.prototype.showMessageWebGLNotSupported = function (typeOfMessage) {		

	this._$messageWebGLNotSupportedEl.show();
	this._$placeFor3DEl.hide();
	 		
	switch (typeOfMessage) {
		case 1:
			this._$messageWebGLNotSupportedEl.find('.webgl-error-message1').show();
		  	break;
		  
		case 2:
			this._$messageWebGLNotSupportedEl.find('.webgl-error-message2').show();
		  	break;
	}

}





/**
 * Sets size of the viewer.
 * 
 * @param {number} width Width of the canvas for 3D.
 * @param {number} height Height of the canvas for 3D (viewer total height is height argument + tabs height).
 * 
 */		
Viewer3D.AppView.prototype.setSize = function (width, height) {		
	
	this._$viewerEl.css('width', width + parseInt(this._$placeFor3DEl.css('borderLeftWidth'), 10) + parseInt(this._$placeFor3DEl.css('borderRightWidth'), 10));
	this._$placeFor3DEl.css({
		width: width,
		height: height	
	});	
		
}





/**
 * Creates dropdown menu.
 * 
 * @param {object} propertiesSource Source of properties.
 * @param {array} animations Animations list.
 * @param {array} looks Looks list.
 * @param {objects} objects Source of 3D objects.
 * 
 */		
Viewer3D.AppView.prototype.initMenu = function (propertiesSource, animationsList, looksList, objectsSource) {		

	var self = this;


	//create the menu and append to the DOM
	var menu = new dat.GUI({ autoPlace: false, width: 250 });
	this._$panelMenuEl.append(menu.domElement);
	menu.close();
						
	//folder with available scene parametres and options
	var folderScene = menu.addFolder('Možnosti nastavení');
	folderScene.open();
				
	
	//items of the menu folder	
	var performaceStatisticsItem = folderScene.add(propertiesSource, 'performaceStatistics').name('Statistiky výkonu'); 	
	performaceStatisticsItem.onChange(function (value) { self.toggleStats(); }); //shows performance statistics		
	
	
	//AVAILABLE ANIMATIONS
	if (animationsList.length != 0) {
		
		//animations are present thus we can create menu item
		var animationsItem = folderScene.add(propertiesSource, 'activeAnimationName', animationsList).name('Animace');			
		animationsItem.onChange(function (value) { self.notifyAnimationChange({name: value}); });			
			
	} 
			
	
	//AVAILABLE LOOKS
	if (looksList.length != 1) {
		
		//looks are present thus we can create menu item
		var looksItem = folderScene.add(propertiesSource, 'activeLookName', looksList).name('Pohled');	
		looksItem.onChange(function (value) { self.notifyLookChange({name: value}); });	
	
	}	
	
	
	//AVAILABLE OBJECTS
	if (objectsSource.length != 0) {
		
		var folder2 = menu.addFolder('Dostupné objekty');
		folder2.open();			
		
		//objects are present thus we can create menu items
		for (var i in objectsSource) {
			folder2.add(objectsSource[i], 'visible').name(objectsSource[i].name);			
		}		
		
	}	
	

}





/**
 * Shows viewer for 3D.
 * 
 */		
Viewer3D.AppView.prototype.showPlaceFor3D = function () {		
	
	this._$messageWebGLNotSupportedEl.hide();
	this._$placeFor3DEl.show();
		
}





/**
 * Shows loading screen.
 * 
 */		
Viewer3D.AppView.prototype.showLoading = function () {		

	if (!this._$loadingEl.is(':visible')) {	
		this._$panelMenuEl.hide();
		this._$panelAnimationEl.hide();
		this._$panelControlsEl.hide();
		this._$loadingEl.show();	
	}
	
}





/**
 * Hides loading screen.
 * 
 */		
Viewer3D.AppView.prototype.hideLoading = function () {	
	
	if (this._$loadingEl.is(':visible')) {		
		this._$loadingEl.hide();	
		this._$panelMenuEl.fadeIn('fast');	
		this._$panelControlsEl.fadeIn('fast');
		this._$panelAnimationEl.hide();
		this._$panelControlsEl.css('margin-top', parseInt(this._$panelControlsEl.css('margin-top')) + 50);			
	}	
		
}





/**
 * Shows controls panel.
 * 
 */		
Viewer3D.AppView.prototype.showControlsPanel = function () {	
	
	if (!this._$panelControlsEl.is(':visible')) {
		this._$panelControlsEl.fadeIn('fast');
	}	
	
}





/**
 * Hides controls panel.
 * 
 */		
Viewer3D.AppView.prototype.hideControlsPanel = function () {		
	
	if (this._$panelControlsEl.is(':visible')) {
		this._$panelControlsEl.fadeOut('fast');		
	}
	
}





/**
 * Shows animation panel.
 * 
 */		
Viewer3D.AppView.prototype.showAnimationPanel = function () {	
	
	if (!this._$panelAnimationEl.is(':visible')) {
		this._$panelAnimationEl.fadeIn('slow');
		this._$panelControlsEl.animate({'margin-top': parseInt(this._$panelControlsEl.css('margin-top')) - 50}, 300);		
	}	
	
}





/**
 * Hides animation panel.
 * 
 */		
Viewer3D.AppView.prototype.hideAnimationPanel = function () {		
	
	if (this._$panelAnimationEl.is(':visible')) {
		this._$panelAnimationEl.fadeOut('fast');
		this._$panelControlsEl.animate({'margin-top': parseInt(this._$panelControlsEl.css('margin-top')) + 50}, 300);		
	}
	
}





/**
 * Shows/Hides information about 3D viewer.
 * 
 */		
Viewer3D.AppView.prototype.toggleInfo = function () {		
	
	if (this._$infoEl.is(':visible')) {
		this._$infoEl.fadeOut('fast');		
		
		if(!this._$placeFor3DEl.hasClass('fullscreen')) $('html,body').css('overflow', 'auto');		
			
	} else {
		this._$infoEl.fadeIn('fast');
		$('html,body').css('overflow', 'hidden');	
	}
	
}





/**
 * Shows/Hides help.
 * 
 */		
Viewer3D.AppView.prototype.toggleHelp = function () {		
	
	if (this._$helpEl.is(':visible')) {
		this._$helpEl.fadeOut('fast');		
		
		if(!this._$placeFor3DEl.hasClass('fullscreen')) $('html,body').css('overflow', 'auto');		
			
	} else {
		this._$helpEl.fadeIn('fast');
		$('html,body').css('overflow', 'hidden');	
	}
	
}





/**
 * Shows/hides stats.
 * 
 */		
Viewer3D.AppView.prototype.toggleStats = function () {		
	
	if (this._$statsEl.is(':visible')) {
		this._$statsEl.fadeOut('fast');				
	} else {
		this._$statsEl.fadeIn('fast');
	}
	
}





/**
 * Fullscreen mode on/off.
 * 
 */		
Viewer3D.AppView.prototype.toggleFullscreen = function () {		
		
	if (!this._$placeFor3DEl.hasClass('fullscreen')) {
				
		this._$placeFor3DEl.removeAttr('style');
		this._$placeFor3DEl.addClass('fullscreen');
		$('body').prepend(this._$placeFor3DEl).css('overflow', 'hidden');
		$('html').css('overflow', 'hidden');
		$('html,body').scrollTop(0);
		
		this._$fullscreenBtnEl.addClass('active');
		this._$fullscreenBtnEl.attr({ title: 'Přepnout do původního zobrazení' });	
	
		this.notifyFullscreenChange({active: true, width: this._$container3DEl.width(), height: this._$container3DEl.height()});
		
	} else {
		this._$placeFor3DEl.removeClass('fullscreen');
		this._$viewerTabEl.append(this._$placeFor3DEl);
		$('html,body').css('overflow', 'auto');
		$('html,body').scrollTop(this._$viewerEl.offset().top - 50);
		
		this._$fullscreenBtnEl.removeClass('active');
		this._$fullscreenBtnEl.attr({ title: 'Zobrazit přes celé okno' });	
		
		this.notifyFullscreenChange({active: false});
		
	}		
	
}





/**
 * Shows/hides controls.
 * 
 */		
Viewer3D.AppView.prototype.toggleControls = function () {		
	
	if(this._$controlsBtnEl.hasClass('active')) {
		
		this._$controlsEl.hide();
		this._$controlsBtnEl.removeClass('active').attr('title', 'Zobrazit pomocné ovládání').text('Ovládání');
		
	} else {
		
		this._$controlsEl.show();
		
		this._$controlsBtnEl.attr({
			title: 'Skrýt pomocné ovládání'
		}).addClass('active').text('Skrýt ovládání');		
		
	}
	
}





/**
 * Toggles play/pause button.
 * 
 */		
Viewer3D.AppView.prototype.togglePlayingAnimation = function () {		
	
	if(!this._$playPauseBtnEl.hasClass('pause')) {

		this._$playPauseBtnEl.addClass('pause');
		this._$playPauseBtnEl.attr({ title: 'Zastavit animaci' });	
		
	} else {

		this._$playPauseBtnEl.removeClass('pause');
		this._$playPauseBtnEl.attr({ title: 'Spustit animaci' });	
				
	}		
		
	this.notifyPlayAnimation();
	
}





/**
 * Set play/pause button to mode for start playing.
 * 
 */		
Viewer3D.AppView.prototype.stopPlayingAnimation = function () {		
	
	if (this._$playPauseBtnEl.hasClass('pause')) {
						
		this._$playPauseBtnEl.removeClass('pause');		
		
	}		
		
	this.notifyStopAnimation();		
	
}





/**
 * Slides the slider handle of active animation to specific position
 * 
 * @param {number} percent Percent position of the slider handle.
 * 
 */		
Viewer3D.AppView.prototype.animationSlideTo = function (percent, time, duration) {		
		
		this._$animationSliderEl.slider('value', percent);
		this._$animationTimeEl.html(time + ' / ' + duration);  
		
}










//******************
//HANDLING OBSERVERS
//******************


/**
 * Adds observer of this view.
 * 
 * @param {object} observer Concrete observer.
 * 
 */		
Viewer3D.AppView.prototype.addObserver = function (observer) {		
	this._observers.push(observer);
}
	
	
/**
 * Notify all observers that initialization of the app view is complete.
 * 
 * @param {object} data Current containers of 3D and stats (data.container3D, data.containerStats)
 * 
 */	
Viewer3D.AppView.prototype.notifyInitViewComplete = function (data) {			
	for(var i in this._observers) { 
		this._observers[i].initViewComplete(data); 
	} 				
}
	
	
/**
 * Notify all observers that fullscreen mode was changed.
 * 
 * @param {object} data Current parameters of fullscreen mode (data.active, data.width, data.height)
 * 
 */	
Viewer3D.AppView.prototype.notifyFullscreenChange = function (data) {			
	for(var i in this._observers) { 
		this._observers[i].fullscreenChange(data); 
	} 				
}		

	
/**
 * Notify all observers that window size was changed.
 * 
 * @param {object} data Current parameters of window (data.width, data.height)
 * 
 */	
Viewer3D.AppView.prototype.notifyWindowSizeChange = function (data) {			
	for(var i in this._observers) { 
		this._observers[i].windowSizeChange(data); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to reset look.
 * 
 */		
Viewer3D.AppView.prototype.notifyResetLook = function () {			
	for(var i in this._observers) { 
		this._observers[i].resetLook(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to rotate right.
 * 
 */		
Viewer3D.AppView.prototype.notifyRotationRight = function () {			
	for(var i in this._observers) { 
		this._observers[i].rotationRight(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to rotate up.
 * 
 */	
Viewer3D.AppView.prototype.notifyRotationUp = function () {			
	for(var i in this._observers) { 
		this._observers[i].rotationUp(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to rotate left.
 * 
 */	
Viewer3D.AppView.prototype.notifyRotationLeft = function () {			
	for(var i in this._observers) { 
		this._observers[i].rotationLeft(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to rotate down.
 * 
 */	
Viewer3D.AppView.prototype.notifyRotationDown = function () {			
	for(var i in this._observers) { 
		this._observers[i].rotationDown(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to translate right.
 * 
 */	
Viewer3D.AppView.prototype.notifyTranslationRight = function () {			
	for(var i in this._observers) { 
		this._observers[i].translationRight(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to translate up.
 * 
 */	
Viewer3D.AppView.prototype.notifyTranslationUp = function () {			
	for(var i in this._observers) { 
		this._observers[i].translationUp(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to translate left.
 * 
 */		
Viewer3D.AppView.prototype.notifyTranslationLeft = function () {			
	for(var i in this._observers) { 
		this._observers[i].translationLeft(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to translate down.
 * 
 */	
Viewer3D.AppView.prototype.notifyTranslationDown = function () {			
	for(var i in this._observers) { 
		this._observers[i].translationDown(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to zoom in.
 * 
 */	
Viewer3D.AppView.prototype.notifyZoomIn = function () {			
	for(var i in this._observers) { 
		this._observers[i].zoomIn(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to zoom out.
 * 
 */	
Viewer3D.AppView.prototype.notifyZoomOut = function () {			
	for(var i in this._observers) { 
		this._observers[i].zoomOut(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to play animation.
 * 
 */	
Viewer3D.AppView.prototype.notifyPlayAnimation = function () {			
	for(var i in this._observers) { 
		this._observers[i].playAnimation(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to stop animation.
 * 
 */		
Viewer3D.AppView.prototype.notifyStopAnimation = function () {			
	for(var i in this._observers) { 
		this._observers[i].stopAnimation(); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to change speed of animation.
 * 
 * @param {object} data Current value of speed (data.value)
 * 
 */	
Viewer3D.AppView.prototype.notifySpeedChange = function (data) {			
	for(var i in this._observers) { 
		this._observers[i].speedChange(data); 
	} 				
}
				
				
/**
 * Notify all observers that slider of animation moved.
 * 
 * @param {object} data Current value of slider (data.percent)
 * 
 */	
Viewer3D.AppView.prototype.notifyAnimationSlide = function (data) {			
	for(var i in this._observers) { 
		this._observers[i].animationSlide(data); 
	} 				
}
	
	
/**
 * Notify all observers that we started sliding with animation slider;
 * 
 */	
Viewer3D.AppView.prototype.notifyAnimationSlideStart = function () {			
	for(var i in this._observers) { 
		this._observers[i].animationSlideStart(); 
	} 				
}
	
	
/**
 * Notify all observers that we stopped sliding with animation slider;
 * 
 */	
Viewer3D.AppView.prototype.notifyAnimationSlideStop = function () {			
	for(var i in this._observers) { 
		this._observers[i].animationSlideStop(); 
	} 				
}
		
/**
 * Notify all observers that was choosen new look.
 * 
 * @param {object} data Choosen animation name (data.name)
 * 
 */	
Viewer3D.AppView.prototype.notifyAnimationChange = function (data) {			
	for(var i in this._observers) { 
		this._observers[i].animationChange(data); 
	} 				
}
	
		
/**
 * Notify all observers that was choosen new look.
 * 
 * @param {object} data Choosen look name (data.name)
 * 
 */	
Viewer3D.AppView.prototype.notifyLookChange = function (data) {			
	for(var i in this._observers) { 
		this._observers[i].lookChange(data); 
	} 				
}
	
	
/**
 * Notify all observers that we're trying to reset stats.
 * 
 */	
Viewer3D.AppView.prototype.notifyFpsMedianReset = function () {			
	for(var i in this._observers) { 
		this._observers[i].fpsMedianReset(); 
	} 				
}



//=============================
//end of Viewer3D.AppView class
//=============================
