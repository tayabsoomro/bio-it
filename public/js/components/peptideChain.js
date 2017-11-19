function drawPeptide(){

    seq = document.getElementById("sequence").value;

    if(!validPolyPeptide(seq)) {
        alert("You're name isn't Polypeptid'able!");
    }else{

        console.log(seq);

        document.getElementById("peptideChain").src =
            "http://www.tulane.edu/~biochem/WW/PepDraw/pepdraw.php?sequence=" + seq;

        document.getElementById("Credits").innerHTML =
            "Powered by <a href='http://www.tulane.edu/~biochem/WW/PepDraw'>PepDraw</a>";
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