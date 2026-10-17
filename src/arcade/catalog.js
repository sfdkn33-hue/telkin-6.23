(()=>{
  const T=(k,f)=>window.TELKIN_I18N?.t(k,f)||f||k;
  const base={
    'REFLEKS':{icon:'◎',genreKey:'reaction',controlKey:'touch',accent:'#ff57dc'},
    'YILAN':{icon:'▦',genreKey:'route',controlKey:'swipe',accent:'#63f59a'},
    'HAFIZA':{icon:'◆',genreKey:'memory',controlKey:'touch',accent:'#8dc7ff'},
    'RAKET':{icon:'▯',genreKey:'arcade',controlKey:'drag',accent:'#70e8ff'},
    'KAÇIŞ':{icon:'▲',genreKey:'reflex',controlKey:'drag',accent:'#ff6f79'},
    'KATMAN KIR':{icon:'▤',genreKey:'arcade',controlKey:'drag',accent:'#ffd76a'},
    'METEOR':{icon:'✦',genreKey:'action',controlKey:'drag',accent:'#ff8b66'},
    'SATRANÇ':{icon:'♞',genreKey:'tactics',controlKey:'touch',accent:'#d6c2ff'},
    'TAVLA':{icon:'⚄',genreKey:'tactics',controlKey:'touch',accent:'#e2b477'},
    'TAŞ STRATEJİ':{icon:'●',genreKey:'strategy',controlKey:'touch',accent:'#f0d48a'},
    'LABİRENT':{icon:'⌁',genreKey:'explore',controlKey:'swipe',accent:'#73e1c2'},
    '2048':{icon:'²',genreKey:'number',controlKey:'swipe',accent:'#ffd06b'},
    'KUTU İT':{icon:'□',genreKey:'puzzle',controlKey:'swipe',accent:'#8ed0ff'},
    'KOD KIR':{icon:'••',genreKey:'logic',controlKey:'touch',accent:'#c99bff'}
  };
  const pool=['REFLEKS','YILAN','HAFIZA','RAKET','KAÇIŞ','KATMAN KIR','METEOR','LABİRENT','2048','KUTU İT','KOD KIR'];
  function localized(type){const m=base[type]||{icon:'◆',genreKey:'arcade',controlKey:'touch',accent:'#bd5cff'};return{...m,name:T(`arcade.game.${type}.name`,type),genre:T(`arcade.genre.${m.genreKey}`,'ARCADE'),brief:T(`arcade.game.${type}.brief`,T('arcade.defaultBrief','Mini oyunu tamamla.')),control:T(`arcade.control.${m.controlKey}`,'DOKUN')};}
  window.TELKIN_ARCADE_CATALOG=Object.freeze(base);
  window.TELKIN_ARCADE_POOL=Object.freeze(pool);
  window.telkinArcadeMeta=localized;
  window.addEventListener('telkin:languagechange',()=>window.dispatchEvent(new CustomEvent('telkin:arcade-language-refresh')));
})();
