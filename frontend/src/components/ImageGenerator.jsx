import React, { useState } from "react";
import { generateImage, checkStatus } from "../api";
import ImageSettings from "./ImageSettings";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [history, setHistory] = useState([]);

  const [settings, setSettings] = useState({
    type: "photo",
    count: 1,
    width: 512,
    height: 512,
  });

  async function start() {
    if (!prompt.trim()) {
      setStatus("Введите текст!");
      return;
    }

    setStatus("Генерация...");
    setCurrentImage(null);

    try {
      const task = await generateImage(prompt, settings); // отправляем JSON
      poll(task.task_id);
    } catch (err) {
      setStatus("Ошибка при отправке запроса");
    }
  }

  async function poll(taskId) {
    try {
      const data = await checkStatus(taskId);

      if (data.status === "DONE") {
        const imageSrc = "data:image/jpeg;base64," + data.image;
        setCurrentImage(imageSrc);
        setHistory((prev) => [{ prompt, image: imageSrc }, ...prev.slice(0, 9)]);
        setStatus("Готово!");
      } else if (data.status === "FAIL") {
        setStatus("Ошибка: " + data.error);
      } else {
        setTimeout(() => poll(taskId), 1000);
      }
    } catch (err) {
      setStatus("Ошибка при проверке статуса");
    }
  }

  return (
    <div className="main-container">
      {/* Блок настроек */}
      <ImageSettings
        settings={settings}
        setSettings={setSettings}
        previewImage={currentImage}
      />

      <div className="generator-wrapper">
        <div className="generator-main">
          <h2>Введите текст для генерации:</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Опишите, что вы хотите сгенерировать..."
          />
          <button onClick={start} className="generate-btn">Сгенерировать</button>
          <div className="status-text">{status}</div>

          <div className="image-frame">
            {currentImage ? (
              <img src={currentImage} alt="Сгенерированное" />
            ) : (
              <div className="placeholder">Здесь появится ваше изображение</div>
            )}
          </div>
        </div>

        <div className="generator-history">
          <h3>История генераций</h3>
          {history.length === 0 && <p>Пока нет сохранённых изображений</p>}
          {history.map((item, idx) => (
            <div key={idx} className="history-item">
              <img src={item.image} alt={`История ${idx}`} />
              <p>{item.prompt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
