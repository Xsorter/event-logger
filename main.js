(function(){
  let data = {
    block : document.querySelector('#block'),
    eventsArray: []
  };

  
  window.onunload = () => {
    localStorage.setItem('closed', 'true');
  } 

  data.block.onclick = (event) => {
    let target = event.target;
    if(target === data.block){
      clickHandler(event);
    }
  }

  data.block.onmouseover = (event) => {
    let target = event.target;
    if(target === data.block){
      clickHandler(event);
    }
  }

  function clickHandler(el){
    let clickData = {
      type: el.type,
      timestamp: parseFloat((el.timeStamp / 1000).toFixed(2)),
      xCoord: el.x,
      yCoord: el.y,
      delta: 0
    }

    let deltaBase = data.eventsArray[data.eventsArray.length - 1];
    if(deltaBase !== undefined){
      let delta = parseFloat((clickData.timestamp - deltaBase.timestamp).toFixed(2));
      clickData["delta"] = delta; 
    }
    
    data.eventsArray.push(clickData);
    console.log(data.eventsArray); 
  }

})()