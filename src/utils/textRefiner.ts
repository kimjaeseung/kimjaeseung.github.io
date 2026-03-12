/**
 * 원문을 자서전 문체로 변환 (데모용 규칙 기반)
 */
export function refineText(rawText: string, _questionContext?: string): string {
  const refinements: Record<string, string> = {
    할머니: '할머니의 손길',
    엄마: '어머니',
    아빠: '아버지',
    맨날: '늘',
    진짜: '정말로',
    걍: '그저',
    'ㅋㅋ': '',
    'ㅎㅎ': '',
    '요.': '었다.',
  }

  let refined = rawText
  Object.entries(refinements).forEach(([from, to]) => {
    refined = refined.split(from).join(to)
  })

  const intros = [
    '그 시절을 떠올리면,',
    '기억의 한 켠에는 언제나',
    '시간이 지나도 변하지 않는 것이 있다면,',
    '어린 날의 풍경 속에서',
    '인생이라는 긴 여정 위에서',
  ]
  const randomIntro = intros[Math.floor(Math.random() * intros.length)]
  return `${randomIntro} ${refined}`
}
