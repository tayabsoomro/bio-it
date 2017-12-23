<?php

$submitted = false;

if(isset($_POST['submit'])) {
  // Submitting feedback
  $name = isset($_POST['name']) ? $_POST['name'] : "N/a";
  $feedback = $_POST['feedback'];

  // // Escape user input
  $name = addslashes($name);
  $feedback = addslashes($feedback);
  $ip = get_client_ip();

  // Adding feedback to the database
  $servername = "localhost";
  $username = "tayaxord_admin";
  $password = "Tayab123";

  // Create connection
  $conn = mysqli_connect("localhost", "tayaxord_admin", "Tayab123", "tayaxord_ibiocm");

  // Check connection
  if (mysqli_connect_errno()) {
      die("Connection failed: " . mysqli_connect_error());
  }else{

    $query = "INSERT INTO `feedback` (author_name,author_ip,feedback) VALUES ('$name','$ip','$feedback')";

    if (mysqli_query($conn,$query) === TRUE) {
      echo "Yo!";
      $submitted = true;
    }else{
      echo "This-> " . mysqli_error($conn);
    }

    mysqli_close($conn);

  }

}

function get_client_ip() {
    $ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

?>
