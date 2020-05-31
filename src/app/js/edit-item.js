var deleteImg = document.getElementsByClassName("image-to-delete");
var mainImg = document.getElementsByClassName("image-to-main");
var itemPhotos = document.getElementById("item-photos");

function waitForData(){
    setTimeout(() => {
        itemPhotos = document.getElementById("item-photos");
        if(itemPhotos != null){
            setListeners();
        }else{
            waitForData();
        }
    }, 1000);
    
}

function setListeners(){
    for(var i=0;i<deleteImg.length;i++){
        deleteImg[i].addEventListener("click", function(){
            this.classList.toggle("selected-to-delete"); 
        })
    }
    for(var i=0;i<mainImg.length;i++){
        mainImg[i].addEventListener("click", function(){
            for(var j=0;j<mainImg.length;j++){
                if(this.classList.contains("selected-to-main")){
                    this.classList.toggle("selected-to-main"); 
                }
            }
            this.classList.toggle("selected-to-main"); 
        })
    }
}

if(window.location.href.substring(0,31) == "http://localhost:4200/edit-item") waitForData();