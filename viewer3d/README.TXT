********************************************
DOPORU�EN� K MINIFIKACI A SPOJEN� JS SOUBOR�
********************************************

P�ed samotn�m pou�it�m aplikace je vhodn� minifikovat v�echny zdrojov� soubory aplikace a seskupit je do jednoho souboru, kter� n�sledn� budete linkovat na webov� str�nce. D�vodem je sn�en� celkov� velikosti soubor� aplikace a d�le sn�en� po�tu HTTP po�adavk� p�i na��t�n� webov� str�nky. 

Pro minifikaci k�du m��ete pou��t nap��klad Google n�stroj Closure Compiler ze str�nek https://developers.google.com/closure/compiler/ (dostupn� v online i v offline verzi).

Popis n�stroje: "The Closure Compiler is a tool for making JavaScript download and run faster. It is a true compiler for JavaScript. Instead of compiling from a source language to machine code, it compiles from JavaScript to better JavaScript. It parses your JavaScript, analyzes it, removes dead code and rewrites and minimizes what's left. It also checks syntax, variable references, and types, and warns about common JavaScript pitfalls."


**********************************************************
RECOMMENDATION TO MINIFICATION AND COMBINATION OF JS FILES
**********************************************************

Before the use of the app it is better to minify all source code of the app and combine it to one and only file, which you will then link in your website code. The reason for this is reduction of file size and reduction of count of HTTP requests.

For process of minification you can use for example Google tool called Closure Compiler from https://developers.google.com/closure/compiler/ (available online and offline).

Brief description of the tool: "The Closure Compiler is a tool for making JavaScript download and run faster. It is a true compiler for JavaScript. Instead of compiling from a source language to machine code, it compiles from JavaScript to better JavaScript. It parses your JavaScript, analyzes it, removes dead code and rewrites and minimizes what's left. It also checks syntax, variable references, and types, and warns about common JavaScript pitfalls."











*****************************************
ZPROVOZN�N� APLIKACE NA LOK�LN�M UM�ST�N�
*****************************************

Pokud aplikaci budete ladit a testovat z lok�ln�ho um�st�n�, pravd�podobn� nebude funk�n� na��t�n� 3D model� a animac�. To je d�no z d�vodu bezpe�nostn�ch omezen� webov�ch prohl�e�� (tzv. Same-origin policy - viz https://developer.mozilla.org/en-US/docs/Web/JavaScript/Same_origin_policy_for_JavaScript). Existuj� dv� mo�nosti, jak aplikaci na lok�ln�m um�st�n� pln� zprovoznit: 

1. bud do�asn� zm�n�te v pou��van�m webov�m prohl�eci omezen� pro na��t�n�
lok�ln�ch souboru,

2. nebo celou slo�ku webu um�st�te na lok�ln� server a p�es n�j bude p��stupovat
k dan� str�nce s uk�zkou.



***************************************
TO GET THE APP WORK FROM LOCAL LOCATION
***************************************

If you are going to work with the app from local location, it is very likely that there will be problem with loading of 3D models and animation. The reason is security restrictions of web browsers (Same-origin policy - more on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Same_origin_policy_for_JavaScript). So there are two options how to get it work from local location:

1. temporarily change security restriction for loading of local file in current web browser,

2. or all folder with the app files put to some local server and access website through the server.


