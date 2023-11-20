document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  const scoreLive = document.getElementById('score-live');
  const boardSize = 20;
  let gridSize = 20;
  let snake = [{ x: 10, y: 10 }];
  let food = getRandomFoodPosition();
  let dx = 0;
  let dy = 0;
  let intervalId = setInterval(moveSnake, 100);
  let touchStartX = 0;
  let touchStartY = 0;
  let lastMoved = 0;
  const moveInterval = 75; // Intervalo mínimo entre movimientos en milisegundos

  function setGridSize() {
    const width = gameBoard.clientWidth;
    gridSize = Math.floor(width / boardSize);
  }

  window.addEventListener('resize', setGridSize);
  setGridSize();

  function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Detectar colisión con el borde del tablero
    if (
      head.x < 0 ||
      head.x >= boardSize ||
      head.y < 0 ||
      head.y >= boardSize || // Ajuste aquí para incluir el borde inferior
      collision()
    ) {
      clearInterval(intervalId);
      alert(`Game Over! Score: ${snake.length - 1}`);
      location.reload();
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      food = getRandomFoodPosition();
    } else {
      snake.pop();
    }

    render();
  }

  function render() {
    gameBoard.innerHTML = '';
    document.documentElement.style.setProperty('--grid-size', gridSize);

    snake.forEach(segment => {
      const snakeElement = document.createElement('div');
      snakeElement.style.top = segment.y * gridSize + 'px';
      snakeElement.style.left = segment.x * gridSize + 'px';
      snakeElement.classList.add('snake');
      gameBoard.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.top = food.y * gridSize + 'px';
    foodElement.style.left = food.x * gridSize + 'px';
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
    scoreLive.textContent = snake.length - 1;
  }

  function getRandomFoodPosition() {
    return {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  }

  function collision() {
    return snake.slice(1).some(segment => {
      return segment.x === snake[0].x && segment.y === snake[0].y;
    });
  }

  const upBtn = document.getElementById('up');
  const downBtn = document.getElementById('down');
  const leftBtn = document.getElementById('left');
  const rightBtn = document.getElementById('right');

  upBtn.addEventListener('click', () => handleMove('up'));
  downBtn.addEventListener('click', () => handleMove('down'));
  leftBtn.addEventListener('click', () => handleMove('left'));
  rightBtn.addEventListener('click', () => handleMove('right'));

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
      return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    let direction;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && dx !== -1) {
        direction = 'right';
      } else if (dx !== 1) {
        direction = 'left';
      }
    } else {
      if (dy > 0 && dy !== -1) {
        direction = 'down';
      } else if (dy !== 1) {
        direction = 'up';
      }
    }

    handleMove(direction);

    touchStartX = 0;
    touchStartY = 0;
  }
  document.addEventListener('keydown', e => {
    // Verificar si se presionan las teclas de dirección
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault(); // Evitar el desplazamiento de la página
    }

    const now = Date.now();
    if (now - lastMoved < moveInterval) {
      return; // Evitar cambios muy rápidos
    }

    switch (e.key) {
      case 'ArrowUp':
        if (dy !== 1) {
          dx = 0;
          dy = -1;
          lastMoved = now;
        }
        break;
      case 'ArrowDown':
        if (dy !== -1) {
          dx = 0;
          dy = 1;
          lastMoved = now;
        }
        break;
      case 'ArrowLeft':
        if (dx !== 1) {
          dx = -1;
          dy = 0;
          lastMoved = now;
        }
        break;
      case 'ArrowRight':
        if (dx !== -1) {
          dx = 1;
          dy = 0;
          lastMoved = now;
        }
        break;
    }
  });

  function handleMove(direction) {
    const now = Date.now();
    if (now - lastMoved < moveInterval) {
      return;
    }

    switch (direction) {
      case 'up':
        if (dy !== 1) {
          dx = 0;
          dy = -1;
          lastMoved = now;
        }
        break;
      case 'down':
        if (dy !== -1) {
          dx = 0;
          dy = 1;
          lastMoved = now;
        }
        break;
      case 'left':
        if (dx !== 1) {
          dx = -1;
          dy = 0;
          lastMoved = now;
        }
        break;
      case 'right':
        if (dx !== -1) {
          dx = 1;
          dy = 0;
          lastMoved = now;
        }
        break;
    }
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    if (screen.orientation.lock) {
      screen.orientation.lock('portrait');
    }

    document.addEventListener('touchmove', e => {
      e.preventDefault();
    }, { passive: false });
  }
});
