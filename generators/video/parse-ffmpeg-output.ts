function parseDate(outputString: string) {
  const matchArray = outputString.match(/(?<=creation_time[\s]*:\s).*/)
  return matchArray && matchArray[0]
}

function parseLatlng(outputString: string) {
  const matchArray = outputString.match(/(?<=location[\s]*:\s\+)[\d+\.]*/)
  if (!matchArray) {
    return
  }
  const [lat, lng] = matchArray[0].split('+')
  return `${lat}, ${lng.replace(/^0+/, '')}`
}

function parseDuration(outputString: string) {
  const matchArray = outputString.match(/(?<=Duration:\s).{11}/)
  return matchArray && matchArray[0]
}

function parseFfmpegOutput(outputString: string) {
  const date = parseDate(outputString)
  const latlng = parseLatlng(outputString)
  const duration = parseDuration(outputString)
  return { date, duration, latlng }
}

export { parseFfmpegOutput, parseDate, parseLatlng, parseDuration }
