#include <ESP8266WiFi.h>
#include <EEPROM.h>
#include "MQ135.h"

struct { 
  float val = 0;
} data;
uint addr = 0;
int CurrentIndex = 0;
int Rzero = 0;

MQ135 gasSensor = MQ135(A0);

const char* ssid     = "Prideparade Mesh";
const char* password = "c58a45s07v42";

const char* host = "192.168.87.136";

# define sensorPin A0
# define SensorID 2
# define SensorType 0

void setup() {

  EEPROM.begin(512);
  EEPROM.get(addr,data);

  Rzero = data.val;

  Serial.begin(115200);
  delay(1000);
  
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


void loop() {
 delay(300000);

 CurrentIndex++;

 if (CurrentIndex == 5)
 {
  data.val = gasSensor.getRZero();
  EEPROM.put(addr,data);
  EEPROM.commit(); 
  CurrentIndex = 0;
 }
 
 int val = gasSensor.getPPM(data.val);

 Serial.print("connecting to ");
 Serial.println(host);

 // Use WiFiClient class to create TCP connections
 WiFiClient client;
 const int httpPort = 5000;
 if (!client.connect(host, httpPort)) {
  Serial.println("connection failed");
  return;
 }

 // We now create a URI for the request
 String url = "/admin/insertsensorvalue?Username=Sensor&Password=SensorPassword&SensorID=" + String(SensorID) + "&SensorType=" + String(SensorType) + "&SensorValue=" + String(val);

 Serial.print("Requesting URL: ");
 Serial.println(url);

   Serial.print("Requesting POST: ");
   // Send request to the server:
   client.println("POST " + url + " HTTP/1.1");
   client.println("Host: Sensor" + String(SensorID));
   client.println("Accept: */*");
   client.println("Content-Type: application/x-www-form-urlencoded");
   client.print("Content-Length: ");
   client.println(0);
   client.println();
   client.print("");

 unsigned long timeout = millis();
 while (client.available() == 0) {
 if (millis() - timeout > 5000) {
  Serial.println(">>> Client Timeout !");
  client.stop();
  return;
 }
}

 // Read all the lines of the reply from server and print them to Serial
 while(client.available()){
  String line = client.readStringUntil('\r');
  Serial.print(line);
 }

 Serial.println();
 Serial.println("closing connection");
}
