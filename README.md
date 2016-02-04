# iTerm
Internet connected and controllable home thermostat based on esp8266 and a bit of nodejs coding.


Before running, need to fill in config settings in the the following files:

  - web/secrets.js  - DeviceSecret key linked with permitted facebook user ID
  - web/fb.js  - Facebook Appid and App secret
  - web/routes/index.js  - Plot.ly account username, api key, token and graph name
  - ESP8266/iterm_firmware/iterm_firmware.ino - DeviceSecret key and  wifi ssid and passphrase


Electronics components used in my project:
  - esp8266 esp-12 - 5$  from [Aliexpress](http://www.aliexpress.com/item/ESP-12-ESP8266-Serial-Port-WIFI/32252795812.html?spm=2114.01010208.3.280.KrEUs2&ws_ab_test=searchweb201556_2,searchweb201644_4_505_506_503_504_301_502_10001_10002_10016_10017_10010_10005_10011_10006_10003_10004_401_10009_10008,searchweb201560_5,searchweb1451318400_-1,searchweb1451318411_6452&btsid=f95d11f0-da59-4910-a7e4-b80f6b4c5a4b)
  - relay module  -  1$ from [Aliexpress](http://www.aliexpress.com/item/Easy-One-1-Channel-5V-Relay-Module-Board-Shield-for-PIC-AVR-DSP-ARM-MCU-Arduino/32433774846.html?spm=2114.01010208.3.1.V2BQXk&ws_ab_test=searchweb201556_2,searchweb201644_4_505_506_503_504_301_502_10001_10002_10016_10017_10010_10005_10011_10006_10003_10004_401_10009_10008,searchweb201560_5,searchweb1451318400_-1,searchweb1451318411_6452&btsid=f9efab50-d127-4f2e-b0ea-29996e121235)
  - ds18b20 temperature sensor - 1.4$ from [Aliexpress](http://www.aliexpress.com/item/Stainless-steel-package-Waterproof-DS18b20-temperature-probe-temperature-sensor-18B20-For-Arduino/32354656400.html?spm=2114.01010208.3.128.pVuBXq&ws_ab_test=searchweb201556_2,searchweb201644_4_505_506_503_504_301_502_10001_10002_10016_10017_10010_10005_10011_10006_10003_10004_10009_10008,searchweb201560_5,searchweb1451318400_-1,searchweb1451318411_6452&btsid=ef0dca29-7e08-4d4b-9dd1-9ea978a4d5d9)
  - 5v power - 2$ [Aliexpress](http://www.aliexpress.com/item/AC-100-240V-Converter-Adapter-DC-5-5mm-x-2-5MM-5V-2A-2000mA-Charger-EU/32521432299.html?spm=2114.01010208.3.66.EGw00a&ws_ab_test=searchweb201556_2,searchweb201644_4_505_506_503_504_301_9912_502_10001_10002_10016_10017_10010_10005_10011_10006_10003_10004_10009_10008,searchweb201560_5,searchweb1451318400_-1,searchweb1451318411_6452&btsid=ca52b588-ea6b-4385-b5d1-85080b5df851)
