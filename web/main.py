from flask import Flask, request, jsonify, render_template

# Inicializa o aplicativo Flask
app = Flask(__name__)

# Variável global para armazenar os últimos dados do sensor
# Usamos um dicionário para flexibilidade futura (temp, status, etc.)
sensor_data = {
    "umidade_solo": "N/A",
    "timestamp": "Nenhum dado recebido ainda"
}

# --- Endpoint para receber dados da ESP32 (POST) ---
@app.route('/dados', methods=['POST'])
def receber_dados():
    global sensor_data
    
    # 1. Verifica se o corpo da requisição é JSON
    if not request.is_json:
        return jsonify({"status": "erro", "mensagem": "O formato deve ser JSON"}), 400

    # 2. Obtém os dados JSON
    dados_recebidos = request.get_json()

    # 3. Processa e armazena os dados
    if 'umidade' in dados_recebidos:
        
        # Simplesmente armazena o valor (você pode adicionar validação aqui)
        umidade = dados_recebidos['umidade']
        
        # Atualiza a variável global
        sensor_data['umidade_solo'] = f"{umidade}%"
        sensor_data['timestamp'] = datetime.now().strftime("%H:%M:%S em %d/%m/%Y")
        
        print(f"Dados Recebidos: Umidade = {umidade}%")
        
        # Retorna uma resposta de sucesso para a ESP32
        return jsonify({"status": "ok", "mensagem": "Dados recebidos com sucesso!"}), 200
    else:
        # Se o campo 'umidade' estiver faltando no JSON
        return jsonify({"status": "erro", "mensagem": "Campo 'umidade' faltando no corpo da requisição"}), 400

# --- Página inicial para visualização (GET) ---
@app.route('/')
def dashboard():
    # Renderiza a página HTML, passando os dados atuais
    return render_template('dashboard.html', data=sensor_data)

# --- Execução do servidor ---
if __name__ == '__main__':
    # Importação da datetime precisa ser feita aqui se não estiver no topo
    from datetime import datetime
    
    # Executa o servidor. Use host='0.0.0.0' para que ele seja acessível
    # a partir de outros dispositivos na sua rede (como a ESP32)
    # debug=True é útil para desenvolvimento
    app.run(host='0.0.0.0', port=5000, debug=True)