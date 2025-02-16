import React, { useState, useEffect } from "react";
import axios from "axios";

// Интерфейс для семинара
interface Seminar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  photo: string;
}

const SeminarsList: React.FC = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSeminar, setEditSeminar] = useState<Seminar | null>(null);

  // Загружаем семинары с сервера
  useEffect(() => {
    axios
      .get<Seminar[]>("http://localhost:5000/seminars")
      .then((response) => setSeminars(response.data))
      .catch((error) => console.error("Ошибка при загрузке данных", error));
  }, []);

  // Функция для удаления семинара
  const deleteSeminar = async (id: number) => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить этот семинар?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/seminars/${id}`);
        // После успешного удаления, обновляем список семинаров
        setSeminars(seminars.filter(seminar => seminar.id !== id));
      } catch (error) {
        console.error("Ошибка при удалении семинара:", error);
      }
    }
  };

  // Функция для открытия модального окна с данными для редактирования
  const openEditModal = (seminar: Seminar) => {
    setEditSeminar(seminar);
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setIsModalOpen(false);
    setEditSeminar(null);
  };

  // Функция для обновления семинара
  const updateSeminar = async (seminar: Seminar) => {
    try {
      const response = await axios.put<Seminar>(
        `http://localhost:5000/seminars/${seminar.id}`,
        seminar
      );
      setSeminars(seminars.map(s => (s.id === seminar.id ? response.data : s)));
      closeModal(); // Закрываем модальное окно после обновления
    } catch (error) {
      console.error("Ошибка при обновлении семинара:", error);
    }
  };

  return (
    <div>
      <h1>Список семинаров</h1>
      <ul>
        {seminars.map((seminar) => (
          <li key={seminar.id}>
            <h3>{seminar.title}</h3>
            <p>{seminar.description}</p>
            <p><strong>Дата:</strong> {seminar.date}</p>
            <p><strong>Время:</strong> {seminar.time}</p>
            <img src={seminar.photo} alt={seminar.title} />
            <div>
              <button onClick={() => openEditModal(seminar)}>Редактировать</button>
              <button onClick={() => deleteSeminar(seminar.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && editSeminar && (
        <div className="modal">
          <div className="modal-content">
            <h2>Редактировать семинар</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editSeminar) {
                  updateSeminar(editSeminar);
                }
              }}
            >
              <div>
                <label>Название:</label>
                <input
                  type="text"
                  value={editSeminar.title}
                  onChange={(e) => setEditSeminar({ ...editSeminar, title: e.target.value })}
                />
              </div>
              <div>
                <label>Описание:</label>
                <textarea
                  value={editSeminar.description}
                  onChange={(e) => setEditSeminar({ ...editSeminar, description: e.target.value })}
                />
              </div>
              <div>
                <label>Дата:</label>
                <input
                  type="text"
                  value={editSeminar.date}
                  onChange={(e) => setEditSeminar({ ...editSeminar, date: e.target.value })}
                />
              </div>
              <div>
                <label>Время:</label>
                <input
                  type="text"
                  value={editSeminar.time}
                  onChange={(e) => setEditSeminar({ ...editSeminar, time: e.target.value })}
                />
              </div>
              <div>
                <label>Фото URL:</label>
                <input
                  type="text"
                  value={editSeminar.photo}
                  onChange={(e) => setEditSeminar({ ...editSeminar, photo: e.target.value })}
                />
              </div>
              <button type="submit">Сохранить изменения</button>
              <button type="button" onClick={closeModal}>Закрыть</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeminarsList;