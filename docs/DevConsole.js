export default class DevConsole {
  constructor() {
    this.output = document.getElementById('console')
  }

  log(message, data, type) {
    let fullMessage = ''

    switch (type) {
      case 'USBDevice':
        fullMessage = `${message}: ${data}`
        break

      case 'array':
        fullMessage = message + ' ' + JSON.stringify(data)
        break

      case 'keyvalue':
        fullMessage = `${message}: ${data}`
        break

      default:
        fullMessage = message + ' ' + data
    }

    console.log(fullMessage)

    let elem = document.createElement('span')
    elem.innerHTML = fullMessage
    this.output.appendChild(elem)
  }

}
