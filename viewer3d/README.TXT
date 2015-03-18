********************************************
DOPORUÈENÍ K MINIFIKACI A SPOJENÍ JS SOUBORÙ
********************************************

Pøed samotným použitím aplikace je vhodné minifikovat všechny zdrojové soubory aplikace a seskupit je do jednoho souboru, který následnì budete linkovat na webové stránce. Dùvodem je snížení celkové velikosti souborù aplikace a dále snížení poètu HTTP požadavkù pøi naèítání webové stránky. 

Pro minifikaci kódu mùžete použít napøíklad Google nástroj Closure Compiler ze stránek https://developers.google.com/closure/compiler/ (dostupný v online i v offline verzi).

Popis nástroje: "The Closure Compiler is a tool for making JavaScript download and run faster. It is a true compiler for JavaScript. Instead of compiling from a source language to machine code, it compiles from JavaScript to better JavaScript. It parses your JavaScript, analyzes it, removes dead code and rewrites and minimizes what's left. It also checks syntax, variable references, and types, and warns about common JavaScript pitfalls."


**********************************************************
RECOMMENDATION TO MINIFICATION AND COMBINATION OF JS FILES
**********************************************************

Before the use of the app it is better to minify all source code of the app and combine it to one and only file, which you will then link in your website code. The reason for this is reduction of file size and reduction of count of HTTP requests.

For process of minification you can use for example Google tool called Closure Compiler from https://developers.google.com/closure/compiler/ (available online and offline).

Brief description of the tool: "The Closure Compiler is a tool for making JavaScript download and run faster. It is a true compiler for JavaScript. Instead of compiling from a source language to machine code, it compiles from JavaScript to better JavaScript. It parses your JavaScript, analyzes it, removes dead code and rewrites and minimizes what's left. It also checks syntax, variable references, and types, and warns about common JavaScript pitfalls."











*****************************************
ZPROVOZNÌNÍ APLIKACE NA LOKÁLNÍM UMÍSTÌNÍ
*****************************************

Pokud aplikaci budete ladit a testovat z lokálního umístìní, pravdìpodobnì nebude funkèní naèítání 3D modelù a animací. To je dáno z dùvodu bezpeènostních omezení webových prohlížeèù (tzv. Same-origin policy - viz https://developer.mozilla.org/en-US/docs/Web/JavaScript/Same_origin_policy_for_JavaScript). Existují dvì možnosti, jak aplikaci na lokálním umístìní plnì zprovoznit: 

1. bud doèasnì zmìníte v používaném webovém prohlížeci omezení pro naèítání
lokálních souboru,

2. nebo celou složku webu umístíte na lokální server a pøes nìj bude pøístupovat
k dané stránce s ukázkou.



***************************************
TO GET THE APP WORK FROM LOCAL LOCATION
***************************************

If you are going to work with the app from local location, it is very likely that there will be problem with loading of 3D models and animation. The reason is security restrictions of web browsers (Same-origin policy - more on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Same_origin_policy_for_JavaScript). So there are two options how to get it work from local location:

1. temporarily change security restriction for loading of local file in current web browser,

2. or all folder with the app files put to some local server and access website through the server.


