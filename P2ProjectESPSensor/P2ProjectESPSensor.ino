#include <ESP8266WiFi.h>
#include <EEPROM.h>
#include "MQ135.h"

float Rzero = 0;

MQ135 gasSensor = MQ135(A0);

const char* ssid     = "Prideparade Mesh";
const char* password = "c58a45s07v42";

const char* host = "192.168.87.136";

# define sensorPin A0
# define SensorID 0

void setup() {
  Serial.begin(115200);
  delay(1000);

  Rzero = GetRZeroValue();

  Serial.println("RZero: " + String(Rzero));
  
  InitializeWifi(ssid, password);
}


void loop() {
  TransferData(gasSensor.getPPM(Rzero), SensorID, 0, host, 5000);

  delay(300000);
}

void TransferData(int Value, int ID, int Type, const String Host, const int Port)
{
 Serial.print("connecting to ");
 Serial.println(Host);

 // Use WiFiClient class to create TCP connections
 WiFiClient client;
 if (!client.connect(Host, Port)) {
  Serial.println("connection failed");
  return;
 }

 // We now create a URI for the request
 String url = "/admin/insertsensorvalue?Username=Sensor&Password=SensorPassword&SensorID=" + String(ID) + "&SensorType=" + String(Type) + "&SensorValue=" + String(Value);

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

float SetRZeroValue(float Value)
{
  EEPROM.put(0,Value);
  EEPROM.commit();
}

float GetRZeroValue()
{
  float OutValue = 0.0;
  EEPROM.begin(512);
  EEPROM.get(0,OutValue);
  return OutValue;
}

void InitializeWifi(const char* _SSID, const char* _Password)
{
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(_SSID);

  WiFi.begin(_SSID, _Password);

  while (WiFi.status() != WL_CONNECTED) {
   delay(500);
   Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

