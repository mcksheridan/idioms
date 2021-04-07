import fetch from 'node-fetch';

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
  async function getYojijukugo() {
    const yomiJukugo = await getYomiJukugo();
    const { yomi } = yomiJukugo[0];
    const { jukugo } = yomiJukugo[1];
    let imi;
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
