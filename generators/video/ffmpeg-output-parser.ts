function parseDate(outputString: string) {
  return outputString.match(/(?<=creation_time\s\s\s:\s).*/)
}

function parseLatlng(outputString: string) {
  return outputString.match(/(?<=location\s\s\s\s\s\s\s\s:\s\+).{16}/)
}

function parseDuration(outputString: string) {
  return outputString.match(/(?<=Duration:\s).{11}/)
}

function parseFfmpegOutput(outputString: string) {
  const date = parseDate(outputString)
  const latlng = parseLatlng(outputString)
  const duration = parseDuration(outputString)
  // Hacky way to trim longitude's leading zero
  const splitter = latlng && latlng[0].match(/\+0/) ? '+0' : '0'
  return {
    date: date && date[0],
    duration: duration && duration[0],
    latlng: latlng && latlng[0].split(splitter).join(', '),
  }
}

export { parseFfmpegOutput, parseDate, parseLatlng, parseDuration }
