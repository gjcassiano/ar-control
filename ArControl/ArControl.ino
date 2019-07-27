#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

const char* ssid = "Net Virtua apt 303 A";
const char COUNT_PASSWORD = 6;
char* password[COUNT_PASSWORD] = {"2202277758", "2202277759", "2202277760", "2202277761", "2202277762"};

// NodeMCU 1.0 para o arduino menor
// NodeMCU 0.9 para o arduino maior

ESP8266WebServer server(80);

const int led = 2;

char pswNumber = 0;
void connectWifi() { 
  pswNumber = 0;
  WiFi.mode(WIFI_STA);
  Serial.printf("connecting in %s with password %s", ssid, password[pswNumber]);
  WiFi.begin(ssid, password[pswNumber]);
  
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(led, 0);
    delay(100);
    digitalWrite(led, 1);
    
    delay(400);
    
    if (WiFi.status() == 4) {
        pswNumber++;
        WiFi.disconnect();
        WiFi.mode(WIFI_STA);
        Serial.printf("connecting in %s with password %s", ssid, password[pswNumber]);
        WiFi.begin(ssid, password[pswNumber]);
    }
    
  }

  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

} 

void handleRoot() {
  digitalWrite(led, 0);
  server.send(200, "text/plain", "hello from esp8266!");
  digitalWrite(led, 1);
}

void handleNotFound() {
  digitalWrite(led, 0);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
  
  digitalWrite(led, 1);
}
String aMac = "";
void setup(void) {
  pinMode(led, OUTPUT);
  digitalWrite(led, 1);
  Serial.begin(115200);
  
  connectWifi();
  aMac = WiFi.macAddress();
  
  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/", handleRoot);

  server.on("/ping", []() {
    digitalWrite(led, 0);
    server.send(200, "text/plain", aMac + " pong!");
    digitalWrite(led, 1);
    //ESP.lightsleep(1 * 60000000);
  });

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {
  server.handleClient();
}
