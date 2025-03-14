"use strict";
const fs = require("fs");
const readline = require("readline");
const rs = fs.createReadStream("./popu-pref.csv");
const rl = readline.createInterface({
  input: rs
});
const prefectureDataMap = new Map();
rl.on("line", (lineString) => {
  // console.log(lineString);
  const columns = lineString.split(",");
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    // console.log(year);
    // console.log(prefecture);
    // console.log

    let value = null;
    if (prefectureDataMap.has(prefecture)) {
      value = prefectureDataMap.get(prefecture);
    } else {
      value = {
        popu10: 0,
        popu15: 0,
        change: null,
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on("close", () => {
  for (const [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  // console.log(prefectureDataMap);

  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair1[1].change - pair2[1].change;
  });
  // console.log(rankingArray);
  const rankingString = rankingArray.map(([key, value]) => {
    return `${key}: ${value.popu10}=>${value.popu15} 変化率 ${value.change}`;
    
  });
  console.log(rankingString);
});
