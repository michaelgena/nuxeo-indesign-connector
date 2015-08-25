# nuxeo-indesign-connector

1- Creating your own package
Create a Certificate using the following command line:
./ZXPSignCmd -selfSignedCert <countryCode> <stateOrProvince> <organization> <commonName> <password> <outputPath.p12>
(If you don't have the ZXPSignCmd you need to download one first)
Pack and Sign an HTML Extension
./ZXPSignCmd -sign <inputDirectory> <outputZxp> <p12> <p12Password> -tsa <timestampURL>
(example of a timestampURL https://timestamp.geotrust.com/tsa)

./ZXPSignCmd -selfSignedCert IT BO DBCompany "Davide Barranca" OcaMorta selfDB.p12


./ZXPSignCmd -sign com.example.helloworld com.example.helloworld.zxp selfDB.p12 OcaMorta -tsa https://timestamp.geotrust.com/tsa


2-Installing the existing package
./ExManCmd --install "/Users/mgena/Documents/INDESIGN/staging/org.nuxeo.indesignconnector.zxp"


Copying the extension into place

Now that the system is ready to load our unsigned extension, the last thing we have to do is copy our extension into the shared extensions folder on disk:

On Mac, copy the extension into ~/Library/Application\ Support/Adobe/CEP/extensions
On Windows, copy the extension into %APPDATA%\Adobe\CEP\extensions
When you're done you should have a folder structure like this:

extensions/
    HelloWorld/
        CSXS/
            manifest.xml
        index.html
