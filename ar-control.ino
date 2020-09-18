#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

#include <string>
// time sync
#include <NTPClient.h>
#include <WiFiUdp.h>
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "south-america.pool.ntp.org", -4*60*60);



#include <ESP8266HTTPClient.h>

// NodeMCU 1.0 para o arduino menor
// NodeMCU 0.9 para o arduino maior
ESP8266WebServer server(80);

const int led = 2;
char pswNumber = 0;
String aMac = "";

// Try to connect in the ssid, if fail then try to next password in the password array, it's a sync function
void connectWifi() {
    const char * ssid = "CafeComLeite_2.4GHz";
    const char COUNT_PASSWORD = 1;
    char * password[COUNT_PASSWORD] = { "Cafecomleite303A" };

    pswNumber = 0;
    
    WiFi.mode(WIFI_STA);
    Serial.printf("Connecting in %s with password %s", ssid, password[pswNumber]);
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
            Serial.printf("Connecting in %s with password %s\n", ssid, password[pswNumber]);
            WiFi.begin(ssid, password[pswNumber]);
        }

    }

    Serial.print("Connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void handleRoot() {
    ledOn();
    // return error!
    server.send(504);
    ledOff();
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

void setupLed() {
    pinMode(led, OUTPUT);
    digitalWrite(led, 1);
}
void ledOn() {
    digitalWrite(led, 0);
}
void ledOff() {
    digitalWrite(led, 1);
}

void sleep(){
    if (server.hasArg("time") == false){
      handleNotFound();
    }
    int secondsToSleep = server.arg("time").toInt();
    
    Serial.printf("Going into deep sleep for %d seconds", secondsToSleep);
    ESP.deepSleep(secondsToSleep * 1e6); // 20e6 is 20 microseconds  
}

String getTime(){
    timeClient.update();
    return timeClient.getFormattedTime();
}

void request() {
    HTTPClient http;  
    ledOn();
    delay(100);
    ledOff();
    http.begin("http://dontpad.com/giovanic/esp8266"); // inicia a comunicacao com base na sua url
    int httpCode = http.GET(); // efetua uma requisicao do tipo get e retorna o código de status da conexao
    
    if (httpCode < 0) {
        Serial.println("request error - " + httpCode);
        return;
    }
    if (httpCode != HTTP_CODE_OK) {
        return;
    }
    String payload = http.getString();
    http.end();

    String text = payload.substring(payload.indexOf("START") +5,payload.indexOf("END"));

    text +=getTime();

    http.addHeader("content-type", "application/x-www-form-urlencoded");
    String body = "text=START" + text+"\nEND";
    http.POST(body);
}

void setup(void) {

    Serial.begin(115200);
    setupLed();
 
    connectWifi();
    aMac = WiFi.macAddress();

    if (MDNS.begin("air")) {
        Serial.println("MDNS responder started");
    }

    server.on("/", handleRoot);
    
    server.on("/ping", []() {
        ledOn();
        server.send(200, "text/plain", aMac + " pong! ");
        ledOff();

    });

    server.on("/sleep", sleep);
    server.on("/request", request);
    server.on("/time", getTime);
    
    server.onNotFound(handleNotFound);

    server.begin();
    Serial.println("HTTP server started");
}

void loop(void) {
    server.handleClient();
    delay(2*60*1000);
    request();
}
