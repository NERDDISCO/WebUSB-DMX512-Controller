export default class WebUsbDmx512Controller {
  constructor(args) {
    this.device = null
  }

  /*
   * Enable WebUSB, which has to be triggered by a user gesture
   * When the device was selected, try to create a connection to the device
   */
  enable() {
    // Only request the port for specific devices
    const filters = [
      // Arduino LLC (10755), Leonardo ETH (32832)
      { vendorId: 0x2a03, productId: 0x8040 }
    ]

    // Request access to the USB device
    navigator.usb.requestDevice({ filters })
      // Open session to selected USB device
      .then(selectedDevice => {
        this.device = selectedDevice

        // Open connection
        return this.device.open()
      })

      // Select #1 configuration if not automatially set by OS
      .then(() => {
        if (this.device.configuration === null) {
          return this.device.selectConfiguration(1)
        }
      })

      // Get exclusive access to the #2 interface
      .then(() => this.device.claimInterface(2))

      // Tell the USB device that we are ready to send data
      .then(() => this.device.controlTransferOut({
          // It's a USB class request
          'requestType': 'class',
          // The destination of this request is the interface
          'recipient': 'interface',
          // CDC: Communication Device Class
          // 0x22: SET_CONTROL_LINE_STATE
          // RS-232 signal used to tell the USB device that the computer is now present.
          'request': 0x22,
          // Yes
          'value': 0x01,
          // Interface #2
          'index': 0x02
        })
      )

      .catch(error => console.log(error))
  }

  /*
   * Send data to the USB device
   */
  send(data) {
    // Create array with 512 x 0 and then concat with the data
    const universe = data.concat(new Array(512).fill(0).slice(data.length, 512))

    // Create an ArrayBuffer, because that is needed for WebUSB
    const buffer = Uint8Array.from(universe)

    // Send data on Endpoint #4
    return this.device.transferOut(4, buffer)
  }

  /*
   * Disconnect from the USB device
   */
  disconnect() {
    // Declare that we don't want to receive data anymore
    return this.device.controlTransferOut({
        // It's a USB class request
        'requestType': 'class',
        // The destination of this request is the interface
        'recipient': 'interface',
        // CDC: Communication Device Class
        // 0x22: SET_CONTROL_LINE_STATE
        // RS-232 signal used to tell the USB device that the computer is now present.
        'request': 0x22,
        // No
        'value': 0x01,
        // Interface #2
        'index': 0x02
      })
    )

    // Close the connection to the USB device
    .then(() => this.device.close())
  }
}
