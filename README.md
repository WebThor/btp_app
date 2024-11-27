

1. Create an SAP Account as described here: Please note that you have to use your university email address and a phone number to which you have access, you will need it later on. https://developers.sap.com/tutorials/hcp-create-trial-account..html

2. As soon as you login the first time to the SAP BTP Trail account, it asks you where you would like to deploy your instance. Select USA (AWS) here. 


1. Clone this repo

2. cd product-list/myapp

3. Perform cf login https://api.cf.us10-001.hana.ondemand.com


4. LogIn with your SAP Universal ID credentials

5. cf create-service xsuaa application xsuaa-service-tutorial -c ./security/xs-security.json

6. Run cf service xsuaa-service-tutorial till status = "create succeeded"

6. Update manifest.yml pro Gruppe. Ersetze hierbei xx durch jeweilige Gruppe

7. cf push

10. if both apps are in the start:running, go to https://frontendgroupxx.cfapps.us10-001.hana.ondemand.com/products (xx is your group name)

11. Go into the folder: ./myapp/security and open the xs-security.json file

12. Update XSUAA cf update-service  xsuaa-service-tutorial -c ./security/xs-security.json
