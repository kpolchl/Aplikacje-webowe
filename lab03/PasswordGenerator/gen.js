const form = document.getElementById("myForm");

form.addEventListener("submit", function(event) {
event.preventDefault(); 
const formData = new FormData(form);

const minSize = parseInt(formData.get("minsize"));
const maxSize = parseInt(formData.get("maxsize"));
const capital = formData.get("capital") !== null;
const special = formData.get("special") !== null;
const digits = formData.get("digits") !== null;

if(minSize>=maxSize){
    alert("Błędna długość");
    return;
}

const password = generatePassword(minSize,maxSize,digits,capital,special);
alert(password);

});


Math.random();
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  } 

function generatePassword(min, max , digits,capitalLett,specialLett){

    const charactes = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        specialSymbols: "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~\\",
        digits: "0123456789"
    };
    
    
    let base = "abcdefghijklmnopqrstuvwxyz";
    
    if(capitalLett){
        base += charactes.uppercase;
    }
    if(specialLett){
        base+= charactes.specialSymbols;
    }
    if(digits){
        base+=charactes.digits;
    }
    let password="";
    for(let i =0 ; i <max-min; i++){
        password += base.charAt(Math.floor(Math.random() * base.length));
    }
    return password;
}



