
import { StepContent } from './types';

export const SCENARIO_DETAILS = {
  date: "8월 4일 목요일 오전 10:30",
  location: "우리산업(주) 제3공장",
  incident: "원인 미상의 화재 및 인명 사고 발생",
  humanDamage: "생산팀 박계장 (전치 4주 화상)",
  productionDamage: "생산 라인 중단 (4,000 unit 부족 예상)",
  deadline: "8월 12일 (납기일)",
  client: "(주)코끼리 건설",
  ceoMessage: "1시간 내로 현황 및 대응책을 작성하여 보고하시오. 뭣이 문제여? 왜 그런겨? 어떻게 할껴?"
};

// 제공된 정보 카드 이미지 전체 리스트 (72장)
const ALL_INFO_CARD_IMAGES = [
  // Group 1
  "https://i.ibb.co/xtVbbr1r/1-1.jpg", "https://i.ibb.co/ymRNcvbh/1-2.jpg", "https://i.ibb.co/TBrSLsZq/1-3.jpg",
  "https://i.ibb.co/4RFt7W5g/1-4.jpg", "https://i.ibb.co/wFWGqbKr/1-5.jpg", "https://i.ibb.co/rRz8PcLZ/1-6.jpg",
  "https://i.ibb.co/yBKkH1xt/1-7.jpg", "https://i.ibb.co/3yNDjQZh/1-8.jpg", "https://i.ibb.co/Z6FCK3nM/1-9.jpg",
  "https://i.ibb.co/fVW1frCN/1-10.jpg", "https://i.ibb.co/vxK6HQrT/1-11.jpg", "https://i.ibb.co/7xK7vWsT/1-12.jpg",
  "https://i.ibb.co/LXmKvDNh/1-13.jpg", "https://i.ibb.co/bMJnZC3S/1-14.jpg", "https://i.ibb.co/5gQqKKDZ/1-15.jpg",
  "https://i.ibb.co/JWknnX40/1-16.jpg", "https://i.ibb.co/KzyMWypP/1-17.jpg", "https://i.ibb.co/VWN42Sqc/1-18.jpg",
  // Group 2
  "https://i.ibb.co/Xxr8kGFz/2-1.png", "https://i.ibb.co/vvKLbsDW/2-2.png", "https://i.ibb.co/GfbKDQ9N/2-3.png",
  "https://i.ibb.co/TxvZBWTh/2-4.png", "https://i.ibb.co/C3y6SZyD/2-5.png", "https://i.ibb.co/tPptp82F/2-6.png",
  "https://i.ibb.co/4qdvzfw/2-7.png", "https://i.ibb.co/3mJY6wDj/2-8.png", "https://i.ibb.co/vvr2wcWs/2-9.png",
  "https://i.ibb.co/Y7h5T8B2/2-10.png", "https://i.ibb.co/YGQysZD/2-11.png", "https://i.ibb.co/4R33TmnV/2-12.png",
  "https://i.ibb.co/8DsgjyH9/2-13.png", "https://i.ibb.co/gMpb2zWx/2-14.png", "https://i.ibb.co/PsdHMz44/2-15.png",
  "https://i.ibb.co/3yJMM93h/2-16.png", "https://i.ibb.co/bT7wGnW/2-17.png", "https://i.ibb.co/B5ZzGNdn/2-18.png",
  // Group 3
  "https://i.ibb.co/FLzgXBDc/3-1.jpg", "https://i.ibb.co/ZbXwMkX/3-2.jpg", "https://i.ibb.co/gb8TdqCz/3-3.jpg",
  "https://i.ibb.co/Mywkm26H/3-4.jpg", "https://i.ibb.co/spgPX41z/3-5.jpg", "https://i.ibb.co/cSpnsmqg/3-6.jpg",
  "https://i.ibb.co/Z6GL6h7T/3-7.jpg", "https://i.ibb.co/VYQt245P/3-8.jpg", "https://i.ibb.co/n88f9dQf/3-9.jpg",
  "https://i.ibb.co/zTR4Kv0s/3-10.jpg", "https://i.ibb.co/ZR22RyXg/3-11.jpg", "https://i.ibb.co/PGKrNv0v/3-12.jpg",
  "https://i.ibb.co/MyfK6MNn/3-13.jpg", "https://i.ibb.co/BKVQYRVS/3-14.jpg", "https://i.ibb.co/Y7wSGbrS/3-15.jpg",
  "https://i.ibb.co/Tx31BJWq/3-16.jpg", "https://i.ibb.co/NgCm4Bbv/3-17.jpg", "https://i.ibb.co/Y7BnGjtK/3-18.jpg",
  // Group 4
  "https://i.ibb.co/6501PHF/4-1.png", "https://i.ibb.co/Kp8sbZYF/4-2.png", "https://i.ibb.co/XZcsc8qc/4-3.png",
  "https://i.ibb.co/KxkwCwb0/4-4.png", "https://i.ibb.co/yFF8Zmbz/4-5.png", "https://i.ibb.co/nqDYc1GN/4-6.png",
  "https://i.ibb.co/R4NhQ7Gs/4-7.png", "https://i.ibb.co/nMsJy9TS/4-8.png", "https://i.ibb.co/YTJVNVVc/4-9.png",
  "https://i.ibb.co/S4zdtsKX/4-10.png", "https://i.ibb.co/23fCDk7s/4-11.png", "https://i.ibb.co/hP316DK/4-12.png",
  "https://i.ibb.co/TxM4784Y/4-13.png", "https://i.ibb.co/N5QhsZT/4-14.png", "https://i.ibb.co/20KVXQWr/4-15.png",
  "https://i.ibb.co/wN1KftHY/4-16.png", "https://i.ibb.co/ccBGmLSY/4-17.png", "https://i.ibb.co/pg1x953/4-18.png"
];

