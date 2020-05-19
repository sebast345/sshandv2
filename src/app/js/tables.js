var selectBtn = document.getElementsByClassName("selectmsg-btn");
var star = document.getElementsByClassName("opened");
function waitForData(){
    setTimeout(() => {
        if(selectBtn.length > 0){
            setListeners();
        }else{
            waitForData();
        }
    }, 1000);
    
}

function setListeners(){
    var text;
    for(var i=0;i<selectBtn.length;i++){
        selectBtn[i].addEventListener("click", function(){
            this.classList.toggle("selectedmsg"); 
        })
    }
    for(var i=0;i<star.length;i++){
        if(star[i].innerHTML == "0"){
            star[i].innerHTML = "<img class='star' src='../../../../assets/img/star.svg'/>";
        
        }else{
            star[i].innerHTML = "";
        }
    }
}


waitForData();


