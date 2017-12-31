


function drawPeptide(){

    seq = document.getElementById("sequence").value;

    if(!validPolyPeptide(seq)) {
        alert("You're name isn't Polypeptid'able!");
    }else{

        console.log(seq);

        document.getElementById("peptideChain").src =
            "http://www.tulane.edu/~biochem/WW/PepDraw/pepdraw.php?sequence=" + seq;

        document.getElementById("Credits1").innerHTML =
            "Powered by <a href='http://www.tulane.edu/~biochem/WW/PepDraw'>PepDraw</a>";
    }
}


function checkAnswer(){
    answer = document.getElementById("yourAnswer");
    correctAnswer = document.getElementById("imgAnswer");
    alertResponse = document.getElementById("alertResponse");

    // Validate the input
    if(!validPolyPeptide(answer)){
        alertResponse.innerHTML = "Type an answer first!";
        alertResponse.classList.remove("alert-success");
        alertResponse.classList.add("alert-danger");
        return;
    }

    if(answer.value != correctAnswer.value){
        console.log("Wrong: " + correctAnswer.value);
        alertResponse.innerHTML = "Unfortunately it's not the correct answer. Try again!";
        if(alertResponse.classList.contains("alert-success")){
            alertResponse.classList.remove("alert-success");
        }
        alertResponse.classList.add("alert-danger");
    } else{
        console.log("Correct");
        alertResponse.innerHTML = "You got it! Try one more!";
        if(alertResponse.classList.contains("alert-danger")){
            alertResponse.classList.remove("alert-danger");
        }
        alertResponse.classList.add("alert-success");
    }
}

function generatePeptide(){

    alertResponse = document.getElementById("alertResponse");
    alertResponse.classList.remove("alert-success");
    alertResponse.classList.remove("alert-danger");
    alertResponse.innerHTML = "";

    amino_acids = ["A","C","D","E","F","G","H","I","K","L","M","N","P","Q","R","S","T","V","W","Y"];

    numAa = Math.floor((Math.random() * 4) + 2);
    seq = "";
    for(var i = 0; i < numAa; i++){
        random = Math.floor((Math.random() * amino_acids.length-1) + 0);
        if(random < 0 || random > 19 ){
            console.log(random);
        }else{
            seq += amino_acids[random];
        }
    }



    img = document.getElementById("testPeptideChainIMG").src =
        "http://www.tulane.edu/~biochem/WW/PepDraw/pepdraw.php?sequence=" + seq;

    document.getElementById("Credits2").innerHTML =
        "Powered by <a href='http://www.tulane.edu/~biochem/WW/PepDraw'>PepDraw</a>";

    if(document.getElementById("imgAnswer") === null ){
        var imgAnswer = document.createElement("input");
        imgAnswer.setAttribute("type","hidden");
        imgAnswer.setAttribute("id","imgAnswer");
        imgAnswer.setAttribute("value",seq);

        document.getElementById("testPeptideChainIMG").appendChild(imgAnswer);
    } else{
        document.getElementById("imgAnswer").setAttribute("value",seq);
    }


}


function validPolyPeptide(src)
{
    restricted  = "BJOUZ";
    for (var i = 0; i < src.length; i++)
    {
        for (var j = 0; j < restricted.length; j++)
        {
            if (src.charAt(i) == restricted.charAt(j))
                return false;
        }
    }

    return true;
}

function handleInput(e) {
    var ss = e.target.selectionStart;
    var se = e.target.selectionEnd;
    e.target.value = e.target.value.toUpperCase();
    e.target.selectionStart = ss;
    e.target.selectionEnd = se;
}
