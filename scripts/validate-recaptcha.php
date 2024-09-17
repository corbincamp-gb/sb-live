<?php


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
    if (function_exists('curl_init') && function_exists('curl_setopt') && function_exists('curl_exec')) {
        // Use cURL to get data 10x faster than using file_get_contents or other methods
        $ch = curl_init($verifyURL);
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
        $opts = array(
            'http' =>
                array(
                    'method' => 'POST',
                    'header' => 'Content-type: application/x-www-form-urlencoded',
                    'content' => $post_data
                )
        );
        $context = stream_context_create($opts);
        $response = file_get_contents($verifyURL, false, $context);
    }

    // Verify all reponses and avoid PHP errors
    if ($response) {
        $result = json_decode($response);
        if ($result->success === true) {
            return true;
        } else {
            //echo "reCAPTCHA check failed. Please fill check the reCAPTCHA box and resubmit the form.";
            return false;
        }
    }

    // Dead end
    return false;
}