import confetti from 'canvas-confetti';

export const collectConfetti = () => {
  const particleCount = 12; // Количество направлений (углов)
  const angleStep = 360 / particleCount; // Угол между каждым запуском

  for (let i = 0; i < particleCount; i++) {
    confetti({
      angle: i * angleStep, // Угол выстрела
      spread: 35,          // Разлет частиц
      startVelocity: 40,   // Начальная скорость
      gravity: 0.5,        // Гравитация
      decay: 0.9,          // Скорость затухания
      scalar: 0.9,         // Размер частиц
      particleCount: 15,   // Количество частиц в каждом выстреле
      origin: { x: 0.5, y: 0.5 }, // Центр экрана
      colors: ['#EE5023', '#FFFFFF', '#AAAAAA'], // Фиолетовые, розовые, синие
    });
  }
};