module.exports.getBoardName = domain => {
  let name = ''
  switch (domain) {
    case 'best':
      name = 'HIT'
      break
    case 'all':
      name = '전체글'
      break
    case 'talk':
      name = 'TALK'
      break
    case 'anime':
      name = '애니동'
      break
    case 'notice':
      name = '공지사항'
      break
  }
  return name
}