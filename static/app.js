const patterns = [
  [
    [17, 6, 18, 19],
    [6, 18, 30, 19],
    [17, 18, 30, 19],
    [17, 6, 18, 30]
  ],
  [
    [5, 18, 17, 19],
    [29, 18, 6, 30],
    [17, 18, 19, 31],
    [6, 30, 18, 7]
  ],
  [
    [17, 18, 7, 19],
    [5, 6, 18, 30],
    [17, 18, 29, 19],
    [6, 18, 30, 31]
  ],
  [
    [17, 18, 6, 7],
    [6, 18, 19, 31],
    [17, 18, 6, 7],
    [6, 18, 19, 31]
  ],
  [
    [5, 6, 18, 19],
    [29, 18, 17, 6],
    [5, 6, 18, 19],
    [29, 18, 17, 6],
  ],
  [
    [5, 6, 7, 8],
    [6, 18, 30, 42],
    [5, 6, 7, 8],
    [6, 18, 30, 42],
  ],
  [
    [6, 7, 18, 19],
    [6, 7, 18, 19],
    [6, 7, 18, 19],
    [6, 7, 18, 19],
  ]
]

let patternNumber = 0
let score = 0
let destroyedRows = 0
let level = 1
let time = 550
let shape = null
let previousShape = null
let color = null
let previousColor = null
let positions = null
let rotate = null
let interval = null
let play = false
let removeBlocks = false
let newGame = false
let blocks = []
let removedRows = []

for (let i = 0; i < 20; i++) {
  blocks.push({blocks: 0})
}

document.addEventListener('keydown', (event) => controlKeys(event))

const controlKeys = (event) => {
  switch (event.key) {
    case 'Enter':
      !play && !newGame ? start() : reset()
    break

    case 'ArrowLeft':
      if (!play) return
      moveLeft()

      if ($(`#block${positions[0]}`).hasClass('wall') ||
        $(`#block${positions[0]}`).hasClass('bottom') ||
        $(`#block${positions[1]}`).hasClass('bottom') ||
        $(`#block${positions[2]}`).hasClass('bottom') ||
        $(`#block${positions[3]}`).hasClass('bottom')) {
        moveRight()
      }

      for (const position of positions) {
        if (!$(`#block${position + 1}`).hasClass('bottom'))
          $(`#block${position + 1}`).removeClass(color)
      }

      for (const position of positions) {
        $(`#block${position}`).addClass(color)
      }
    break
    
    case 'ArrowRight':
      if (!play) return
      moveRight()

      if ($(`#block${positions[3]}`).hasClass('wall') ||
        $(`#block${positions[0]}`).hasClass('bottom') ||
        $(`#block${positions[1]}`).hasClass('bottom') ||
        $(`#block${positions[2]}`).hasClass('bottom') ||
        $(`#block${positions[3]}`).hasClass('bottom')) {
        moveLeft()
      }

      for (const position of positions) {
        if (!$(`#block${position - 1}`).hasClass('bottom'))
          $(`#block${position - 1}`).removeClass(color)
      }

      for (const position of positions) {
        $(`#block${position}`).addClass(color)
      }
    break

    case 'ArrowUp':
      if (!play) return

      if ($(`#block${positions[0] - 1}`).hasClass('bottom') ||
        $(`#block${positions[1] - 1}`).hasClass('bottom') ||
        $(`#block${positions[2] - 1}`).hasClass('bottom') ||
        $(`#block${positions[3] - 1}`).hasClass('bottom') ||
        $(`#block${positions[0] + 1}`).hasClass('bottom') ||
        $(`#block${positions[1] + 1}`).hasClass('bottom') ||
        $(`#block${positions[2] + 1}`).hasClass('bottom') ||
        $(`#block${positions[3] + 1}`).hasClass('bottom')) {
        return
      }

      const longBlock = 5

      if (shape === longBlock) {
        if ($(`#block${positions[0] + 24}`).hasClass('bottom') ||
          $(`#block${positions[1] + 24}`).hasClass('bottom') ||
          $(`#block${positions[2] + 24}`).hasClass('bottom') ||
          $(`#block${positions[3] + 24}`).hasClass('bottom')) {
          return
        }
      }

      let distance = null
      shape === longBlock ? distance = 2 : distance = 1
      
      if ($(`#block${positions[1] + distance}`).hasClass('wall') || $(`#block${positions[1] - 1}`).hasClass('wall')) {
        return
      } else {
        for (const position of positions) {
          $(`#block${position}`).removeClass(color)
        }
  
        patternNumber += 1
  
        if (patternNumber === 4) patternNumber = 0
  
        positions = rotate[patternNumber]
  
        for (const position of positions) {
          $(`#block${position}`).addClass(color)
        }
      }
    break

    case 'ArrowDown':
      if (!play) return
      play = false
      clearInterval(interval)
      interval = setInterval(moveDown, 20)
    break
  }
}

const moveLeft = () => {
  positions = positions.map(position => position - 1)
  rotate = [
    rotate[0].map(position => position - 1),
    rotate[1].map(position => position - 1),
    rotate[2].map(position => position - 1),
    rotate[3].map(position => position - 1)
  ]
}

const moveRight = () => {
  positions = positions.map(position => position + 1)
  rotate = [
    rotate[0].map(position => position + 1),
    rotate[1].map(position => position + 1),
    rotate[2].map(position => position + 1),
    rotate[3].map(position => position + 1)
  ]
}

