from flask import Flask, request, jsonify
import time
import requests
import json
import random
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)

# === Настройки API ===
API_URL = 'https://api-key.fusionbrain.ai'
API_KEY = '4AF38EFA081670E90DA6283C5EF0861E'
SECRET_KEY = '15EE9125729E6EA19CDC3C482DCEFAB1'
AUTH_HEADERS = {
    'X-Key': f'Key {API_KEY}',
    'X-Secret': f'Secret {SECRET_KEY}',
}

# === Кэш pipeline UUID ===
PIPELINE_UUID = None

def get_pipeline():
    global PIPELINE_UUID
    if PIPELINE_UUID is None:
        resp = requests.get(f"{API_URL}/key/api/v1/pipelines", headers=AUTH_HEADERS)
        resp.raise_for_status()
        data = resp.json()
        first = data[0]
        PIPELINE_UUID = first.get('uuid') or first.get('id')
    return PIPELINE_UUID

# === Асинхронные задачи через ThreadPoolExecutor ===
executor = ThreadPoolExecutor(max_workers=10)

# === Хранилище задач ===
tasks = {}

# === Функции генерации ===
def generate(prompt, settings):
    pipeline_uuid = get_pipeline()
    if settings is None:
        settings = {}
    params = {
        "type": "GENERATE",
        "style": settings.get("style", "UHD"),
        "numImages": settings.get("count", 1),
        "width": settings.get("width", 512),
        "height": settings.get("height", 512),
        "generateParams": {"query": prompt}
    }
    files = {
        'pipeline_id': (None, pipeline_uuid),
        'params': (None, json.dumps(params), 'application/json')
    }
    resp = requests.post(f"{API_URL}/key/api/v1/pipeline/run",
                         headers=AUTH_HEADERS,
                         files=files)
    resp.raise_for_status()
    data = resp.json()
    return data['uuid']

def check_generation(task_uuid, attempts=30, delay=0.5):
    for _ in range(attempts):
        try:
            resp = requests.get(f"{API_URL}/key/api/v1/pipeline/status/{task_uuid}",
                                headers=AUTH_HEADERS, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            status = data.get('status')
            if status == 'DONE':
                files = data.get('result', {}).get('files')
                if files:
                    return files[0]
                raise RuntimeError("DONE, но files отсутствуют")
            elif status == 'FAIL':
                err = data.get('errorDescription', 'Неизвестная ошибка')
                raise RuntimeError(f"FAIL: {err}")
        except Exception:
            # Экспоненциальный backoff + jitter
            time.sleep(delay + random.random()*0.5)
            delay = min(delay * 1.5, 5)
    raise TimeoutError("Не дождались генерации")

def generate_image_task(prompt, settings, task_id):
    try:
        task_uuid = generate(prompt, settings)
        image_b64 = check_generation(task_uuid)
        tasks[task_id] = {"status": "DONE", "image": image_b64}
    except Exception as e:
        tasks[task_id] = {"status": "FAIL", "error": str(e)}

# === Роуты ===
@app.route('/generate', methods=['POST'])
def generate_route():
    data = request.get_json()  # синхронно
    prompt = data.get('prompt')
    settings = data.get('settings', {})

    if not prompt:
        return jsonify({"error": "Введите текст для генерации"}), 400

    task_id = str(time.time()).replace('.', '')
    tasks[task_id] = {"status": "PENDING"}

    # запуск фоновой задачи
    executor.submit(generate_image_task, prompt, settings, task_id)

    return jsonify({"task_id": task_id})

@app.route('/status/<task_id>', methods=['GET'])
def status_route(task_id):
    task = tasks.get(task_id)
    if not task:
        return jsonify({"status": "NOT_FOUND"}), 404
    return jsonify(task)

if __name__ == '__main__':
    app.run(debug=True)
