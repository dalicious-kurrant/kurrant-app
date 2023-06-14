import {
  calcTimeBetweenTwoDates,
  toStringByFormatting,
} from '../../../../../utils/dateFormatter';
import {extractMonthAndDateFromDate2} from '../logic';

export const sampleStackedBarData1 = [
  {
    date: '2023-06-12',
    calorie: 100,
    protein: 90,
    fat: 0,
    carbohydrate: 40,
  },
  {
    date: '2023-06-13',
    calorie: 150,
    protein: 100,
    fat: 50,
    carbohydrate: 40,
  },
  {
    date: '2023-06-14',
    calorie: 50,
    protein: 100,
    fat: 50,
    carbohydrate: 40,
  },
  {
    date: '2023-06-15',
    calorie: 150,
    protein: 100,
    fat: 50,
    carbohydrate: 40,
  },
  {
    date: '2023-06-16',
    calorie: 50,
    protein: 100,
    fat: 50,
    carbohydrate: 40,
  },
  {
    date: '2023-06-17',
    calorie: 120,
    protein: 100,
    fat: 50,
    carbohydrate: 40,
  },
  {
    date: '2023-06-18',
    calorie: 150,
    protein: 100,
    fat: 50,
    carbohydrate: 40,
  },
];

export const modifyStackedBarData = inputData => {
  console.log('가가가가ㅏ가가가가ㅏ가가가ㅏㄱ');
  console.log(inputData);

  return inputData.map(v => {
    return {
      x: `${extractMonthAndDateFromDate2(v.eatDate, '-')[1]}일`,
      ...v,
    };
  });
};

export const modifyHistoryLineChartData = inputData =>
  inputData.map(v => {
    return {
      x: `${extractMonthAndDateFromDate2(v.eatDate, '-')[1]}일`,
      y: v.calorie,
    };
  });

// 서버 데이터랑, week 랑

export const modifyHistoryList = (data, week) => {
  // data가 없을 경우 week 날짜 입력
  if (!Array.isArray(data) || data.length <= 0) {
    return week.map(vWeek => {
      return {
        eatDate: toStringByFormatting(vWeek),
        calorie: 0,
        protein: 0,
        fat: 0,
        carbohydrate: 0,
      };
    });
  } else {
    // 일주일로 만들기

    let arr = [];

    week.map(vWeek => {
      if (
        data.map(vData => vData.eatDate).includes(toStringByFormatting(vWeek))
      ) {
        arr.push(
          data.find(vData => vData.eatDate === toStringByFormatting(vWeek)),
        );
      } else {
        arr.push({
          eatDate: toStringByFormatting(vWeek),
          calorie: 0,
          protein: 0,
          fat: 0,
          carbohydrate: 0,
        });
      }
    });

    return arr;
  }
};
