# nuxeo-indesign-connector

The nuxeo Connector for InDesign enables designers to import assets into an InDesign layout directly from nuxeo.

## Prerequisites
Before starting the installation of the nuxeo connector for inDesign you need to install a marketplace package containing the following configurations into you nuxeo instance:

1 - Enabling Cross-Origin Resource Sharing (CORS) for the REST api :
```
<extension target="org.nuxeo.ecm.platform.web.common.requestcontroller.service.RequestControllerService" point="corsConfig">
 <corsConfig name="fooly" allowGenericHttpRequests="true"
   allowOrigin="*"
   allowSubdomains="true">
   <pattern>.*</pattern>
 </corsConfig>
</extension>
```
2 - Page Provider to retrieve the default list of assets
```
<extension target="org.nuxeo.ecm.platform.query.api.PageProviderService"
	point="providers">
	<coreQueryPageProvider name="AssetsForInDesignConnector">
		<pattern quoteParameters="true" escapeParameters="true">
			SELECT * FROM Picture WHERE ecm:currentLifeCycleState != 'deleted' AND ecm:isCheckedInVersion = 0
      	</pattern>
		<pageSize>100</pageSize>
	</coreQueryPageProvider>
</extension>
```
3 - Anonymous readonly access to assets in nuxeo
```
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
```
In order to install the above extensions go to the sub-folder **nuxeo-indesign-connector** and build the marketplace package using the following command line:
```
mvn clean install
```
You will end up with a zip containing the marketplace package located here ***/marketplace-nuxeo-indesign-connector/target/marketplace-nuxeo-indesign-connector-1.0-SNAPSHOT.zip***.
Once you installed the package into your nuxeo instance, you need to select the folders to which you want the Anonymous user have a read-only access
(This is done under nuxeo instance directly).

## How to install the nuxeo connector for inDesign

**Step 1**  
 Copy the folder "org.nuxeo.indesignconnector" that you'll find under the "package" folder :
```
On Mac, into ~/Library/Application Support/Adobe/CEP/extensions
```
```
On Windows, into %APPDATA%\Adobe\CEP\extensions
```
**Step 2**  
On Mac
- Open inDesign and go to the Scripts Panel **(Window > Utilities > Scripts)**
- Right click on the "User" folder and click on "Reveal in Finder"
- Copy the 2 files present in the "package/Scripts" folder **(EnableUnsignedExtensions.jsx and 			DisableUnsignedExtensions.jsx)** into the "Scripts Panel" folder
- Next, run the EnableUnsignedExtensions.jsx script by double clicking on it on the Scripts Panel after unfolding the "User" folder  

On Windows
- Open the registry key **HKEY_CURRENT_USER/Software/Adobe/CSXS.4** and add a key named PlayerDebugMode, of type String, and value 1.

**Step 3**  
Restart inDesign and go to **Window > Extensions > nuxeo InDesign Connector**.  
Once there click on the settings icon and fill in the following informations:
- url of your nuxeo instance
- login
- password  

If everything went well you should end up having a list of assets displayed.
Once there, if you want to add an asset into your inDesign document you just need to click on the thumbnail.

## Link persistency
Now, anytime your asset is modified within nuxeo you'll get a badge notification beside the reload icon. All you need to do is click on it and the
new version of the asset will be imported.
You then need to display the links panel (**Window > links**) and double click on the alert icon to replace the old version by the new one.

## About Nuxeo

Nuxeo provides a modular, extensible Java-based [open source software platform for enterprise content management](http://www.nuxeo.com/en/products/ep) and packaged applications for [document management](http://www.nuxeo.com/en/products/document-management), [digital asset management](http://www.nuxeo.com/en/products/dam) and [case management](http://www.nuxeo.com/en/products/case-management). Designed by developers for developers, the Nuxeo platform offers a modern architecture, a powerful plug-in model and extensive packaging capabilities for building content applications.

More information at <http://www.nuxeo.com/>