const moveDown = () => {
  positions = positions.map(position => position + 12)
  rotate = [
    rotate[0].map(position => position + 12),
    rotate[1].map(position => position + 12),
    rotate[2].map(position => position + 12),
    rotate[3].map(position => position + 12)
  ]

  if ($(`#block${positions[0]}`).hasClass('bottom') ||
    $(`#block${positions[1]}`).hasClass('bottom') ||
    $(`#block${positions[2]}`).hasClass('bottom') ||
    $(`#block${positions[3]}`).hasClass('bottom')) {
    
    clearInterval(interval)
    positions = positions.map(position => position - 12)
    
    for (const position of positions) {
      $(`#block${position}`).addClass('bottom')
      $(`#block${position}`).addClass('notCounted')
    }

    check()
  }

  if (!removeBlocks) {
    for (const position of positions) {
      $(`#block${position - 12}`).removeClass(color)
    }
    for (const position of positions) {
      $(`#block${position}`).addClass(color)
    }
  }
}

const start = () => {
  play = true

  for (let i = 1; i < 11; i++) {
    if (document.querySelector(`#block${i}`).classList.contains('bottom')) {
      play = false
    }
  }

  if (play) {
    do { shape = Math.floor(Math.random() * patterns.length) }
    while (shape === previousShape)
    previousShape = shape
    positions = patterns[shape][0]
    rotate = patterns[shape]

    const colors = ['red', 'green', 'blue', 'yellow']
    do { color = colors[Math.floor(Math.random() * 4)] }
    while (color === previousColor)
    previousColor = color

    for (const position of positions) {
      $(`#block${position}`).addClass(color)
    }

    if (destroyedRows >= 10) {
      destroyedRows = 0
      time -= 25
      level += 1
      $('#level').text(level)
    }

    interval = setInterval(moveDown, time)
  } else {
    end()
  }
}

const end = () => {
  newGame = true
  
  for (let index = 8; index < 12; index++) {
    for (let i = 1; i < 11; i++) {
      removeColors(index, i)
    }
  }

  $('#block113').text('G')
  $('#block114').text('A')
  $('#block115').text('M')
  $('#block116').text('E')
  $('#block125').text('O')
  $('#block126').text('V')
  $('#block127').text('E')
  $('#block128').text('R')
}

const reset = () => {
  for (let index = 0; index < 20; index++) {
    for (let i = 1; i < 11; i++) {
      removeColors(index, i)
    }
  }

  blocks.forEach(block => block.blocks = 0)

  $('#block113').text('')
  $('#block114').text('')
  $('#block115').text('')
  $('#block116').text('')
  $('#block125').text('')
  $('#block126').text('')
  $('#block127').text('')
  $('#block128').text('')

  score = 0
  $('#score').text(score)
  destroyedRows = 0
  level = 1
  time = 550
  $('#level').text(level)
  clearInterval(interval)
  start()
}

const removeColors = (index, i) => {
  document.querySelector(`#row${index}`).children[i].classList.remove('bottom')
  document.querySelector(`#row${index}`).children[i].classList.remove('red')
  document.querySelector(`#row${index}`).children[i].classList.remove('green')
  document.querySelector(`#row${index}`).children[i].classList.remove('blue')
  document.querySelector(`#row${index}`).children[i].classList.remove('yellow')
}

const check = () => {
  play = false
  
  for (index = 19; index > 0; index--) {
    for (let i = 1; i < 11; i++) {
      if (document.querySelector(`#row${index}`).children[i].classList.contains('notCounted')) {
        document.querySelector(`#row${index}`).children[i].classList.remove('notCounted')
        blocks[index].blocks += 1
      }
    }
    
    if (blocks[index].blocks === 10) {
      removedRows.unshift(index)
      removeBlocks = true
      for (let i = 1; i < 11; i++) {
        removeColors(index, i)
      }
    }
  }

  if (removeBlocks) {
    switch (removedRows.length) {
      case 1:
        score += 25
        destroyedRows += 1
      break
      case 2:
        score += 100
        destroyedRows += 2
      break
      case 3:
        score += 500
        destroyedRows += 3
      break
      case 4:
        score += 1000
        destroyedRows += 4
      break
    }

    $('#score').text(score)

    setTimeout(() => {
      removeBlocks = false
      dropBlocks()
    }, 500)
  } else {
    start()
  }
}

const dropBlocks = () => {
  for (index = (removedRows[0] - 1); index > 0; index--) {
    blocks[index + 1].blocks = blocks[index].blocks
    
    for (let i = 1; i < 11; i++) { 
      if (document.querySelector(`#row${index}`).children[i].classList.contains('red'))
        handleDrops(index, i, 'red')
      
      if (document.querySelector(`#row${index}`).children[i].classList.contains('green'))
        handleDrops(index, i, 'green')
      
      if (document.querySelector(`#row${index}`).children[i].classList.contains('blue'))
        handleDrops(index, i, 'blue')
      
      if (document.querySelector(`#row${index}`).children[i].classList.contains('yellow'))
        handleDrops(index, i, 'yellow')
    }
  }

  removedRows.shift()

  if (removedRows.length > 0) {
    dropBlocks()
  } else {
    check()
  }
}

const handleDrops = (index, i, color) => {
  const block = document.querySelector(`#row${index}`).children[i].getAttribute('id')
  const id = parseInt(block.substring(5))
  $(`#block${id}`).removeClass(color)
  $(`#block${id + 12}`).addClass(color)
  $(`#block${id}`).removeClass('bottom')
  $(`#block${id + 12}`).addClass('bottom')
}