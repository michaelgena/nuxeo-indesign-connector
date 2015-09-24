//EnableUnsignedCCExtensions.jsx
//
main();
function main(){
	var string;
	var userFolder = Folder.userData;
	//this gives us ~/Library/ApplicationSupport
	//...so we're looking for userFolder.parent
	userFolder = Folder(userFolder.parent.fullName + "/Preferences");
	var plistFile;
	if(app.version.match(/^10/) != null){
		plistFileName = userFolder.fullName + "/com.adobe.CSXS.5.plist";
	}
	else{
		plistFileName = userFolder.fullName + "/com.adobe.CSXS.6.plist";
	}
	plistFile = File(plistFileName);
	string = buildString();
	if(plistFile.exists){
		var result = plistFile.remove();
		result = writeTextFile (plistFileName, string);
		if(result){
			result = runShellScript();
			if(result){
				alert("Unsigned CC extensions are now enabled.");
			}
		}
	}
	//If the file did not exist, create it.
	else{
		plistFile = new File(plistFileName);
		plistFileName.open("w");
		plistFileName.write(string);
		plistFileName.close();
	}
}

function buildString(){
	var string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r";
	string += "<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\r";
	string += "<plist version=\"1.0\">\r";
	string += "<dict>\r";
	string += "<key>LogLevel</key>\r";
	string += "<string>1</string>\r";
	string += "<key>PlayerDebugMode</key>\r";
	string += "<string>1</string>\r";
	string += "</dict>\r";
	string += "</plist>\r";
	return string;
}

function writeTextFile(filePath, string){
	var file = new File(filePath);
	file.encoding = "UTF-8";
	file.open ("w");
	var result = file.write(string);
	file.close();
	return result;
}

function readTextFile(filePath){
	var string = "";
	if(File(filePath).exists == true){
		var file = (File(filePath));
		file.open ("r");
		string = file.read();
		file.close();
	}
	return string;
}

function runShellScript(){
	//do shell script "command" user name "me" password "mypassword" with administrator privileges
	var credentials = displayDialog();
	if(credentials != null){
		try{
			var script = "do shell script \"killall cfprefsd\" user name \"" + credentials.userName + "\" password \"" + credentials.password + "\" with administrator privileges";
			app.doScript(script, ScriptLanguage.APPLESCRIPT_LANGUAGE);
			return true;
		}
		catch(error){
			alert("Updating preferences failed. Please run \"sudo killall cfprefsd\" from Terminal.");
			return false;
		}
	}
	else{
		alert("User canceled; preferences will not be set.");
		return false;
	}
}

function displayDialog(){
	var labelWidth = 80;
	var fieldWidth = 160;
	//Not retVal. Why be obscure to save five characters?
	var returnValue = null;
	var dialog = app.dialogs.add({name:"Authorization"});
	with(dialog.dialogColumns.add()){
		with(dialogRows.add()){
			with(dialogColumns.add()){
				staticTexts.add({staticLabel:"Please enter your Mac OS user credentials."});
			}
		}
		with(dialogRows.add()){
			with(dialogColumns.add()){
				staticTexts.add({staticLabel:"User name:", minWidth:labelWidth});
			}
			with(dialogColumns.add()){
				var userNameField = textEditboxes.add({minWidth:fieldWidth});
			}
		}
		with(dialogRows.add()){
			with(dialogColumns.add()){
				staticTexts.add({staticLabel:"Password:", minWidth:labelWidth});
			}
			with(dialogColumns.add()){
				var passwordField = textEditboxes.add({minWidth:fieldWidth});
			}
		}
	}
	var result = dialog.show();
	if(result){
		returnValue = {};
		var userName = userNameField.editContents;
		var password = passwordField.editContents;
		if((userName != "")&&(password != "")){
			returnValue.userName = userName;
			returnValue.password = password;
		}
	}
	dialog.destroy();
	return returnValue;
}
