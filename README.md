# nuxeo-indesign-connector

<img src="Screen-Shot.png"/>  

The Nuxeo Adobe CC Connector, previously known Nuxeo InDesign Connector, enables designers to import assets into an InDesign, Photoshop, or Illustrator document directly from Nuxeo. The connector is divided into two parts, a server side and a client side that must be installed on the corresponding Adobe Solution.  Now, anytime your asset is modified within Nuxeo you'll get a badge notification beside the reload icon. All you need to do is click on it and the new version of the asset will be imported. You then need to display the links panel (Window > links) and double click on the alert icon to replace the old version by the new one.

# Building
    mvn clean install -Pmarketplace,ftest

## QA

[![Build Status](https://qa.nuxeo.org/jenkins/job/master/job/addons_FT_nuxeo-indesign-connector-master/)](https://qa.nuxeo.org/jenkins/job/master/job/addons_FT_nuxeo-indesign-connector-master/)

## Server-Side Plugin

### How to Install

Install [the Nuxeo Adobe CC Connector Nuxeo Package](https://connect.nuxeo.com/nuxeo/site/marketplace/package/nuxeo-indesign-connector-marketplace):

    nuxeoctl mp-install marketplace-nuxeo-indesign-connector/marketplace/target/marketplace-*.zip


## Client-Side Plugin

### How to Install

#### Step 1

Copy the folder "`nuxeo-indesign-connector-client/package/org.nuxeo.indesignconnector`":
```
On Mac, into ~/Library/Application\ Support/Adobe/CEP/extensions
```
```
On Windows, into C:\Program Files (x86)\Common Files\Adobe\CEP\extensions
```

#### Step 2

Mac OS X:

- Double click on the file **EnableUnsignedExtensions.command** that you will find under the "package/Scripts" folder.
- You will be asked to type your password, do so and press enter. That's it.

Windows:

- Double click on the file **EnableUnsignedExtensions.reg** under the "package/Scripts" folder and click on Accept.

#### Step 3

Restart inDesign and go to **Window > Extensions > Nuxeo InDesign Connector**.
Once there click on the settings icon and fill in the following informations:
- URL of your Nuxeo instance
- login
- password

If everything went well you should end up having a list of assets displayed.
Once there, if you want to add an asset into your inDesign document you just need to click on the thumbnail.

## Link Persistency
Now, anytime your asset is modified within Nuxeo you'll get a badge notification beside the reload icon. All you need to do is click on it and the new version of the asset will be imported.
You then need to display the links panel (**Window > links**) and double click on the alert icon to replace the old version by the new one.

### Photoshop and Ilustrator 
For Photoshop and Illustrator the steps for the installation are almost the same as for InDesign.
On the server side you need to install the same Nuxeo Package as for InDesign. 
For the client side, on Step 1 use:
- "`nuxeo-photoshop-connector-client/package/org.nuxeo.photoshopconnector`" for Photoshop
- "`nuxeo-illustrator-connector-client/package/org.nuxeo.illustratorconnector`" for Illustrator


## Known Limitations
Currently there is a limitation of the InDesign API regarding the HTTPS protocol. This is the reason why we only propose an HTTP connection in the Nuxeo Asset Explorer within InDesign.

## About Nuxeo

Nuxeo dramatically improves how content-based applications are built, managed and deployed, making customers more agile, innovative and successful. Nuxeo provides a next generation, enterprise ready platform for building traditional and cutting-edge content oriented applications. Combining a powerful application development environment with
SaaS-based tools and a modular architecture, the Nuxeo Platform and Products provide clear business value to some of the most recognizable brands including Verizon, Electronic Arts, Sharp, FICO, the U.S. Navy, and Boeing. Nuxeo is headquartered in New York and Paris.
More information is available at [www.nuxeo.com](http://www.nuxeo.com).
