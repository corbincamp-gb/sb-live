<?php
// Include PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once('Exception.php');
require_once('PHPMailer.php');
require_once('SMTP.php');

// Define Mail Object
$mail = new PHPMailer(true);                              // Passing `true` enables exceptions
$mail2 = new PHPMailer(true); 

// EDIT THE 2 LINES BELOW AS REQUIRED
$army_subj_add= "[ARMY]";
$navy_subj_add = "[NAVY]";
$af_subj_add = "[AF]";
$mc_subj_add = "[MC]";
$cg_subj_add = "[CG]";
$email_subject = "SkillBridge Commander Contact Form Submission - ";
$ticket_email = "support@skillbridge.zohodesk.com";                        //"dodskillbridgeassistancecenter@livehelpnow.net";
$osd_email = "OSD-SkillBridge@skillbridge.zohodesk.com";
$af_email = "AF-SkillBridge@skillbridge.zohodesk.com";
$army_email = "army@skillbridge.org";                //"Army-SkillBridge@skillbridge.zohodesk.com";
$cg_email = "CG-SkillBridge@skillbridge.zohodesk.com";
$help_email = "Help-SkillBridge@skillbridge.zohodesk.com";
$mc_email = "MC-SkillBridge@skillbridge.zohodesk.com";
$navy_email = "Navy-SkillBridge@skillbridge.zohodesk.com";

// ReCaptcha Response
$recaptcha_response = $_POST['g-recaptcha-response'];

// Interested Service Member Form Data
$first_name = $_POST['form3-first-name']; // required
$last_name = $_POST['form3-last-name']; // required
$rank = $_POST['form3-rank'];
$grade = $_POST['form3-grade'];
$title = $_POST['form3-title'];
$branch = $_POST['form3-branch'];
$current_base = $_POST['form3-current-base'];
$email_from = $_POST['form3-email']; // required
$telephone = $_POST['form3-phone']; // required
$comments = $_POST['form3-comment']; // required

// Create the message body, populate it with form data
$email_message = "<html><body><p style='font-weight:bold;font-size:18px;margin-bottom:20px;'>Interested Unit Commander or Installation Support Office Form Details Below.</p>";

$email_message .= "<p><span style='font-weight:bold;'>First Name:</span> ".clean_string($first_name)."</p>";
$email_message .= "<p><span style='font-weight:bold;'>Last Name:</span> ".clean_string($last_name)."</p>";
$email_message .= "<p><span style='font-weight:bold;'>Rank:</span> ".clean_string($rank)."</p>";
$email_message .= "<p><span style='font-weight:bold;'>Grade:</span> ".clean_string($grade)."</p>";
$email_message .= "<p><span style='font-weight:bold;'>Title:</span> ".clean_string($title)."</p>";
$email_message .= "<p><span style='font-weight:bold;'>Branch of Service:</span> ".clean_string($branch)."</p>";
$email_message .= "<p><span style='font-weight:bold;'>Current Base or Installation:</span> ".clean_string($current_base)."</p>";
$email_message .= "<p><span style='font-weight:bold;'>Email Address:</span> ".clean_string($email_from)."</p>";
$email_message .= "<p><span style='font-weight:bold;'>Phone Number:</span> ".clean_string($telephone)."</p>";
$email_message .= "<p><span style='font-weight:bold;'>Comments:</span> ".clean_string($comments)."</p></body></html>";

$send_additional_army_email = false;

