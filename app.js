async function OpenContentMatcher() {
  function MessageError(message) {
    const errorView = document.getElementById('data-error')
    const boxView = document.createElement('div')
    boxView.className = "error-content"
    boxView.innerText = message
    errorView.appendChild(boxView)
  }
  try {
    const datafetch = await fetch("./jadwal.json")
    if(!datafetch.ok) {
      return MessageError("ErrorFetch")
    }
    const data = await datafetch.json()

    if(new URLSearchParams(location.search).get("disabled_response")) {
      document.querySelector('.boxresponse').style.maxWidth = "100%"
    }
    const resetMentions = () => {
      document.getElementById('content-jadwal').innerHTML = `<div class="view-none">Pilih untuk mencari opsi konten</div>`
    }
    const buildJadwal = (arrayOBJ) => {
      const jadwal = document.getElementById('content-jadwal')
      jadwal.innerHTML = ''
      arrayOBJ.forEach((datajadwal) => {
        if(typeof (datajadwal.worker && datajadwal.time) === 'string') {
          const card = document.createElement('div')
          const card_time = document.createElement('small')
          const card_worker = document.createElement('b')
          const card_desc = document.createElement('p')
          card.appendChild(card_time)
          card.appendChild(card_worker)
          card_worker.innerText = datajadwal.worker
          card_time.innerText = datajadwal.time
          if(datajadwal.desc) {
            card.appendChild(card_desc)
            card_desc.innerText = datajadwal.desc
          }
          card.className = "list-jadwal"
          jadwal.appendChild(card)
        }
      })
    }

    const d = new Date().getDay()
    let c = 0
    if(new Date().getHours() >= data.timenext) {
      c = String((d + 1 ) >= 6? 0 : d + 1)
    } else {
      c = String(d >= 6? 0 : d + 1)
    }
    const dataSelect = data.jadwal[c]
    document.querySelectorAll('#select-jadwal option').forEach(a => {
      if(a.value === c) {
        a.selected = true
      }
    })
    if(!dataSelect || !Array.isArray(dataSelect) || !dataSelect[0]) {
      resetMentions()
    } else {
      buildJadwal(dataSelect)
    }

    document.getElementById('select-jadwal').addEventListener("change", (e) => {
      if(!e.target.value) {
        return resetMentions();
      }
      const dataSelect = data.jadwal[e.target.value]
      if(!dataSelect || !Array.isArray(dataSelect) || !dataSelect[0]) {
        return resetMentions();
      }
      buildJadwal(dataSelect)
    })
  } catch(err) {
    MessageError(err.stack)
  }
}
OpenContentMatcher()
