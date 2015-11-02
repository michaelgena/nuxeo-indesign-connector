#!/bin/bash
cd ~/Library/Preferences/
echo '<?xml version=\"1.0\" encoding=\"UTF-8\"?>' > com.adobe.CSXS.6.plist
echo '<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">' >> com.adobe.CSXS.6.plist
echo '<plist version=\"1.0\">' >> com.adobe.CSXS.6.plist
echo '  <dict>' >> com.adobe.CSXS.6.plist
echo '    <key>LogLevel</key>' >> com.adobe.CSXS.6.plist
echo '    <string>1</string>' >> com.adobe.CSXS.6.plist
echo '    <key>PlayerDebugMode</key>' >> com.adobe.CSXS.6.plist
echo '    <string>1</string>' >> com.adobe.CSXS.6.plist
echo '  </dict>' >> com.adobe.CSXS.6.plist
echo '</plist>' >> com.adobe.CSXS.6.plist
sudo killall cfprefsd

