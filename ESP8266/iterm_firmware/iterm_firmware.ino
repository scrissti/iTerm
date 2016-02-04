/*
 *  This to be compiled in Arduino IDE for the esp8266
 *
 */

#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Temp sensor wire is plugged into port 2 on the esp8266
#define ONE_WIRE_BUS 2
// Relay wire is plugged into port 15 on the esp8266
#define RELAYPIN 15 
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

const char* ssid     = "<dedicated SSID>";
const char* password = "<long password insert here>";

const char* host = "<server.com>";
const char* secret = "<deviceSecret insert here>";


void setup() {
  pinMode(RELAYPIN, OUTPUT);
  analogWrite(RELAYPIN,0);
  Serial.begin(115200);
  delay(10);

  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

}
double mainprg=5;
double delta=0.2;

void loop() {

  sensors.requestTemperatures(); // Send the command to get temperatures
  double curtemp=sensors.getTempCByIndex(0);
  Serial.print("current t: ");Serial.println(curtemp);
  Serial.print("target t: ");Serial.println(mainprg);
  Serial.print("delta: ");Serial.println(delta);
  
  if (curtemp==85)
    return;
  if (curtemp==-127)
    return;
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 80;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }

  
  // We now create a URI for the request
  String url = "/postComfort/";
  url += "?secret=";
  url += secret;
  url += "&temp=";
  url += curtemp;
    
  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
  delay(10);
  
  // Read all the lines of the reply from server and print them to Serial
  String line;
  while(client.available()){
    line = client.readStringUntil('\r');
  }


  //get prog temp
  
  if (line.startsWith("prg",3)){
    Serial.println(line);
    double prg=line.substring(8,line.length()-13).toFloat();
    double newdelta=line.substring(line.length()-4,line.length()-1).toFloat();
    Serial.println(newdelta);
    if (prg>4&&prg<31&&prg!=mainprg){
      mainprg=prg;
      Serial.print("new target temp: ");Serial.println(mainprg);
    }
    if (newdelta>0&&newdelta<1&&newdelta!=delta){
      delta=newdelta;
      Serial.print("new delta: ");Serial.println(delta);
    }
  }  

  if (curtemp-delta>=mainprg)
    //stop
    {
    Serial.println("TURN OFF");
      analogWrite(RELAYPIN,0);
    }
  if (curtemp+delta<=mainprg)
    //start
    {
    Serial.println("TURN ON");
      analogWrite(RELAYPIN,PWMRANGE);
    }

delay(10000);
  
}

