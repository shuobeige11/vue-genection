export default (Year, Month) => {
  if (Month == 4 || Month == 6 || Month == 9 || Month == 11) {
    return 30
  } else if (Month == 2) {
    if (isYear(Year)) {
        return 29
    } else {
        return 28
    }
  } else {
    return 31
  }
}

function isYear (Year) {
  if (((Year % 4) === 0) && ((Year % 100) !== 0) || ((Year % 400) === 0)) {
    return true
  } else {
    return false
  }
}