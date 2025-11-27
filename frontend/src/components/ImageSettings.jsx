import React from "react";

export default function ImageSettings({ settings, setSettings }) {
  // Вычисляем размеры превью, чтобы вписать в максимум 200px по ширине или высоте
  const maxPreviewSize = 200;
  const aspectRatio = settings.width / settings.height;
  let previewWidth = maxPreviewSize;
  let previewHeight = maxPreviewSize;

  if (aspectRatio > 1) {
    previewHeight = maxPreviewSize / aspectRatio;
  } else {
    previewWidth = maxPreviewSize * aspectRatio;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: Number(value) || value }));
  };

  return (
    <div className="settings-panel">
      <h3>Настройки генерации</h3>
      <div className="settings-flex">
        <div className="settings-controls">
          <div className="setting-group">
            <label>Тип изображения</label>
            <select name="style" value={settings.style} onChange={handleChange}>
              <option value="UHD">Детальное фото</option>
              <option value="ANIME">Аниме</option>
              <option value="KANDINSKY">Собственная реализация от API</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Количество изображений</label>
            <input
              type="number"
              name="count"
              value={settings.count}
              min={1}
              max={5}
              onChange={handleChange}
            />
          </div>

          <div className="setting-group">
            <label>Ширина</label>
            <input
              type="number"
              name="width"
              value={settings.width}
              min={128}
              max={2048}
              onChange={handleChange}
            />
          </div>

          <div className="setting-group">
            <label>Высота</label>
            <input
              type="number"
              name="height"
              value={settings.height}
              min={128}
              max={2048}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="preview-group">
          <label>Превью</label>
          <div
            className="preview-box"
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
            }}
          />
          <p>{settings.width} x {settings.height}</p>
        </div>
      </div>
    </div>
  );
}
