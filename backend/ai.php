<?php

require_once(__DIR__ . '/vendor/autoload.php');
include('./libs/func.php');

use Symfony\Component\HttpClient\Psr18Client;
use Tectalic\OpenAi\Authentication;
use Tectalic\OpenAi\Client;
use Tectalic\OpenAi\Manager;
use Tectalic\OpenAi\Models\Completions\CreateRequest;

$env_data = parseEnvFile('.env');
$openai_api_key = getEnvVar($env_data, 'OPENAI_API_KEY', '');

// Build a Tectalic OpenAI REST API Client globally.
$auth = new Authentication($openai_api_key);
$httpClient = new Psr18Client();
Manager::build($httpClient, $auth);

// Build a Tectalic OpenAI REST API Client manually.
$auth = new Authentication($openai_api_key);
$httpClient = new Psr18Client();
$client = new Client($httpClient, $auth, Manager::BASE_URI);

header("Content-Type: application/json");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try{
        // Get the "query" parameter from the POST request
        $prompt = $_POST['query'];

        $response = $client->completions()->create(
            new CreateRequest([
                'model'  => 'text-curie-001',
                'prompt' => $prompt,
            ])
        )->toModel();
        
        // Get the completion text from the response
        $completion = [
            'result'=>$response->choices[0]->text
        ];

        // Return the completion text as the response body
        echo json_encode($completion);
    }catch(Exception $e) {
        echo json_encode([
            'result'=>'Error'
        ]);
    }
}