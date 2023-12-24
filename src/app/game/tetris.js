'use client';

import React, { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function TetrisDiv() {

  const setCookie = (name, value, days) => {
    if (typeof document !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
  };


  const getCookie = (name) => {
    if (typeof document !== 'undefined') {
      const cookieName = `${name}=`;
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
          return cookie.substring(cookieName.length, cookie.length);
        }
      }
      return '';
    }
  };


  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = getCookie('highScore');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });


  const levelSpeeds = [
    { score: 0, speed: 1000 },     // Level 1
    { score: 100, speed: 800 },     // Level 2
    { score: 300, speed: 700 },     // Level 3
    { score: 500, speed: 600 },     // Level 4
    { score: 700, speed: 500 },     // Level 5
    { score: 1000, speed: 400 },    // Level 6
    { score: 1500, speed: 350 },    // Level 7
    { score: 2000, speed: 300 },    // Level 8
    { score: 2500, speed: 250 },    // Level 9
    { score: 3000, speed: 200 },    // Level 10
    { score: 3500, speed: 180 },    // Level 11
    { score: 4000, speed: 160 },    // Level 12
    { score: 4500, speed: 140 },    // Level 13
    { score: 5000, speed: 120 },    // Level 14
    { score: 5500, speed: 100 },    // Level 15
  ];



  const canvasRef = useRef(null);
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(generateRandomPiece());
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [fallingSpeed, setFallingSpeed] = useState(levelSpeeds[0].speed);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);



  const handleStartButtonClick = () => {
    setGameStarted(true);
  };


  useEffect(() => {
    if (gameStarted) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      playAudio();

      drawBoard(ctx, board);
      drawPiece(ctx, currentPiece);

      const handleKeyPress = (e) => {
        if (e.key === 'p') {
          setIsPaused(!isPaused);
        } else if (!isGameOver && !isPaused) {
          switch (e.key) {
            case 'ArrowLeft':
              moveLeft();
              break;
            case 'ArrowRight':
              moveRight();
              break;
            case 'ArrowDown':
              moveDown();
              break;
            case 'ArrowUp':
              rotatePiece();
              break;
            case ' ': 
              hardDrop();
              break;
            default:
              break;
          }
        }
      };

      window.addEventListener('keydown', handleKeyPress);

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [gameStarted, board, currentPiece, isPaused, isGameOver]);
  useInterval(() => {
    if (!isPaused) {
      moveDown();
    } else return;
  }, fallingSpeed);

  useEffect(() => {
    const sortedLevels = [...levelSpeeds].sort((a, b) => b.score - a.score);
    const currentLevel = sortedLevels.find((level) => score >= level.score) || sortedLevels[0];
    setFallingSpeed(currentLevel.speed);
    if (score > highScore) {
      setHighScore(score);
      setCookie('highScore', score, 365); 
    }
  }, [score, highScore]);




  function createEmptyBoard() {
    return Array.from({ length: 20 }, () => Array(10).fill(0));
  }

  function drawBoard(ctx, board) {
    ctx.clearRect(0, 0, board[0].length * 30, board.length * 30);
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] !== 0) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(col * 30, row * 30, 30, 30);
          ctx.strokeStyle = 'white';
          ctx.strokeRect(col * 30, row * 30, 30, 30);
        }
      }
    }

    const shadowPiece = calculateShadowPosition(currentPiece);
    drawPieceOutline(ctx, shadowPiece, 'grey');

    drawPiece(ctx, currentPiece);
  }
  function drawPieceOutline(ctx, piece, outlineColor) {
    piece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== 0) {
          ctx.fillStyle = 'transparent';
          ctx.fillRect((piece.x + colIndex) * 30, (piece.y + rowIndex) * 30, 30, 30);
          ctx.strokeStyle = outlineColor;
          ctx.strokeRect((piece.x + colIndex) * 30, (piece.y + rowIndex) * 30, 30, 30);
        }
      });
    });
  }

  function calculateShadowPosition(piece) {
    let shadowPiece = { ...piece };
    while (!checkCollision(shadowPiece)) {
      shadowPiece = { ...shadowPiece, y: shadowPiece.y + 1 };
    }
    shadowPiece = { ...shadowPiece, y: shadowPiece.y - 1 }; 
    return shadowPiece;
  }

  function moveDown() {
    if (isGameOver) return;
    const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (!checkCollision(newPiece)) {
      setCurrentPiece(newPiece);
    } else {
      updateBoard();
      checkGameOver();
    }
  }

  function checkCollision(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (
          piece.shape[row][col] !== 0 &&
          ((board[row + piece.y] && board[row + piece.y][col + piece.x]) !== 0 ||
            col + piece.x < 0 ||
            col + piece.x >= 10 ||
            row + piece.y >= 20)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function updateBoard() {
    const newBoard = [...board];
    let linesToClear = [];

    currentPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== 0) {
          newBoard[currentPiece.y + rowIndex][currentPiece.x + colIndex] = 1;
        }
      });

      const isLineComplete = newBoard[currentPiece.y + rowIndex].every((cell) => cell !== 0);
      if (isLineComplete) {
        linesToClear.push(currentPiece.y + rowIndex);
      }
    });
    let newScore = score;
    if (linesToClear.length > 0) {
      let comboMultiplier = 1; 
      let comboScore = 0;

      if (linesToClear.length === 1) {
        comboScore = 40;
      } else if (linesToClear.length === 2) {
        comboScore = 100;
      } else if (linesToClear.length === 3) {
        comboScore = 300;
      } else if (linesToClear.length === 4) {
        comboScore = 1200;
      }

      setScore((prevScore) => {
        const newScore = isNaN(prevScore) ? 0 : prevScore + comboScore;
        return newScore;
      });

      linesToClear.forEach((line) => {
        newBoard.splice(line, 1);
        newBoard.unshift(Array(10).fill(0));
      });

      if (currentPiece.y !== currentPiece.originalY) {
        const hardDropBonus = currentPiece.y - currentPiece.originalY + 1;
        newScore += hardDropBonus;
      }
    }

    setBoard(newBoard);
    setCurrentPiece(generateRandomPiece());
    const sortedLevels = [...levelSpeeds].sort((a, b) => b.score - a.score);
    const currentLevel = sortedLevels.find((level) => score >= level.score) || sortedLevels[0];
    setFallingSpeed(currentLevel.speed);
  }




  function checkGameOver() {
    if (currentPiece.y <= 0) {
      setIsGameOver(true);
    }
  }

  function generateRandomPiece() {
    const pieces = [
      { shape: [[1, 1, 1, 1]], x: 3, y: 0, color: 'cyan' }, // I
      { shape: [[1, 1, 1], [1, 0, 0]], x: 3, y: 0, color: 'orange' }, // L
      { shape: [[1, 1, 1], [0, 0, 1]], x: 3, y: 0, color: 'blue' }, // J
      { shape: [[1, 1, 1], [0, 1, 0]], x: 3, y: 0, color: 'purple' }, // T
      { shape: [[1, 1], [1, 1]], x: 3, y: 0, color: 'yellow' }, // O
      { shape: [[0, 1, 1], [1, 1, 0]], x: 3, y: 0, color: 'green' }, // S
      { shape: [[1, 1, 0], [0, 1, 1]], x: 3, y: 0, color: 'red' }, // Z
    ];
    const randomIndex = Math.floor(Math.random() * pieces.length);
    return { ...pieces[randomIndex] };
  }

  function drawPiece(ctx, piece) {
    piece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== 0) {
          ctx.fillStyle = piece.color;
          ctx.fillRect((piece.x + colIndex) * 30, (piece.y + rowIndex) * 30, 30, 30);
          ctx.strokeStyle = 'white';
          ctx.strokeRect((piece.x + colIndex) * 30, (piece.y + rowIndex) * 30, 30, 30);
        }
      });
    });
  }

  function moveLeft() {
    const newPiece = { ...currentPiece, x: currentPiece.x - 1 };
    if (!checkCollision(newPiece)) {
      setCurrentPiece(newPiece);
    }
  }

  function moveRight() {
    const newPiece = { ...currentPiece, x: currentPiece.x + 1 };
    if (!checkCollision(newPiece)) {
      setCurrentPiece(newPiece);
    }
  }

  function rotatePiece() {
    const newPiece = {
      ...currentPiece,
      shape: rotateMatrix(currentPiece.shape),
    };
    if (!checkCollision(newPiece)) {
      setCurrentPiece(newPiece);
    }
  }

  function rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotatedMatrix = Array.from({ length: cols }, () =>
      Array(rows).fill(0)
    );
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        rotatedMatrix[col][rows - 1 - row] = matrix[row][col];
      }
    }
    return rotatedMatrix;
  }

  const audioRef = React.useRef(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  function hardDrop() {
    let newPiece = { ...currentPiece };
    while (!checkCollision(newPiece)) {
      newPiece = { ...newPiece, y: newPiece.y + 1 };
    }
    newPiece = { ...newPiece, y: newPiece.y - 1 };
    setCurrentPiece(newPiece);
  }

  return (
    <div>
      {!gameStarted && (
        <div className="flex flex-col items-center justify-center mt-8 space-y-4">
          <h1 className="text-8xl">Welcome to Tetris!</h1>
          <button onClick={handleStartButtonClick}>Start Game</button>
        </div>
      )}
      {gameStarted && (
        <>
          <audio ref={audioRef} loop>
            <source src="/tetris/Korobeiniki.ogg" type="audio/ogg" />
            Sorry but your browser does not support the background music.
          </audio>
          <canvas ref={canvasRef} width={300} height={600} style={{ border: '2px solid' }} />
          {canvasRef.current && ( 
            <>
              <p>High Score: {highScore} Score: {score}</p>
              <p>Falling Speed: {fallingSpeed}ms</p>
              {isPaused && <p>Paused</p>}
              {isGameOver && <p>Game Over!</p>}

            </>
          )}
        </>
      )}
    </div>
  );

}
