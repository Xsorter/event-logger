(function(){

  window.onbeforeunload = (e)=>{
    databaseSet();
    console.log('%conbeforeunload fired', 'color: green; font-size: 18px');
    if(window.event.returnValue = 'Do you really want to close the window?'){
      console.log('%cuser is trying to leave', 'color: #feb606; font-size: 18px');
    }
    console.log('%cthis is not blocked by confirm', 'color: #fb008e; font-size: 18px');
  } 

  window.onunload = () => {
    localStorage.setItem('closed', 'true');
  }

  let data = {
    block : document.querySelector('#video'),
    input: document.querySelector('#input'),
    eventTypeString: 'click mouseover play pause seeked seeking volumechange',
    database: firebase.database(),
    ticker: -1,
  };

  let statisticData = {
    uuid: userIdCheck(),
    userEvents: [],
    videoName: videoNameExtract(data.block)
  }


  init();

  function init(){
    addListenerMulti(data.block, data.eventTypeString, (e) => {eventHandler(e)});
    window.addEventListener('scroll', (e)=>{ pageScroll(e) }); 
    data.input.addEventListener('focus', (e) => { onInputFocus(e) });
  }

  function addListenerMulti(el, s, fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
  }

  function onInputFocus(e){
    let event = {
      type: 'focusOnInput',
      timestamp: timestampRound(e.timeStamp),
      videoTotalDuration: data.block.duration.toFixed(2),
      inputFocusTime: data.block.currentTime.toFixed(2),
    }
    deltaCalculation(event);
    statisticData.userEvents.push(event);
  }
  
  function videoNameExtract(video){
    let videoName = video.src.split('/')[(video.src.split('/').length) - 1];
    return videoName.substring(0, videoName.indexOf('.'));
  }

  function checkIsOutOfViewport(el) {
    let box = el.getBoundingClientRect();
    return (
      box.bottom >= 0 
    )
  }

  function pageScroll(e){
    let event = {
      type: e.type,
      timestamp: timestampRound(e.timeStamp),
      videoIsVisible: true,
    }

    if(data.ticker !== -1){
      clearTimeout(data.ticker)
    }

    data.ticker = window.setTimeout(scrollFinished, 250);

    deltaCalculation(event);

    function scrollFinished(){
      if(checkIsOutOfViewport(data.block)){
        event.videoIsVisible = true;
      }else{
        event.videoIsVisible = false;
      }
      statisticData.userEvents.push(event);
      console.log(statisticData);
    }
  }

  function databaseSet(){ 
    data.database.ref('events/' + statisticData.videoName).push(statisticData);
  }

  function timestampRound(t){
    return parseFloat((t / 1000).toFixed(2))
  }

  function deltaCalculation(eventObj){
    let deltaBase = statisticData.userEvents[statisticData.userEvents.length - 1];
    if(deltaBase !== undefined){
      let delta = parseFloat((eventObj.timestamp - deltaBase.timestamp).toFixed(2));
      eventObj["delta"] = delta; 
    }
  }

  function eventHandler(event){
    let eventData = {
      type: event.type,
      timestamp: timestampRound(event.timeStamp),
      xCoord: event.x !== undefined ? event.x : null,
      yCoord: event.x !== undefined ? event.x : null,
      delta: 0,
    }

    deltaCalculation(eventData);

    if(event.type === 'volumechange' && data.block.muted){
      eventData['muted'] = data.block.muted;
      statisticData.userEvents.push(eventData);
    }else if (event.type !== 'volumechange'){
      statisticData.userEvents.push(eventData);
    }
    console.log(statisticData.userEvents); 
    
  }

  function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function userIdCheck(){
    let id = uuidv4();
    if(localStorage.getItem('uuid') === null){
      localStorage.setItem('uuid', id);
      return id;
    }else{
      return localStorage.getItem('uuid');
    }
  }
   
})();