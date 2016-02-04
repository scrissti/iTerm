# iTerm
Internet connected and controllable home thermostat based on esp8266 and a bit of nodejs coding.


Before running, need to fill in config settings in the the following files:

  - web/secrets.js  - DeviceSecret key linked with permitted facebook user ID
  - web/fb.js  - Facebook Appid and App secret
  - web/routes/index.js  - Plot.ly account username, api key, token and graph name
  - ESP8266/iterm_firmware/iterm_firmware.ino - DeviceSecret key and  wifi ssid and passphrase
