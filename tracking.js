/* global cv */
/* exported onOpenCvReady */

const onOpenCvReady = () => {
  let ws = new WebSocket('ws://rosa.local:5678')

  ws.onmessage = msg => {
    let reader = new FileReader()
    reader.addEventListener('loadend', () => {
      let data = new Uint8Array(reader.result)
      let mat = cv.matFromArray(144, 176, cv.CV_8UC3, data)

      let center = trackBall(mat)
      if (center !== undefined) {
        cv.circle(mat, center, 5, [255, 0, 0, 255], -1)
      }

      cv.imshow('imageCanvas', mat)

      mat.delete()
    })
    reader.readAsArrayBuffer(msg.data)
  }
}

let trackBall = img => {
  let mask = new cv.Mat()
  let lower = new cv.Mat(img.rows, img.cols, img.type(), [150, 125, 0, 0])
  let upper = new cv.Mat(img.rows, img.cols, img.type(), [255, 255, 100, 255])

  cv.inRange(img, lower, upper, mask)

  let M = cv.Mat.ones(5, 5, cv.CV_8U)
  cv.erode(mask, mask, M)
  cv.dilate(mask, mask, M)

  let m = cv.moments(mask)

  M.delete()
  mask.delete()
  lower.delete()
  upper.delete()


  if (m.m00 > 100000) {
    let center = {
      x: Math.round(m.m10 / m.m00),
      y: Math.round(m.m01 / m.m00)
    }
    return center
  }
}
