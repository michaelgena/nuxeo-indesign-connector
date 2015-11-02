/*
 * (C) Copyright 2006-2015 Nuxeo SA (http://nuxeo.com/) and contributors.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * Contributors:
 *     Michael Gena
 */
 
#include "../lib/json2.js"

$._ext_ILST={
    initialize : function(){
		return;	
	},

    run : function(object) {
    	var string = unescape(object);
    	var assetInfo = JSON.parse(string);
       	var myDocument = app.activeDocument;
        addImage(myDocument, assetInfo.url, assetInfo.digest, assetInfo.id);
        return;
    },
    
    refresh : function() {
    	if(app.documents.length == 0){
    		return "";
    	}
	   	var myDocument = app.activeDocument;
	   	var placedItems = myDocument.placedItems;
	   	var jsonResult = [];
	   	for (i = 0; i < placedItems.length; i++) {
	   		try {
		   		var object = {};
		   		object.url = placedItems[i].tags.getByName("url").value;
		   		object.digest = placedItems[i].tags.getByName("digest").value;
		   		object.id = placedItems[i].tags.getByName("id").value;
		   		jsonResult.push(object);
	   		} catch(err) {}
	   	} 
	   	var jsonEntries = {};
	   	jsonEntries.entries = jsonResult;
	   	jsonEntries = JSON.stringify(jsonEntries);
	    return jsonEntries;
	},
	
	upload : function(object) {
    	var string = unescape(object);
    	var assetInfo = JSON.parse(string);
       	var myDocument = app.activeDocument; 
        uploadAsset(myDocument, assetInfo.url);
        var placedItems = myDocument.placedItems;	
	   	for (i = 0; i < placedItems.length; i++) {
	   		try {
		   		if(placedItems[i].tags.getByName("id").value == assetInfo.id){
		   			placedItems[i].tags.getByName("digest").value = assetInfo.digest;	
				}
			} catch(err) {} 
	   	}
        return;
    },
    
     setToken : function(host, login, token){
    	app.preferences.setStringPreference("host", host);
    	app.preferences.setStringPreference("login", login);
    	app.preferences.setStringPreference("token", token);
    },
    
    getToken : function(){
    	var auth = {};
	   	auth.host = app.preferences.getStringPreference("host");
	   	auth.login = app.preferences.getStringPreference("login");
	   	auth.token = app.preferences.getStringPreference("token");
    	return JSON.stringify(auth);
    	
    },

};

BridgeTalk.prototype.sendSynch = function(timeout) {
	var self = this;
	self.onResult = function(res) {
	this.result = res.body;
	this.complete = true;
	}
	self.complete = false;
	self.send();

	if (timeout) {
		for (var i = 0; i < timeout; i++) {
			BridgeTalk.pump(); 
			// process any outstanding messages
			if (!self.complete) {
				$.sleep(1000);
			} else {
				break;
			}
		}
	}
	var res = self.result;
	self.result = self.complete = self.onResult = undefined;
	return res;
}

function uploadAsset(myDocument, url){	
	var fileName = url.split("/")[url.split("/").length-1];     	
   	var filePath = "/tmp/";
   	try{
        filePath = myDocument.path+"/";
    }catch(err){
         alert("Please save your document first.");
    return;
    }

   	var fullPath = filePath + fileName;
    var token = app.preferences.getStringPreference("token");
      
    var bt = new BridgeTalk();
    bt.target = "bridge";
    bt.body =  getResource.toSource()+"("+filePath.toSource()+","+url.toSource()+","+token.toSource()+")"; 
    bt.onError = function (){
        alert ('Error has occured.');
    }
    bt.sendSynch(60000);
    return fullPath;
}

function addImage(myDocument, url, digest, id){ 
	var filePath = uploadAsset(myDocument, url);	
	if(filePath != null){		
		var myPlacedItem = myDocument.placedItems.add();
        myPlacedItem.file = new File(filePath);
        myPlacedItem.left = 0;
        myPlacedItem.top = 0;	
        
        var urlTag = myPlacedItem.tags.add();
		urlTag.name = "url";
		urlTag.value = url;
		var digestTag = myPlacedItem.tags.add();
		digestTag.name = "digest";
		digestTag.value = digest;
		var idTag = myPlacedItem.tags.add();
		idTag.name = "id";
		idTag.value = id;
		//alert(myDocument.placedItems[0].tags.getByName("digest").value);
	}
}

