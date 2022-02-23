function parseDate(outputString: string) {
  return outputString.match(/(?<=creation_time\s\s\s:\s).*/)
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
  return outputString.match(/(?<=Duration:\s).{11}/)
}

function parseFfmpegOutput(outputString: string) {
  const date = parseDate(outputString)
  const latlng = parseLatlng(outputString)
  const duration = parseDuration(outputString)
  return {
    date: date && date[0],
    duration: duration && duration[0],
    latlng: latlng,
  }
}

export { parseFfmpegOutput, parseDate, parseLatlng, parseDuration }
