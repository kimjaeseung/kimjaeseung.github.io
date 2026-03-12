export interface Question {
  id: number
  chapter: string
  question: string
  followUp: (answer: string) => string
}

export const questions: Question[] = [
  {
    id: 1,
    chapter: '어린 시절',
    question: '어린 시절 가장 기억에 남는 장소는 어디인가요?',
    followUp: (answer) =>
      `"${answer.slice(0, 10)}..." 정말 특별한 곳이네요. 그곳에서 가장 선명하게 떠오르는 순간은 언제인가요?`,
  },
  {
    id: 2,
    chapter: '어린 시절',
    question: '어린 시절 당신에게 가장 큰 영향을 준 사람은 누구인가요?',
    followUp: () =>
      `그분과의 추억 중 지금도 마음이 따뜻해지는 에피소드가 있다면 들려주세요.`,
  },
  {
    id: 3,
    chapter: '어린 시절',
    question: '초등학교 시절, 가장 좋아했던 일은 무엇이었나요?',
    followUp: () =>
      `그때의 그 즐거움이 지금의 당신에게도 이어지고 있나요?`,
  },
  {
    id: 4,
    chapter: '청소년기',
    question: '10대 시절, 당신의 꿈은 무엇이었나요?',
    followUp: () =>
      `그 꿈을 꾸게 된 특별한 계기가 있었나요?`,
  },
  {
    id: 5,
    chapter: '청소년기',
    question: '학창 시절 가장 힘들었던 순간은 언제였나요?',
    followUp: () =>
      `그 시간을 어떻게 견뎌냈는지, 지금의 당신이 그때의 자신에게 해주고 싶은 말이 있나요?`,
  },
  {
    id: 6,
    chapter: '성인기',
    question: '인생에서 가장 중요한 선택의 순간은 언제였나요?',
    followUp: () =>
      `그 선택을 하기까지 어떤 고민이 있었나요?`,
  },
  {
    id: 7,
    chapter: '성인기',
    question: '당신의 인생에서 가장 자랑스러운 성취는 무엇인가요?',
    followUp: () =>
      `그 순간을 함께 나눈 사람이 있다면, 누구인가요?`,
  },
  {
    id: 8,
    chapter: '현재와 미래',
    question: '100년 후 후손들에게 꼭 전하고 싶은 한마디가 있다면?',
    followUp: () =>
      `아름다운 메시지입니다. 이것으로 당신의 첫 번째 이야기가 완성되었습니다.`,
  },
]
