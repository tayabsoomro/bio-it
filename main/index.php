
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="stylesheet" href="./css/vendor/bootstrap.min.css">

        <link rel="stylesheet" href="./css/master.css">

        <link rel="stylesheet" href="./css/titration.css">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

        <title>Interactive Biochemistry Module</title>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

        <script src="https://d3js.org/d3.v4.min.js"></script>


        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-110301788-1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-110301788-1');
        </script>

    </head>
    <body>
      <div class="container-fluid col-lg-12">
          <div class="col-lg-12 text-center" >
              <h3 class="text-center" style="font-family: 'Times New Roman', Times, serif;font-weight:bolder;">Interactive Biochemistry Module</h3>
              <p class="text-center" style="font-size:13px;font-family: 'Times New Roman', Times, serif;">Soomro T<sup>1</sup>, Ahmed R<sup>2</sup>
              <br /><sup>1</sup>Deartpment of Computer Science, University of Saskatchewan
              <br /><sup>2</sup>Departments of Physiology & Pharmacology, University of Saskatchewan</p>
              <br />
              <div class="col-lg-12">
                  <ul class="nav nav-tabs">
                      <li class="active">
                          <a  href="#1" data-toggle="tab">Peptide Chain </a>
                      </li>
                      <li><a href="#2" data-toggle="tab">Titration Curves</a>
                      </li>
                  </ul>
                  <br /><br />
                  <div class="tab-content ">
                      <div class="tab-pane active" id="1">

                          <div class="col-lg-12">
                              <div class="col-lg-2"></div>
                              <div class="col-lg-8">

                                  <div class="panel-group" id="accordion">
                                      <div class="panel panel-default">
                                          <div class="panel-heading">
                                              <h4 class="panel-title">
                                                  <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Generating Polypeptide Sequence</a>
                                              </h4>
                                          </div>
                                          <div id="collapseOne" class="panel-collapse collapse in">
                                              <div class="panel-body">
                                                  <p class="lead">
                                                      Type in your name below to figure out the polypeptide chain of your name. Make sure
                                                      that your name is Polypeptid'able! ;)

                                                  </p>
                                                  <br />
                                                  <div class="input-group">
                                                      <input type="text" oninput="handleInput(event)" class="form-control" placeholder="Type your sequence here" name="sequence" id="sequence"/>
                                                      <div class="input-group-btn">
                                                          <button class="btn btn-primary" onClick="drawPeptide()">Generate</button>
                                                      </div>
                                                  </div>
                                                  <img src="" alt="" id="peptideChain">
                                                  <br />
                                                  <br />
                                                  <span style="font-size:10px;font-style:italic;" id="Credits1"></span>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="panel panel-default">
                                          <div class="panel-heading">
                                              <h4 class="panel-title">
                                                  <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Test Your Knowledge</a>
                                              </h4>
                                          </div>
                                          <div id="collapseTwo" class="panel-collapse collapse">
                                              <div class="panel-body">
                                                  <div class="alert" id="alertResponse"></div>
                                                  <form onsubmit="event.preventDefault();">
                                                  <div class="input-group">
                                                      <input type="text" oninput="handleInput(event)" class="form-control" placeholder="Your answer here." name="sequence" id="yourAnswer" required/>
                                                      <div class="input-group-btn">
                                                          <!-- Buttons -->
                                                          <button class="btn btn-default"  onClick="checkAnswer()">Check</button>
                                                          <button class="btn btn-default" onclick="generatePeptide()"> <i class="fa fa-refresh" aria-hidden="true"></i> </button>
                                                      </div>
                                                  </div>
                                                  </form>
                                                  <br />
                                                  <img src="" alt="" id="testPeptideChainIMG">
                                                  <br />
                                                  <br />
                                                  <span style="font-size:10px;font-style:italic;" id="Credits2"></span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div class="col-lg-2"></div>
                          </div>
                          <div class="col-lg-12">
                          </div>
                      </div>
                      <div class="tab-pane" id="2">
                          <h1 class="lead" style="font-size:30px;font-weight:bold;">Visualize Titration Curves</h1>
                          <div class="col-lg-12">
                              <div class="col-lg-4"></div>
                              <div class="col-lg-4">
                                  <p class="lead">
                                    <form onsubmit="event.preventDefault();">
                                      <div class="form-group">
                                        <select class="form-control" id="aminoAcidSelect" onchange="processSelection()">
                                            <optgroup label="Diprotic">
                                              <option selected value="" disabled hidden="true">Choose an amino acid:</option>
                                                <option>Glycine</option>
                                                <option>Alanine</option>
                                                <option disabled>Proline</option>
                                                <option disabled>Valine</option>
                                                <option disabled>Leucine</option>
                                                <option disabled>Isoleucine</option>
                                                <option disabled>Methionine</option>
                                                <option disabled>Tryptophan</option>
                                                <option disabled>Phenylalanine</option>
                                                <option disabled>Serine</option>
                                                <option disabled>Threonine</option>
                                                <option disabled>Tyrosine</option>
                                                <option disabled>Asparagine</option>
                                                <option disabled>Glutamine</option>
                                                <option disabled>Cysteine</option>
                                            </optgroup>
                                            <optgroup label="Triprotic">
                                                <option disabled>Lysine</option>
                                                <option disabled>Argenine</option>
                                                <option disabled>Histidine</option>
                                                <option disabled>Aspartate</option>
                                                <option disabled>Glutamate</option>
                                            </optgroup>
                                        </select>
                                      </div>
                                    </form>
                                  </p>
                              </div>
                              <div class="col-lg-4"></div>
                          </div>
                          <div class="col-lg-12">



                              <button class="btn btn-primary" id="btn-rev"><i class="fa fa-backward" aria-hidden="true"></i></button>
                              <button class="btn btn-primary" id="btn-fwd"> <i class="fa fa-forward" aria-hidden="true"></i></button>

                          </div>
                          <div class="col-lg-12">
                              <div class="titrationRender"></div></div>
                          </div>
                          <div class="col-lg-12">
                            <hr/>
                            <p style="font-style:italic;font-size:12px;font-family: Times New Roman, Serif;">
                              <b><u>References</u></b><br />
                              PepDraw: 2D peptide bonds image generation script.<br />
                              D3JS: Titration curves and their animation.<br />
                            </p>
                          </div>
                      </div>
                  </div>
              </div>
              <br />
            </div>
      </div>

      <!-- Biomolecules JavaScript -->
      <script src="js/components/peptideChain.js"></script>
      <script src="js/titration/titrationCurve.js"></script>

      <script type="text/javascript">
            function processSelection(){

                diprotic = ["Glycine","Alanine","Proline","Valine","Leucine","Isoleucine","Methionine","Tryptophan","Phenylalanine","Serine","Threonine","Tyrosine","Asparagine","Glutamine","Cysteine"];

                triprotic = ["Lysine","Argenine","Histidine","Aspartate","Glutamate"];

                var selectBox = document.getElementById("aminoAcidSelect");
                var selectedValue = selectBox.options[selectBox.selectedIndex].value;


                switch(selectedValue){
                    case "Glycine":
                        clickStackNum = 0;
                        titrationGlycine();
                        break;
                    case "Alanine":
                        clickStackNum = 0;
                        titrationAlanine();
                    case "Valine":
                        clickStackNum = 0;
                        titrationAlanine();
                        break;
                    default:
                        console.log("Ahan!");
                }

            }
            generatePeptide();
      </script>
    </body>
</html>
