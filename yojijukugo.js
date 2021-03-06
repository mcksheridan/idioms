import fetch from 'node-fetch';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const escapeCharacters = (word) => {
  const result = encodeURI(word);
  return result;
};

export default function yojijukugo(req, res) {
  async function getYomiJukugo() {
    const response = await fetch('https://corsservice.appspot.com/yojijukugo/api/');
    const data = await response.json();
    const { yomi } = data;
    const { jukugo } = data;
    const yomiJukugo = [
      { yomi },
      { jukugo },
    ];
    return yomiJukugo;
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
    const yomiJukugo = await getYomiJukugo();
    const { yomi } = yomiJukugo[0];
    const { jukugo } = yomiJukugo[1];
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