/**
 * 총 팀 수에 맞춰 이미지를 균등 분배하여 해당 팀(teamId)의 이미지를 반환
 * @param teamId 현재 팀 번호 (1-based)
 * @param totalTeams 전체 팀 수 (1 ~ 12)
 */
export const getImagesForTeam = (teamId: number, totalTeams: number): string[] => {
  const totalImages = ALL_INFO_CARD_IMAGES.length;
  // 팀당 가져갈 이미지 수 (나머지는 버림 - 72장은 12의 배수이므로 나머지가 없음)
  // 예: 12개조 -> 6장씩, 6개조 -> 12장씩, 1개조 -> 72장
  const imagesPerTeam = Math.floor(totalImages / totalTeams);
  
  const startIndex = (teamId - 1) * imagesPerTeam;
  const endIndex = startIndex + imagesPerTeam;
  
  return ALL_INFO_CARD_IMAGES.slice(startIndex, endIndex);
};

export const STEPS: StepContent[] = [
  { 
    id: 'intro', 
    title: '시나리오 브리핑', 
    shortTitle: '브리핑', 
    description: '긴급 상황 발생 및 CEO 지시사항 확인',
    goal: '위기 상황의 심각성을 인지하고 해결해야 할 과제를 파악한다.',
    guide: '아래 발생 개요와 CEO의 지시사항을 꼼꼼히 읽고, 앞으로 해결해야 할 미션을 확인하세요.'
  },
  { 
    id: 'fact-finding', 
    title: '1단계: 현상 파악', 
    shortTitle: '현상파악', 
    description: 'Fact Base 사고로 현장 정보 수집',
    goal: '추측을 배제하고 객관적인 사실(Fact)만을 수집하여 상황을 정확히 재구성한다.',
    guide: '제공된 [사고 일지]와 [관계자 인터뷰]를 참고하여 확인된 사실만 기록하세요.',
    contextData: [
      {
        type: 'report',
        source: '보안팀 사고 일지',
        content: '10:30경 제3공장 배전반에서 스파크 발생 후 화재 확산. 당시 가동 중이던 장비: A-Pro 2대, B-Pro 4대. 초기 진화 실패.'
      },
      {
        type: 'interview',
        source: '생산팀 김대리 인터뷰',
        content: "원래 A-Pro 장비는 1대만 돌리는데, 이번에 급한 물량 때문에 2대를 동시에 풀가동했어요. 박계장님이 '차단기가 자꾸 내려가네' 하면서 배전반을 확인하러 갔다가 변을 당하셨습니다."
      }
    ]
  },
  { 
    id: 'problem-definition', 
    title: '2단계: 문제 정의', 
    shortTitle: '문제정의', 
    description: '해결해야 할 핵심 문제 명확화',
    goal: '현상(As-Is)과 목표(To-Be)의 차이(Gap)를 분석하여 해결해야 할 문제를 구체적으로 정의한다.',
    guide: '인명 피해와 생산 차질 두 가지 측면에서 "무엇이 문제인가"를 한 문장으로 정의해보세요.',
    contextData: [
      {
        type: 'email',
        source: '영업팀 긴급 메일',
        content: "수신: 생산관리팀\n제목: 코끼리 건설 납기 관련\n\n8/12 납기일까지 10,000 unit 필수입니다. 현재 재고 제외하고 4,000 unit이 부족한 상황입니다. 지연 시 위약금 및 신뢰도 하락이 우려됩니다."
      }
    ]
  },
  { 
    id: 'root-cause', 
    title: '3단계: 원인 분석', 
    shortTitle: '원인분석', 
    description: '5 Why & Logic Tree로 근본 원인 도출',
    goal: '표면적 원인이 아닌 근본 원인(Root Cause)을 찾아 재발을 방지할 수 있는 단서를 찾는다.',
    guide: '"왜 화재가 발생했는가?"에서 시작하여 5번의 "왜?"를 질문하며 근본적인 원인을 파고드세요.',
    contextData: [
      {
        type: 'report',
        source: '시설관리팀 점검 내역',
        content: '제3공장 적정 용량: 15,000W. \n사고 당일 추정 부하: 16,500W (과부하). \n차단기 노후화로 인해 과전류 차단 실패 추정. 소화기 3대 중 2대 압력 미달로 작동 불능 확인.'
      }
    ]
  },
  { 
    id: 'solution', 
    title: '4단계: 해결안 도출', 
    shortTitle: '해결안', 
    description: 'Downstream(대응) & Upstream(예방) 전략 수립',
    goal: '당장의 문제를 해결하는 대책과, 같은 문제가 반복되지 않게 하는 근본 대책을 수립한다.',
    guide: '즉각적인 생산 차질 해결 방안(Downstream)과 설비/프로세스 개선 방안(Upstream)을 구분하여 제안하세요.'
  },
  { 
    id: 'report', 
    title: '5단계: 최종 보고', 
    shortTitle: '보고서', 
    description: 'CEO 대상 최종 결과 보고',
    goal: '논리적이고 설득력 있는 보고서를 작성하여 의사결정권자에게 보고한다.',
    guide: '작성된 내용을 바탕으로 최종 보고서가 생성됩니다. 내용을 점검하고 제출하세요.'
  },
];

export const INITIAL_TIME = 60 * 60; // 1 Hour
