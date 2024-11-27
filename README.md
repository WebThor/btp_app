




5. cf create-service xsuaa application xsuaa-service-tutorial -c ./security/xs-security.json

6. Run cf service xsuaa-service-tutorial till status = "create succeeded"

6. Update manifest.yml pro Gruppe. Ersetze hierbei xx durch jeweilige Gruppe

7. cf push

10. if both apps are in the start:running, go to https://frontendgroupxx.cfapps.us10-001.hana.ondemand.com/products (xx is your group name)

11. Go into the folder: ./myapp/security and open the xs-security.json file

12. Update XSUAA cf update-service  xsuaa-service-tutorial -c ./security/xs-security.json
