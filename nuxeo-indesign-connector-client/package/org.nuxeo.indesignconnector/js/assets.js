function getAssets(request, query){
	$("#images").html("");
	$("#main-message").hide();
	$("#loader").show();
	nuxeoClient = new nuxeo.Client({
	  baseURL: host
	});
	nuxeoClient.request(request).schema('file').header("X-Authentication-Token",token).header("X-NXContext-Category","thumbnail").get(
	function(error, assets) {
			
		if (error) {
			// something went wrong	
			$("#loader").hide();
			$("#main-message").show();
			$("#main-message").html("<p>"+error+"</p>");
			throw error;
		}
		if(assets == null || assets.entries == null || assets.entries == 0){
			$("#loader").hide();
			$("#main-message").show();
			$("#main-message").html("<p>No asset to display.</p>");
		}
		
		$.each(assets.entries, function(i,asset){
			$("#loader").hide();
			getThumbnail(asset.contextParameters.thumbnail.url, asset.properties["file:content"].data);
			$("<div class=\"column\"><div class=\"ui segment\"><img class=\"ui fluid image\" id=\""+asset.properties["file:content"].data+"\" draggable=\"false\" ondragstart=\"drag(event)\" onclick=\"onClickButton('"+asset.properties["file:content"].data+"', '"+asset.properties["file:content"].digest+"', '"+asset.uid+"')\" src=\"\" style=\"cursor:pointer;\"/></div></div>").appendTo("#images");						
	 	});	   
	});
	
}

function getThumbnail(url, imgID){
	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.setRequestHeader("X-Authentication-Token", token);
	// use multiple setRequestHeader calls to set multiple values
	oReq.responseType = "arraybuffer";
	oReq.onload = function (oEvent) {
	  var arrayBuffer = oReq.response; // Note: not oReq.responseText
	  if (arrayBuffer) {
	    var u8 = new Uint8Array(arrayBuffer);
	    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
	    var mimetype="image/png"; // or whatever your image mime type is
	    document.getElementById(imgID).src="data:"+mimetype+";base64,"+b64encoded;
	  }
	};
	oReq.send(null);
}

function runSearch(query){
	query = encodeURIComponent("%"+query+"%");
	searchType = $("input[name=searchType]:checked").val();
	$('#content').show();
	$('#setting').hide();
	if(query.length>0){
		if(searchType == "document") {
			getAssets("query/QueryAssetsForInDesignConnector?queryParams="+query);
		}else{
			getAssets("query/QueryAssetsWithChildrenForInDesignConnector?queryParams="+query);
		}
	}
}

function onRefreshButton(doUpload) {
	if(!doUpload){	   
		setTimeout("onRefreshButton(false)", 5000);
		if(nb == 0){
	   		$("#badge").removeClass("badge1").attr("data-badge", "");
	   	}
	}	
	if(token == null || token == ""){
		return;
	}
    var extScript = "$._ext_IDSN.refresh()";
    new CSInterface().evalScript(extScript, function(result){
		
        if(result != ""){
            result = JSON.parse(result);
            nb = 0;
            $.each(result.entries, function(i,link){    
            	nuxeoClient.request('id/'+link.id).header("X-Authentication-Token",token).schema('file').get(
	    			function(error, asset) {
	    				if (error) {
	    			    	// something went wrong
	    			    	throw error;
	    			  	}	
	    			 
    				  	if(link.digest != asset.properties["file:content"].digest){
    						
    						if(doUpload){
	    						object = {};
	    						object.id = asset.uid;
	    						object.url = asset.properties["file:content"].data;
	    						object.digest = asset.properties["file:content"].digest;
	    						object = JSON.stringify(object);
	    						object = escape(object); 
	    						
	    						uploadAsset(object);
	    						$("#badge").removeClass("badge1").attr("data-badge", "");
	    						nb = 0;
    						}else{
    							nb++;
    							
    							if( $("#badge").attr("data-badge") == "" || parseInt($("#badge").attr("data-badge")) < nb){
    								$("#badge").addClass("badge1").attr("data-badge", nb);
    							}
    						}
    					}    			 	   
    			});
            });
        }
    	      
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(data);
}
