import fetch from 'node-fetch';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const escapeCharacters = (word) => {
  const result = encodeURI(word);
  return result;
};

const YOJIJUKUGO_DATA = `
        1位 画竜点睛（がりょうてんせい）
        2位 円満具足（えんまんぐそく）
        3位 一期一会（いちごいちえ）
        4位 因果応報（いんがおうほう）
        5位 森羅万象（しんらばんしょう）
        6位 七転八起（しちてんはっき）
        7位 魑魅魍魎（ちみもうりょう）
        8位 鶏口牛後（けいこうぎゅうご）
        9位 風林火山（ふうりんかざん）
        10位 花鳥風月（かちょうふうげつ）
        11位 跳梁跋扈（ちょうりょうばっこ）
        12位 百花繚乱（ひゃっかりょうらん）
        13位 切磋琢磨（せっさたくま）
        14位 温故知新（おんこちしん）
        15位 諸行無常（しょぎょうむじょう）
        16位 不撓不屈（ふとうふくつ）
        17位 有象無象（うぞうむぞう）
        18位 朝三暮四（ちょうさんぼし）
        19位 乾坤一擲（けんこんいってき）
        20位 晴耕雨読（せいこううどく）
        21位 慇懃無礼（いんぎんぶれい）
        22位 行雲流水（こううんりゅうすい）
        23位 満身創痍（まんしんそうい）
        24位 四面楚歌（しめんそか）
        25位 一朝一夕（いっちょういっせき）
        26位 七転八倒（しちてんばっとう）
        27位 手前味噌（てまえみそ）
        28位 臥薪嘗胆（がしんしょうたん）
        29位 日進月歩（にっしんげっぽ）
        30位 明鏡止水（めいきょうしすい）
        31位 唯我独尊（ゆいがどくそん）
        32位 捲土重来（けんどちょうらい）
        33位 一蓮托生（いちれんたくしょう）
        34位 勇往邁進（ゆうおうまいしん）
        35位 一意専心（いちいせんしん）
        36位 初志貫徹（しょしかんてつ）
        37位 呉越同舟（ごえつどうしゅう）
        38位 本末転倒（ほんまつてんとう）
        39位 傍若無人（ぼうじゃくぶじん）
        40位 不易流行（ふえきりゅうこう）
        41位 阿鼻叫喚（あびきょうかん）
        42位 主客転倒（しゅかくてんとう）
        43位 天真爛漫（てんしんらんまん）
        44位 五里霧中（ごりむちゅう）
        45位 毀誉褒貶（きよほうへん）
        46位 大器晩成（たいきばんせい）
        47位 天衣無縫（てんいむほう）
        48位 泰然自若（たいぜんじじゃく）
        49位 色即是空（しきそくぜくう）
        50位 栄枯盛衰（えいこせいすい）
        51位 三位一体（さんみいったい）
        52位 猪突猛進（ちょとつもうしん）
        53位 一喜一憂（いっきいちゆう）
        54位 疑心暗鬼（ぎしんあんき）
        55位 公明正大（こうめいせいだい）
        56位 一陽来復（いちようらいふく）
        57位 試行錯誤（しこうさくご）
        58位 馬耳東風（ばじとうふう）
        59位 酔生夢死（すいせいむし）
        60位 竜頭蛇尾（りゅうとうだび）
`

const trimmedData = YOJIJUKUGO_DATA.trim();
const splitData = trimmedData.split('\n').map((line) => line.trim())

const allYojijukugo = splitData.map((data) => {
  const jukugoYomi = data.split(' ')[1];
  return {
    jukugo: jukugoYomi.substring(0, 4),
    yomi: jukugoYomi.substring(5, jukugoYomi.length - 1),
  }
})

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max)
}

export default function yojijukugo(req, res) {
  function getYomiJukugo() {
    return allYojijukugo[getRandomNumber(allYojijukugo.length)]
  }
  async function getImi(jukugo) {
    const tango = escapeCharacters(jukugo);
    const result = [];
    try {
      const response = await axios.get(`https://dictionary.goo.ne.jp/word/${tango}/`);
      const data = await response.data;
      const html = new JSDOM(data);
      const unparsedImi = html.window.document.querySelectorAll('.content-box, .contents_area, .meaning_area, .p10, .contents, .text')[0].textContent;
      const imi = unparsedImi.trim();
      result.push(imi);
    } catch (error) {
      result.push('申し訳ございませんが、この四字熟語の意味が検索できませんでした。');
      console.error(error.message);
    }
    return result[0];
  }
  async function getYojijukugo() {
    const yomiJukugo = getYomiJukugo();
    const { yomi } = yomiJukugo;
    const { jukugo } = yomiJukugo;
    const imi = await getImi(jukugo);
    const yojijukugoData = [
      { yomi },
      { jukugo },
      { imi },
    ];
    return yojijukugoData;
  }
  async function displayYojijukugo() {
    const data = await getYojijukugo();
    res.json(data);
  }
  displayYojijukugo();
}
