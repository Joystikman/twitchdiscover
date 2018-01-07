/*Range */

const validValues = [0,1,2,3,4,5,10,15,20,30,40,50,100,200,300,400,500,1000,1500,3000,1000000000]

function rangeSlider(){
  let range = document.getElementById('rangeViewers');
  let value = document.getElementById('nbViewers');
  let nbViewers = document.getElementById('rangeViewers').value;
  value.value = nbViewers;
  value.innerHTML = "≤ "+validValues[range.value]+" viewers";
  range.oninput = function() {
    let indice = range.value;
    value.value = validValues[indice];
    if(indice == 20){
      value.innerHTML = "Every streams";
    }
    else{
      value.innerHTML = "≤ "+validValues[indice]+" viewers";
    }
  };
};

rangeSlider();