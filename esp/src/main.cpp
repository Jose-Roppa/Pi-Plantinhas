#include <Arduino.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define DHTPIN 4
#define A0 36
#define D0 5

const char* ssid = "ZTE_2.4G_YfxD27";
const char* password = "DS5skSNc";
const char* flask_server_ip = "192.168.1.8";
const int flask_port = 5000;
const char* endpoint = "/dados"; 

DHT dht(DHTPIN, DHT11);

int le_umidade_solo() {
  // Liga o sensor
  digitalWrite(D0, HIGH);
  delay(300);

  // Lê umidade
  
  int sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(36);
  }
  
  // Desliga sensorl
  digitalWrite(D0, LOW);

  return map(sum / 10, 500, 4000, 100, 0) + 2;
}

void enviarDadosAoServidor() {
  // Certifica-se de que a conexão Wi-Fi está ativa antes de tentar enviar
  if (WiFi.status() == WL_CONNECTED) {
    
    // 1. Cria o objeto HTTPClient
    HTTPClient http;

    // Constrói a URL completa para a requisição
    String serverPath = "http://" + String(flask_server_ip) + ":" + String(flask_port) + String(endpoint);

    // Inicia a requisição com o servidor
    http.begin(serverPath);

    // 2. Lê os dados do sensor
    int umidade = le_umidade_solo();

    // 3. Monta o corpo JSON
    // O Flask espera um JSON com o campo "umidade"
    String jsonPayload = "{\"umidade\": " + String(umidade) + "}";

    // Define o cabeçalho da requisição para informar que o conteúdo é JSON
    http.addHeader("Content-Type", "application/json");

    Serial.print("Enviando POST para ");
    Serial.print(serverPath);
    Serial.print(" com payload: ");
    Serial.println(jsonPayload);

    // 4. Envia a requisição POST
    int httpResponseCode = http.POST(jsonPayload);
    
    // 5. Verifica a resposta do servidor Flask
    if (httpResponseCode > 0) {
      Serial.print("Código de Resposta HTTP: ");
      Serial.println(httpResponseCode);
      
      // Se quiser ver a mensagem de sucesso (Ex: "Dados recebidos com sucesso!")
      String response = http.getString();
      Serial.println("Resposta do Servidor:");
      Serial.println(response);
    } else {
      Serial.print("Erro na requisição HTTP. Código: ");
      Serial.println(httpResponseCode);
    }

    // Fecha a conexão HTTP
    http.end();
  } else {
    Serial.println("WiFi desconectado. Não foi possível enviar dados.");
  }
}

// Roda assim que liga o ESP
void setup() {
  pinMode(D0, OUTPUT);
  digitalWrite(D0, LOW);

  Serial.begin(9600);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado!");
  Serial.print("Endereço IP da ESP32: ");
  Serial.println(WiFi.localIP());
}

// Loop infinito chamado após setup acabar
void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  int umidade_solo = le_umidade_solo();

  enviarDadosAoServidor();
  delay(1000);
}
