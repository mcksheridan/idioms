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
}