function getResource(filePath,url,token){
    eval('var filePath = "'+filePath+'"; var url = "'+url+'"; var token = "'+token+'"; uploadAsset(filePath, url); function uploadAsset(filePath, url){ var fileName = url.split("/")[url.split("/").length-1]; var myGraphicFile = File(filePath + fileName); var imageData = GetURL(url, true, 10); if (imageData != null && imageData.body != null){ myGraphicFile.open("w"); myGraphicFile.encoding = "BINARY"; myGraphicFile.write(imageData.body); myGraphicFile.close(); } return myGraphicFile; } function GetURL(url,isBinary, kMaxRecursive301Calls) { var reply = null; const kUTF8CharState_Complete = 0; const kUTF8CharState_PendingMultiByte = 1; const kUTF8CharState_Binary = 2; const kLineState_InProgress = 0; const kLineState_SeenCR = 1; const kProtocolState_Status = 1; const kProtocolState_Headers = 2; const kProtocolState_Body = 3; const kProtocolState_Complete = 4; const kProtocolState_TimeOut = 5; do { var parsedURL = ParseURL(url); if (parsedURL.protocol != "HTTP") { break; } var socket = new Socket; socket.timeout = 120; if (! socket.open(parsedURL.address + ":" + parsedURL.port,"BINARY")) { break; } if (isBinary) { var request = "GET /" + parsedURL.path + " HTTP/1.0\n" + "Host: " + parsedURL.address + "\n" + "User-Agent: InDesign ExtendScript\n" + "Accept: */*\n" + "X-Authentication-Token: "+token+"\n" + "Connection: keep-alive\n\n"; } else { var request = "GET /" + parsedURL.path + " HTTP/1.0\n" + "Host: " + parsedURL.address + "\n" + "User-Agent: InDesign ExtendScript\n" + "Accept: text/xml,text/*,*/*\n" + "Accept-Encoding:\n" + "Connection: keep-alive\n" + "Accept-Language: *\n" + "Accept-Charset: utf-8\n\n"; } socket.write(request); var readState = { buffer: "", bufPos: 0, curCharState: isBinary ? kUTF8CharState_Binary : kUTF8CharState_Complete, curCharCode: 0, pendingUTF8Bytes: 0, lineState: kLineState_InProgress, curLine: "", line: "", isLineReadyToProcess: false, protocolState: kProtocolState_Status, contentBytesPending: null, dataAvailable: true, status: "", headers: {}, body: "" }; while ( ! (readState.protocolState == kProtocolState_Complete && readState.buffer.length <= readState.bufPos) && readState.protocolState != kProtocolState_TimeOut ) { if (readState.bufPos > 0 && readState.buffer.length == readState.bufPos) { readState.buffer = ""; readState.bufPos = 0; } if (readState.buffer == "") { if (readState.protocolState == kProtocolState_Body) { if (readState.contentBytesPending == null) { if (! readState.dataAvailable && ! socket.connected) { socket = null; readState.protocolState = kProtocolState_Complete; } else { readState.buffer += socket.read(); readState.dataAvailable = readState.buffer.length > 0; if (! readState.dataAvailable) { readState.buffer += socket.read(1); readState.dataAvailable = readState.buffer.length > 0; } } } else { if (! readState.dataAvailable && ! socket.connected) { socket = null; readState.protocolState = kProtocolState_TimeOut; } else { readState.buffer = socket.read(readState.contentBytesPending); readState.dataAvailable = readState.buffer.length > 0; readState.contentBytesPending -= readState.buffer.length; if (readState.contentBytesPending == 0) { readState.protocolState = kProtocolState_Complete; socket.close(); socket = null; } if (isBinary) { readState.body += readState.buffer; readState.buffer = ""; readState.bufPos = 0; } } } } else if (readState.protocolState != kProtocolState_Complete) { if (! readState.dataAvailable && ! socket.connected) { socket = null; readState.protocolState = kProtocolState_TimeOut; } else { readState.buffer += socket.read(1); readState.dataAvailable = readState.buffer.length > 0; } } } if (readState.buffer.length > readState.bufPos) { if (readState.curCharState == kUTF8CharState_Binary && readState.protocolState == kProtocolState_Body) { readState.body += readState.buffer; readState.bufPos = readState.buffer.length; } else { var cCode = readState.buffer.charCodeAt(readState.bufPos++); switch (readState.curCharState) { case kUTF8CharState_Binary: readState.curCharCode = cCode; readState.multiByteRemaining = 0; break; case kUTF8CharState_Complete: if (cCode <= 127) { readState.curCharCode = cCode; readState.multiByteRemaining = 0; } else if ((cCode & 0xE0) == 0xC0) { readState.curCharCode = cCode & 0x1F; readState.curCharState = kUTF8CharState_PendingMultiByte; readState.pendingUTF8Bytes = 1; } else if ((cCode & 0xF0) == 0xE0) { readState.curCharCode = cCode & 0x0F; readState.curCharState = kUTF8CharState_PendingMultiByte; readState.pendingUTF8Bytes = 2; } else if ((cCode & 0xF8) == 0xF0) { readState.curCharCode = cCode & 0x07; readState.curCharState = kUTF8CharState_PendingMultiByte; readState.pendingUTF8Bytes = 3; } else { readState.curCharCode = cCode; readState.pendingUTF8Bytes = 0; } break; case kUTF8CharState_PendingMultiByte: if ((cCode & 0xC0) == 0x80) { readState.curCharCode = (readState.curCharCode << 6) | (cCode & 0x3F); readState.pendingUTF8Bytes--; if (readState.pendingUTF8Bytes == 0) { readState.curCharState = kUTF8CharState_Complete; } } else { readState.curCharCode = cCode; readState.multiByteRemaining = 0; readState.curCharState = kUTF8CharState_Complete; } break; } if (readState.curCharState == kUTF8CharState_Complete || readState.curCharState == kUTF8CharState_Binary) { cCode = readState.curCharCode; var c = String.fromCharCode(readState.curCharCode); if (readState.protocolState == kProtocolState_Body || readState.protocolState == kProtocolState_Complete) { readState.body += c; } else { if (readState.lineState == kLineState_SeenCR) { readState.line = readState.curLine; readState.isLineReadyToProcess = true; readState.curLine = ""; readState.lineState = kLineState_InProgress; if (cCode == 13) { readState.lineState = kLineState_SeenCR; } else if (cCode != 10) { readState.curLine += c; } } else if (readState.lineState == kLineState_InProgress) { if (cCode == 13) { readState.lineState = kLineState_SeenCR; } else if (cCode == 10) { readState.line = readState.curLine; readState.isLineReadyToProcess = true; readState.curLine = ""; } else { readState.curLine += c; } } if (readState.isLineReadyToProcess) { readState.isLineReadyToProcess = false; if (readState.protocolState == kProtocolState_Status) { readState.status = readState.line; readState.protocolState = kProtocolState_Headers; } else if (readState.protocolState == kProtocolState_Headers) { if (readState.line == "") { readState.protocolState = kProtocolState_Body; } else { var headerLine = readState.line.split(":"); var headerTag = headerLine[0].replace(/^\s*(.*\S)\s*$/,"$1"); headerLine = headerLine.slice(1).join(":"); headerLine = headerLine.replace(/^\s*(.*\S)\s*$/,"$1"); readState.headers[headerTag] = headerLine; if (headerTag == "Content-Length") { readState.contentBytesPending = parseInt(headerLine); if (isNaN(readState.contentBytesPending) || readState.contentBytesPending <= 0) { readState.contentBytesPending = null; } else { readState.contentBytesPending -= (readState.buffer.length - readState.bufPos); } } } } } } } } } } if (socket != null) { socket.close(); socket = null; } reply = { status: readState.status, headers: readState.headers, body: readState.body }; } while (false); if (reply.status.indexOf("301") >= 0) { if (recursive301CallLevel == undefined) { recursive301CallLevel = 0; } if (recursive301CallLevel < kMaxRecursive301Calls) { reply = GetURL(reply.headers.Location, isBinary, recursive301CallLevel + 1); } } return reply; } function ParseURL(url) { url=url.replace(/([a-z]*):\/\/([-\._a-z0-9A-Z]*)(:[0-9]*)?\/?(.*)/,"$1/$2/$3/$4"); url=url.split("/"); if (url[2] == "undefined") url[2] = "80"; var parsedURL = { protocol: url[0].toUpperCase(), address: url[1], port: url[2], path: "" }; url = url.slice(3); parsedURL.path = url.join("/"); if (parsedURL.port.charAt(0) == ":") { parsedURL.port = parsedURL.port.slice(1); } if (parsedURL.port != "") { parsedURL.port = parseInt(parsedURL.port); } if (parsedURL.port == "" || parsedURL.port < 0 || parsedURL.port > 65535) { parsedURL.port = 80; } parsedURL.path = parsedURL.path; return parsedURL; }');
}