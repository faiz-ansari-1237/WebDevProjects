var fullbody = document.getElementById("fullbody");
function jump(){
    if(fullbody.classList == "animate"){return}
    fullbody.classList.add("animate");
    setTimeout(function(){
        fullbody.classList.remove("animate");
    },300);
}