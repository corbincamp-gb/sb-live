<?php
use Google\ApiCore\ApiException;
use Google\Cloud\RecaptchaEnterprise\V1\Client\RecaptchaEnterpriseServiceClient;
use Google\Cloud\RecaptchaEnterprise\V1\ListKeysRequest;

/**
 * List all the reCAPTCHA keys associate to a Google Cloud project
 *
 * @param string $projectId Your Google Cloud project ID
 */
function list_keys(): void
{
	$projectId = '6LdazjYqAAAAAD0kvGS2fbuaiNgSQfJcEJ_FVMy8';
    $client = new RecaptchaEnterpriseServiceClient();
    $formattedProject = $client->projectName($projectId);

    try {
        $listKeysRequest = (new ListKeysRequest())
            ->setParent($formattedProject)
            ->setPageSize(2);
        $response = $client->listKeys($listKeysRequest);

        print('Keys fetched' . PHP_EOL);

        // Either iterate over all the keys and let the library handle the paging
        foreach ($response->iterateAllElements() as $key) {
            print($key->getDisplayName() . PHP_EOL);
        }

        // Or fetch each page and process the keys as needed
        // foreach ($response->iteratePages() as $page) {
        //     foreach ($page as $key) {
        //         print($key->getDisplayName() . PHP_EOL);
        //     }
        // }
    } catch (ApiException $e) {
        print('listKeys() call failed with the following error: ');
        print($e);
    }
}

list_keys();

?>