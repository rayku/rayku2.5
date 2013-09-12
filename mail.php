<?php
if(isset($_POST['email'])) {
  //Change these two lines
  $email_to = "donny@mail.rayku.com";
    $email_subject = "Math Center - Info Call Booking";

    function died($error) {
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }

    // validation expected data exists
    if(!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['phone']) || !isset($_POST['grade'])) {
        died('We are sorry, but there appears to be a problem with the form you submitted. Please go back and try again.');       
    }

    $name = $_POST['name']; // required
    $email_from = $_POST['email']; // required
    $phone = $_POST['phone']; // required
	$grade = $_POST['grade']; // required

    $error_message = "";
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
    if(!preg_match($email_exp,$email_from)) {
      $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
    }
    $string_exp = "/^[A-Za-z .'-]+$/";
    if(!preg_match($string_exp,$name)) {
      $error_message .= 'The First Name you entered does not appear to be valid.<br />';
    }
    if(strlen($error_message) > 0) {
      died($error_message);
    }
    $email_message = "Form details below.\n\n";

    function clean_string($string) {
        $bad = array("content-type","bcc:","to:","cc:","href");
        return str_replace($bad,"",$string);
    }

    $email_message .= "Name: ".clean_string($name)."\n";
    $email_message .= "Email: ".clean_string($email_from)."\n";
    $email_message .= "Phone: ".clean_string($phone)."\n";
    $email_message .= "Grade: ".clean_string($grade)."\n";

    // create email headers
  $headers = 'From: '.$email_from."\r\n".
  'Reply-To: '.$email_from."\r\n" .
  'X-Mailer: PHP/' . phpversion();
  @mail($email_to, $email_subject, $email_message, $headers);
?>

Thank you! We will be in touch within 24 hours. Alternatively, you can call us at any time at 1-888-987-2958. <a href="/">Go back</a>
<!-- Google Code for Book a Call Conversion Page -->
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 978571571;
var google_conversion_language = "en";
var google_conversion_format = "3";
var google_conversion_color = "ffffff";
var google_conversion_label = "hRHtCPXczAYQs6LP0gM";
var google_conversion_value = 50;
var google_remarketing_only = false;
/* ]]> */
</script>
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/978571571/?value=50&amp;label=hRHtCPXczAYQs6LP0gM&amp;guid=ON&amp;script=0"/>
</div>
</noscript>
<?php
}
?>