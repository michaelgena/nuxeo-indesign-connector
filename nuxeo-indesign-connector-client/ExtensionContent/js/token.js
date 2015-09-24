function generateToken(host, login, password){
	applicationName = "Nuxeo%20InDesign%20Connector";
	deviceName = "Mac%2020OS";
	deviceId = "deviceId-"+(Math.random() * 100) + 1;
	if(host.slice(-1) != "/"){
		host = host+"/";
	}
	host = "http://"+host;
	$.ajax({
		 url: host+"authentication/token?applicationName="+applicationName+"&deviceName="+deviceName+"&deviceId="+deviceId+"&permission=rw",
		 beforeSend: function(xhr) { 
		  xhr.setRequestHeader("Authorization", "Basic " + btoa(login+":"+password)); 
		 },
		 type: 'GET',
		 processData: false,
		 success: function (data) {
			 if(data == null || data == ""){
				 $("#host-message").hide();
				 $("#message").show();
				 $('#form').show();
	         }else{
	        	 var extScript = "$._ext_IDSN.setToken('"+host+"', '"+login+"', '"+data+"')";
				 new CSInterface().evalScript(extScript);
				 token = data;
				 host = host;
				 $("#message").hide();
				 $("#positive-message").show();
				 $("#host-message").html("on "+host+" as "+login);
				 $("#host-message").show();
				 $('#form').hide();
	         }			 
		},
		  error: function(){
		   alert("Unable to generate token");
		 }
	});
}

function initializeToken(){	
	
//	token = "b664b8ce-e443-48c4-9c16-8f1219c73fb6";
//	host = "http://localhost:8080/nuxeo/";
//	login = "Administrator";
//	getAssets("query/AssetsForInDesignConnector");
//    $("#message").hide();
//    $('#form').hide();
//	$("#positive-message").show();
//	$("#host-message").html("on "+host+" as "+login);
//	$("#host-message").show();
	
	//document.cookie="X-Authentication-Token="+token;
	
	var extScript = "$._ext_IDSN.getToken()";
    new CSInterface().evalScript(extScript, function(result){		
        if(result != ""){
            result = JSON.parse(result);
            host = result.host;
            token = result.token;
            login = result.login;
            if(token == null || token == ""){
            	$("#host-message").hide();
            	$("#message").show();
            	$('#form').show();
            }else{
            	//$("#url").attr("src", host+"login.jsp");
            	getAssets("query/AssetsForInDesignConnector");
                $("#message").hide();
                $('#form').hide();
    			$("#positive-message").show();
    			$("#host-message").html("on "+host+" as "+login);
    			$("#host-message").show();

            }
            
        }else{
        	$("#host-message").hide();
        	$("#message").show();
        	$('#form').show();
        }
    });
}

function revokeToken(){
	 var extScript = "$._ext_IDSN.setToken('', '', '')";
	 new CSInterface().evalScript(extScript);
	 host = "";
     token = "";
     login = "";
     $("#positive-message").hide();
     $("#host-message").html("");
	 $("#message").show();
	 $('#form').show();
}
