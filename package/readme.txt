=============
Prerequisites
=============

Before starting the installation of the nuxeo connector for inDesign the following configurations must be present under nuxeo studio and imported into you nuxeo instance:

1 - Enabling Cross-Origin Resource Sharing (CORS) for the REST api :
<extension target="org.nuxeo.ecm.platform.web.common.requestcontroller.service.RequestControllerService" point="corsConfig">
 <corsConfig name="fooly" allowGenericHttpRequests="true"
   allowOrigin="*"
   allowSubdomains="true">
   <pattern>.*</pattern>
 </corsConfig>
</extension>

2 - Page Provider to retrieve the default list of assets
<extension target="org.nuxeo.ecm.platform.query.api.PageProviderService"
	point="providers">
	<coreQueryPageProvider name="AssetsForInDesignConnector">
		<pattern quoteParameters="true" escapeParameters="true">
			SELECT * FROM Picture WHERE ecm:currentLifeCycleState != 'deleted' AND ecm:isCheckedInVersion = 0
      	</pattern>
		<pageSize>100</pageSize>
	</coreQueryPageProvider>
</extension>

3 - Anonymous readonly access to assets in nuxeo
<extension target="org.nuxeo.ecm.platform.usermanager.UserService"
  point="userManager">
  <userManager>
    <!-- Add anonymous user -->
    <users>
      <anonymousUser id="Guest">
        <property name="firstName">Guest</property>
        <property name="lastName">User</property>
      </anonymousUser>
    </users>

    <!-- Add anonymous user to members group automatically -->
    <defaultGroup>members</defaultGroup>
  </userManager>
</extension>

<extension
    target="org.nuxeo.ecm.platform.ui.web.auth.service.PluggableAuthenticationService"
    point="chain">
  <authenticationChain>
    <plugins>
      <plugin>BASIC_AUTH</plugin>
      <plugin>FORM_AUTH</plugin>
    </plugins>
  </authenticationChain>
</extension>

<extension target="org.nuxeo.ecm.platform.ui.web.auth.service.PluggableAuthenticationService" point="specificChains">
<specificAuthenticationChain name="Anonymous">
    <urlPatterns>
      <url>(.*)/nxbigfile/*</url>
      <url>(.*)/nxthumb/*</url>
    </urlPatterns>
    <replacementChain>
    <plugin>ANONYMOUS_AUTH</plugin>
    </replacementChain>
  </specificAuthenticationChain>
</extension>

Once the anonymous user is created, you need to select the folders to which you want him to have a read-only access
(This is done under nuxeo instance directly)

===============================================
How to install the nuxeo connector for inDesign
===============================================

Step 1 :
Unzip and copy the folder org.nuxeo.indesignconnector :
On Mac, into ~/Library/Application Support/Adobe/CEP/extensions
On Windows, into %APPDATA%\Adobe\CEP\extensions

Step 2 :
On Mac
Open inDesign and go to the Scripts Panel (Window > Utilities > Scripts)
Right click on the "User" folder and click on "Reveal in Finder"
Copy the 2 files present in the "Scripts" folder (EnableUnsignedExtensions.jsx and DisableUnsignedExtensions.jsx) into the "Scripts Panel" folder
Next, run the EnableUnsignedExtensions.jsx script by double clicking on it on the Scripts Panel after unfolding the "User" folder
On Windows
Open the registry key HKEY_CURRENT_USER/Software/Adobe/CSXS.4 and add a key named PlayerDebugMode, of type String, and value 1.

Step 3 :
Restart inDesign and go to Window > Extensions > nuxeo InDesign Connector
Once there click on the settings icon and fill in the following informations:
-url of your nuxeo instance
-login
-password
If everything went well you should end up having a list of assets displayed.

Once there, if you want to add an asset into your inDesign document you just need to click on the thumbnail.

Link persistency
Now, anytime your asset is modified within nuxeo you'll get a badge notification beside the reload icon. All you need to do is click on it and the
new version of the asset will be imported.
You then need to display the links panel (Window > links) and double click on the alert icon to replace the old version by the new one.
