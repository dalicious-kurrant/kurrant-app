/**
 *
 * @param {number} data
 */
export function formattedMealFoodStatus(data) {
  switch (data) {
    case 1:
      return '문의중';
    case 2:
      return '처리중';
    case 3:
      return '결제대기중';
    case 4:
      return '주문실패';
    case 5:
      return '결제완료';
    case 6:
      return '상품준비중';
    case 7:
      return '취소';
    case 8:
      return '취소대기';
    case 9:
      return '배송중';
    case 10:
      return '배송완료';
    case 11:
      return '수령완료';
    case 12:
      return '수동 환불';
    case 13:
      return '자동 환불';
    case 14:
      return '리뷰 작성 완료';
    default:
      break;
  }
}
export const foodCompleteStatusData = [
  {
    key: '판매대기',
    text: '판매대기',
    value: 0,
  },
  {
    key: '판매중',
    text: '판매중',
    value: 1,
  },
  {
    key: '품절',
    text: '품절',
    value: 2,
  },
  {
    key: '취소불가품',
    text: '취소불가품',
    value: 3,
  },
  {
    key: '판매중지',
    text: '판매중지',
    value: 4,
  },
  {
    key: '등록대기',
    text: '등록대기',
    value: 5,
  },
  {
    key: '주문마감',
    text: '주문마감',
    value: 6,
  },
];

export function formattedDailyFoodStatus(data) {
  switch (data) {
    case 0:
      return '판매대기';
    case 1:
      return '판매중';
    case 2:
      return '품절';
    case 3:
      return '취소불가품';
    case 4:
      return '판매중지';
    case 5:
      return '등록대기';
    case 6:
      return '주문마감';
    default:
      break;
  }
}
export function formattedCatorFoodStatus(data) {
  switch (data) {
    case 1:
      return '문의중';
    case 2:
      return '처리중';
    case 3:
      return '결제대기중';
    case 4:
      return '주문실패';
    case 5:
      return '결제완료';
    case 6:
      return '상품준비중';
    case 7:
      return '주문취소';
    case 8:
      return '배송중';
    case 9:
      return '진행완료';
    case 10:
      return '환불';
    case 11:
      return '환불';
    default:
      break;
  }
}
export function formattedCardCode(data) {
  switch (data) {
    case 51:
      return '삼성카드';
    case 33:
      return '우리카드';
    case 41:
      return '신한카드';
    case 61:
      return '현대카드';
    case 11:
      return 'KB국민카드';
    case 71:
      return '롯데카드';
    case 91:
      return 'NH농협카드';
    case 31:
      return '비씨카드';
    case 21:
      return '하나카드';
    case 36:
      return '씨티카드';
    case 15:
      return '카카오뱅크카드';
    default:
      break;
  }
}
export function formattedLogin(data) {
  switch (data) {
    case 'GOOGLE':
      return '구글 로그인';
    case 'APPLE':
      return '애플 로그인';
    case 'NAVER':
      return '네이버 로그인';
    case 'FACEBOOK':
      return '페이스북 로그인';
    case 'KAKAO':
      return '카카오 로그인';
    default:
      return data;
  }
}

export const cardListData = [
  {id: '01', text: '비씨', value: '01'},
  // {id: '02', text: '국민', value: '02'},
  // {id: '03', text: '하나', value: '03'},
  {id: '04', text: '삼성', value: '04'},
  {id: '06', text: '신한', value: '06'},
  {id: '07', text: '현대드', value: '07'},
  // {id: '08', text: '롯데', value: '08'},
  {id: '11', text: '시티', value: '11'},
  {id: '12', text: 'NH농협', value: '12'},
  {id: '13', text: '수협', value: '13'},
  {id: '15', text: '우리', value: '15'},
  {id: '21', text: '광주', value: '21'},
  {id: '22', text: '전북', value: '22'},
  {id: '23', text: '제주', value: '23'},
  // {id: '25', text: '해외비자', value: '25'},
  // {id: '26', text: '해외마스터', value: '26'},
  // {id: '27', text: '해외다이너스', value: '27'},
  // {id: '28', text: '해외AMAX', value: '28'},
  // {id: '29', text: '해외JCB', value: '29'},
  // {id: '30', text: '해외', value: '30'},
  {id: '32', text: '우체국', value: '32'},
  {id: '33', text: 'MG새마을체크드', value: '33'},
  // {id: '34', text: '중국은행체크', value: '34'},
  // {id: '38', text: '은련', value: '38'},
  {id: '41', text: '신협', value: '41'},
  {id: '42', text: '저축은행', value: '42'},
  // {id: '43', text: 'KDB산업', value: '43'},
  // {id: '44', text: '카카오뱅크', value: '44'},
  {id: '45', text: '케이뱅크', value: '45'},
  // {id: '46', text: '카카오머니', value: '46'},
  // {id: '47', text: 'SSG머니', value: '47'},
];

export function formattedBoardOptionStatus(data) {
  if (data.length === 1 && data[0] === 0) {
    return '[공지] ';
  } else if (
    data.length === 2 &&
    (data[0] === 1 || data[0] === 2) &&
    (data[1] === 1 || data[1] === 2)
  ) {
    return '[이벤트] ';
  } else if (data.length === 1 && data[0] === 2) {
    return '[이벤트] ';
  } else {
    return '';
  }
}
