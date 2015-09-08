var nuxeoClient;
var nb = 0;

function getAssets(url, login, pwd, request){
	
	nuxeoClient = new nuxeo.Client({
	  baseURL: 'http://'+url,
	  auth: {
		    // optional, default to 'basic'
		    method: 'basic',
		    username: login,
		    password: pwd
		  }
	});
	
	nuxeoClient.request(request).schema('file').header("X-NXContext-Category", "thumbnail").get(
	function(error, assets) {
	  if (error) {
	    // something went wrong
	    $("#images").html(error);
	    throw error;
	  }
	  $("#images").html("");
	 
	  $.each(assets.entries, function(i,asset){
		  $("<div class=\"column\"><div class=\"ui segment\"><img class=\"ui fluid image\" id=\""+asset.properties["file:content"].data+"\" draggable=\"false\" ondragstart=\"drag(event)\" onclick=\"onClickButton('"+asset.properties["file:content"].data+"', '"+asset.properties["file:content"].digest+"', '"+asset.uid+"')\" src=\""+asset.contextParameters.thumbnail.url+"\" style=\"cursor:pointer;\"/></div></div>").appendTo("#images");
	 	});	   
	});
	
}

function onRefreshButton(doUpload) {
	if(!doUpload){	   
		setTimeout("onRefreshButton(false)", 5000);
		if(nb == 0){
	   		$("#badge").removeClass("badge1").attr("data-badge", "");
	   	}
	}	
    var extScript = "$._ext_IDSN.refresh()";
    new CSInterface().evalScript(extScript, function(result){
		
        if(result != ""){
            result = JSON.parse(result);
            nb = 0;
            $.each(result.entries, function(i,link){    
            	
            	nuxeoClient.request('id/'+link.id).schema('file').get(
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