const create = () => {
  let index = 1

  for (let i = 0; i < 21; i++) {
    const row = document.createElement('div')
    row.setAttribute('id', `row${i}`)
    row.setAttribute('class', 'rows')
    document.querySelector('#playGround').appendChild(row)

    const number = index + 12

    for (let i = index; i < number; i++) {
      const block = document.createElement('div')
      block.setAttribute('id', `block${i}`)
      block.setAttribute('class', 'block')
      row.appendChild(block)
      if (i > 240) {
        $(`#block${i}`).addClass('bottom')
        $(`#block${i}`).css('display', 'none')
      }
    }

    $(`#block${index}`).addClass('wall')
    $(`#block${index}`).css('display', 'none')
    $(`#block${index + 11}`).addClass('wall')
    $(`#block${index + 11}`).css('display', 'none')
    
    index += 12
  }
}

create()