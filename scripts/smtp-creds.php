<?php

//Server settings
$mail->SMTPDebug = 2;                                				// Enable verbose debug output
$mail->isSMTP();                                      				// Set mailer to use SMTP
$mail->Host = 'smtppro.zoho.com';                                      // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               				// Enable SMTP authentication
$mail->Username = 'support@skillbridge.org'; 						// SMTP username
$mail->Password = '!!SkillBridge2024'; 									  // SMTP password
$mail->Port = 587;                                     				// TCP port to connect to
$mail->SMTPKeepAlive = true;
