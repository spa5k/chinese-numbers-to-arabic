import { toInteger } from "../src/modules";

const ToIntegerTests = [
  { before: "345", after: 345 },
  { before: "345 abc", after: 345 },
  { before: "一", after: 1 },
  { before: "兩百四十五", after: 245 },
  { before: "二十二", after: 22 },
  { before: "二万五千", after: 25_000 },
  { before: "二万二千", after: 22_000 },
  { before: "8千3", after: 8300 },
  { before: "345 萬", after: 3_450_000 },
  { before: "345萬", after: 3_450_000 },
  { before: "3.5萬", after: 35_000 },
  { before: "3萬5", after: 35_000 },
  { before: "五萬", after: 50_000 },
  { before: " 二千零一十二", after: 2012 },
  { before: "***貳佰零伍元***", after: 205 },
  { before: "1000 and one", after: 1000 },
  { before: "haha no numbers here", after: 0 },
  { before: "九龍", after: 9 },
  { before: "2千萬", after: 20_000_000 },
  { before: "二千万零五千", after: 20_005_000 },
  { before: "一千萬", after: 10_000_000 },
  { before: "1000萬", after: 10_000_000 },
  { before: "8千4百萬", after: 84_000_000 },
  { before: "8千3萬", after: 83_000_000 },
  { before: "一万五千", after: 15_000 },
  { before: "一百六十八萬", after: 1_680_000 },
  { before: "一百六十八万五千", after: 1_685_000 },
  { before: "一百六十八萬六千", after: 1_686_000 },
  { before: "一百六十八万五千二百四十五", after: 1_685_245 },
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  { before: "3.1323445124421445642", after: 3.132_344_512_442_144_564_2 },
  // { before: '2億5', after: 250000000 }, // fail, 200000005
];

describe("To Integer", () => {
  ToIntegerTests.forEach((i, index) => {
    test(`to int ${index + 1}`, () => {
      expect(toInteger(i.before)).toBe(i.after);
    });
  });
});
// 7, 20, 25, 27, 28
