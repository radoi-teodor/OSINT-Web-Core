<?php

require_once(__DIR__ . '/vendor/autoload.php');
include('./libs/func.php');

use Symfony\Component\HttpClient\Psr18Client;
use Tectalic\OpenAi\Authentication;
use Tectalic\OpenAi\Client;
use Tectalic\OpenAi\Manager;
use Tectalic\OpenAi\Models\Completions\CreateRequest;

header("Content-Type: application/json");

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


// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $instructions = strval($_POST['instructions']);
    $nodes = json_decode($_POST['nodes']);
    $prompts = [];
    for($i = 0; $i < count($nodes); $i++){
        $raw_data = trim(parseNodeData($nodes[$i]));
        $raw_data = cutSentencesToFitWordLimit($raw_data, 1000);
        $data = $instructions.' "'.$raw_data.'"';
        array_push($prompts, $data);
    }

    $data = '';
    for($i = 0; $i < count($prompts); $i++){
        $result = getCompletionText($prompts[$i]);

        if($result['result']!='Error'){
            $data.=$result['result'].'<br/>';
        }
    }

    echo json_encode([
        'result'=>$data
    ]);
}

function parseNodeData($node){
    $result = '';

    switch($node->type->name){
        case 'Article':
            $result = extractUrlContent($node->details);
            break;
        default:
            $result = replaceLinksWithContent($node->details);
            break;
    }
    return $result;
}

function getCompletionText($prompt) {
    try{
        global $client;
        // Send the completion request
        $response = $client->completions()->create(
            new CreateRequest([
                'model'  => 'text-curie-001',
                'prompt' => $prompt,
                'max_tokens' => 2047-count_tokens($prompt),
            ])
        )->toModel();
        
        // Get the completion text from the response
        $completion = [
            'result'=>$response->choices[0]->text
        ];

        return $completion;
    } catch(Exception $e) {
        return [
            'result'=>'Error'
        ];
    }
}
