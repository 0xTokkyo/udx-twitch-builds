$(document).ready(function () {
  let shipData = {}

  $('.nav-item').on('click', function () {
    var target = $(this).data('nav-item')
    $('#corpus-nav .nav-item, .corpus-content').removeClass('active')
    $(this).addClass('active')
    $('#' + target)
      .closest('.corpus-content')
      .addClass('active')
  })

  function findShipData(ship_token) {
    return shipData.find((data) => data.token === ship_token)
  }

  function updateHeader(user) {
    $('.creatorName').text(user.sc_handle)
    $('.creatorGuildName').text(user.org_name.data.name)
    $('.creatorPicture').css(
      'backgroundImage',
      `url(https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.${
        user.avatar.startsWith('a_') ? 'gif' : 'png'
      })`
    )
    $('.creatorGuildPicture').css('backgroundImage', `url(${user.org_picture_url})`)
  }

  function updateCorpus(data) {
    // Hangar
    if (data.hangar && data.hangar.length > 0) {
      const shipCounts = data.hangar.reduce((acc, item) => {
        const ship = findShipData(item.ship_token)
        if (acc[ship.name]) {
          acc[ship.name].count += 1
        } else {
          acc[ship.name] = { count: 1, ship: ship }
        }
        return acc
      }, {})

      Object.keys(shipCounts).forEach((shipName) => {
        const shipData = shipCounts[shipName]
        const count = shipData.count
        const ship = shipData.ship
        const listItem = `
          <li>
            <a href="#" target="blank"
              class="ship ${count > 1 ? 'is-multiple' : ''}"
              style="background-image: url('assets/img/ships/background/${ship.slug}.jpg')"
            >
              <div class="overlay">
                <div class="name">
                  ${ship.name}
                  ${count > 1 ? `<div class="multiplier">${count}</div>` : ''}
                </div>
                <div class="class">${ship.classification}</div>
                <div
                  class="manufacturer"
                  style="background-image: url('assets/img/companies/${ship.manufacturer?.code}.svg')"
                ></div>
              </div>
            </a>
          </li>`

        $('#hangar').append(listItem)
      })
    }
  }

  async function fetchData(udxApiKey) {
    fetch('http://localhost:3000/api/get-twitch-extension-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: udxApiKey })
    })
      .then((response) => response.json())
      .then((data) => {
        updateHeader(data.data.userLowData)
        updateCorpus(data.data)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  }

  async function configurationNeeded() {
    $('.corpus-content').removeClass('active')
    $('.app-load-indicator, #app-configuration-needed').toggleClass('display')
  }

  async function init(udxApiKey) {
    await fetch('assets/data/shipdata.json')
      .then((response) => response.json())
      .then((data) => {
        shipData = data
      })
      .finally(() => {
        console.log('UxonDyncamics Twitch Extension: Ship Data loaded.')
      })
    await fetchData(udxApiKey)
    $('.app-load-indicator').removeClass('display')
    console.log('UxonDyncamics Twitch Extension: Is ready.')
  }

  Twitch.ext.configuration.onChanged(() => {
    const config = Twitch.ext.configuration.broadcaster
    const apiKey = config ? JSON.parse(config.content).apiKey : null
    apiKey ? init(apiKey) : configurationNeeded()
  })
})
