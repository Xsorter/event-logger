(function(){

  //TODO user unique id (session id);
  //TODO event from focus first input + duration video time

  window.onbeforeunload = (e)=>{
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
    eventTypeString: 'click mouseover play pause seeked seeking volumechange',
    ticker: -1
  };

  let statisticData = {
    uuid: userIdCheck(),
    userEvents: [],
    outOfViewPortEvents: []
  }

  init();

  function init(){
    addListenerMulti(data.block, data.eventTypeString, (e) => {eventHandler(e)});
    window.addEventListener('scroll', (e)=>{ pageScroll(e) }); 
  }

  function addListenerMulti(el, s, fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
  }

  

  function checkIsOutOfViewport(el) {
    let box = el.getBoundingClientRect();
    return (
      box.bottom >= 0 
    )
  }

  function pageScroll(e){
    let visibility = {
      isVisible: true,
      timeStamp: timestampRound(e.timeStamp)
    }

    if(data.ticker !== -1){
      clearTimeout(data.ticker)
    }

    data.ticker = window.setTimeout(scrollFinished, 250);

    function scrollFinished(){
      if(checkIsOutOfViewport(data.block)){
        console.log('is visible, timestamp: '+ timestampRound(e.timeStamp));
        visibility.isVisible = true;
      }else{
        console.log('is not visible, timestamp: '+ timestampRound(e.timeStamp));
        visibility.isVisible = false;
      }
      statisticData.outOfViewPortEvents.push(visibility);
      console.log(statisticData)
    }
  }

  function timestampRound(t){
    return parseFloat((t / 1000).toFixed(2))
  }

  function eventHandler(event){
    let eventData = {
      type: event.type,
      timestamp: timestampRound(event.timeStamp),
      xCoord: event.x !== undefined ? event.x : null,
      yCoord: event.x !== undefined ? event.x : null,
      delta: 0,
    }

    if(event.type === 'volumechange'){
      eventData['volume'] = data.block.volume;
      eventData['muted'] = data.block.muted;
    }

    let deltaBase = statisticData.userEvents[statisticData.userEvents.length - 1];
    if(deltaBase !== undefined){
      let delta = parseFloat((eventData.timestamp - deltaBase.timestamp).toFixed(2));
      eventData["delta"] = delta; 
    }
    
    statisticData.userEvents.push(eventData);
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