// Validate recaptcha and then create a submission email/ticket
if (validate_recaptcha($recaptcha_response) == true) 
{
    // Create the email
    try 
    {
                //Server settings
  //      $mail->SMTPDebug = 2;                                				// Enable verbose debug output
  //      $mail->isSMTP();                                      				// Set mailer to use SMTP
  //      $mail->Host = 'send.smtp.com';                                      // Specify main and backup SMTP servers
  //      $mail->SMTPAuth = true;                               				// Enable SMTP authentication
  //      $mail->Username = 'support@skillbridge.org'; 						// SMTP username
  //      $mail->Password = 'Vm6z$tAMu5ca>/';                                 // SMTP password
  //      $mail->Port = 25;                                     				// TCP port to connect to
  //      $mail->SMTPKeepAlive = true;


       $mail->SMTPDebug = 2;                                				// Enable verbose debug output
        $mail->isSMTP();                                      				// Set mailer to use SMTP
        $mail->Host = 'smtppro.zoho.com';                                      // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               				// Enable SMTP authentication
        $mail->Username = 'support@skillbridge.org'; 						// SMTP username
        $mail->Password = '!!SkillBridge2024'; 									  // SMTP password
        $mail->Port = 587;                                     				// TCP port to connect to
        $mail->SMTPKeepAlive = true;

        //Recipients
        $mail->setFrom($email_from, $first_name." ".$last_name);

        $new_ticket_email = $ticket_email;

        if($branch == 'Army')
        {
            $email_subject .= $army_subj_add;
            $send_additional_army_email = true;
            $new_ticket_email = $army_email;
        }
        if($branch == 'Navy')
        {
            $email_subject .= $navy_subj_add;
            $new_ticket_email = $navy_email;
        }
        if($branch == 'Air Force')
        {
            $email_subject .= $af_subj_add;
            $new_ticket_email = $af_email;
        }
        if($branch == 'Marine Corps')
        {
            $email_subject .= $mc_subj_add;
            $new_ticket_email = $mc_email;
        }
        if($branch == 'Coast Guard')
        {
            $email_subject .= $cg_subj_add;
            $new_ticket_email = $cg_email;
        }

        $mail->addAddress($new_ticket_email);     // Add a recipient
        //$mail->addAddress('ellen@example.com');               // Name is optional
        //$mail->addReplyTo('info@example.com', 'Information');
        //$mail->addCC('cc@example.com');
        //$mail->addBCC('bcc@example.com');

        //Attachments
        //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

        //Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = $email_subject;
        $mail->Body    = $email_message;
		$mail->setFrom('support@skillbridge.org', $first_name." ".$last_name);  //Recipients
		//$mail->ReplyTo = array($email_from);
		$mail->addCC($email_from);
        //$mail->AltBody = $email_message;

        $mail->send();
        //echo 'Message has been sent';
        
        // If sending this mail to army, send additional email directly to user submitting form with Army message
        if($send_additional_army_email == true)
        {
                //Server settings
        $mail->SMTPDebug = 2;                                				// Enable verbose debug output
        $mail->isSMTP();                                      				// Set mailer to use SMTP
        $mail->Host = 'smtppro.zoho.com';                                      // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               				// Enable SMTP authentication
        $mail->Username = 'support@skillbridge.org'; 						// SMTP username
        $mail->Password = '!!SkillBridge2024';										//'Vm6z$tAMu5ca>/';                                 // SMTP password
        $mail->Port = 587;                                     				// TCP port to connect to
        $mail->SMTPKeepAlive = true;

            // Recipients (Email From is used by LHN to notify the sender of ticket updates)
            $mail2->setFrom('noreply@skillbridge.osd.mil', 'SkillBridge Contact Form');

            $mail2->addAddress($email_from);     // LiveHelpNow Email-to-Ticket email address

            // Content
            $mail2->isHTML(true);   // Set email format to HTML
            
            // Send additional email
            $mail2->Subject = 'Army SkillBridge Submission';
            $mail2->Body    = 'For all U.S. Army personnel and Army installation advisors with questions about the SkillBridge program, please send your inquiry directly to the following email address: <a href="mailto:usarmy.jbsa.imcom-hq.mbx.g1-aces@mail.mil" title="Email Army">usarmy.jbsa.imcom-hq.mbx.g1-aces@mail.mil</a>, and a representative will respond to you as soon as possible.';
			//$mail->setFrom($email_from, $first_name." ".$last_name);  //Recipients
		    $mail2->send();
            
            $mail2->SmtpClose();
        }
    } 
    catch (Exception $e) 
    {
        //echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
    }
}

function clean_string($string) 
{
  $bad = array("content-type","bcc:","to:","cc:","href");
  return str_replace($bad,"",$string);
}
    
function validate_recaptcha($response)
{
    // Verifying the user's response (https://developers.google.com/recaptcha/docs/verify)
    $verifyURL = 'https://www.google.com/recaptcha/api/siteverify';

    // Collect and build POST data
    $post_data = http_build_query(
        array(
            'secret' => '6LcwpDcqAAAAANiFGwKrhnhkUvddYfnZ64DZzH3u',
            'response' => $response,
            'remoteip' => (isset($_SERVER["HTTP_CF_CONNECTING_IP"]) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER['REMOTE_ADDR'])
        )
    );

    // Send data on the best possible way
    if(function_exists('curl_init') && function_exists('curl_setopt') && function_exists('curl_exec')) {
        // Use cURL to get data 10x faster than using file_get_contents or other methods
        $ch =  curl_init($verifyURL);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-type: application/x-www-form-urlencoded'));
            $response = curl_exec($ch);
        curl_close($ch);
    } else {
        // If server not have active cURL module, use file_get_contents
        $opts = array('http' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-type: application/x-www-form-urlencoded',
                'content' => $post_data
            )
        );
        $context  = stream_context_create($opts);
        $response = file_get_contents($verifyURL, false, $context);
    }

    // Verify all reponses and avoid PHP errors
    if($response) {
        $result = json_decode($response);
        if ($result->success===true) {
            return true;
        } else {
            //echo "reCAPTCHA check failed. Please fill check the reCAPTCHA box and resubmit the form.";
            return false;
        }
    }

    // Dead end
    return false; 
} 

?>