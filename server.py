from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route("/create-file", methods=["POST"])
def create_file():
    data = request.get_json()
    file_path = data.get("filePath")
    content = data.get("content")

    if not file_path or not content:
        return jsonify({"error": "filePath и content обязательны"}), 400

    # Абсолютный путь в папке проекта
    full_path = os.path.join(os.getcwd(), file_path)

    # Создание директорий, если они не существуют
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    # Запись содержимого в файл
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

    return jsonify({"success": True, "path": full_path})

if __name__ == "__main__":
    app.run(port=8001)
