import { useState } from "react" 
import confetti from "canvas-confetti"
import { Square } from "./components/Square.jsx"
import { TURNS } from "./constants.js"
import { checkWinnerFrom, checkEndGame } from "./logic/board.js"
import { WinnerModal } from "./components/WinnerModal.jsx"
import { saveGameToStorage, resetGameStorage } from "./logic/storage/index.js"

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board")
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })
  // winner, null = winner, false = tie (empate)
  const [winner, setWinner] = useState(null)
  
  const resetGame = () => {
     setBoard(Array(9).fill(null))
     setTurn(TURNS.X)
     setWinner(null)

     resetGameStorage()
  }

  const updateBoard = (index) => {
    // para que no se sobreescriba
    if (board[index] || winner) return
    // actualizar el tablero
    const newBoard = [... board]
    newBoard[index] = turn // x u o
    setBoard(newBoard)
    // change turn
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    
    // save game
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    // revisar ganador 
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    }
    // check if game is over
    else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }
  
  return (
    <main className='board'>
      <h1>Ta te ti</h1>
      <button onClick={resetGame}>Reset Game</button>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square 
              key={index}
              index={index}
              updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelect={turn === TURNS.X}>
          {TURNS.X}
          </Square>
        <Square isSelect={turn === TURNS.O}>
          {TURNS.O}
          </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App
