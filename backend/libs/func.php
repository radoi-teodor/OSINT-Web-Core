<?php

function reverse_module_name($name){
    $result = [];
    if (strpos($name, '-') != NULL) {
        $result = explode('-', $name);
    }else if(strpos($name, '_') != NULL){
        $result = explode('_', $name);
    }else{
        $result = [$name];
    }
    for($i = 0; $i < count($result); $i++){
        $result[$i] = ucfirst($result[$i]);
    }
    $result = implode($result);
    return $result;
}

function get_module_name($name){
    $result = preg_split('/(?=[A-Z])/',$name);
    for($i = 0; $i < count($result); $i++){
        $result[$i] = strtolower($result[$i]);
        if($i>0 && $i<count($result)-1){
            $result[$i] .= '-';
        }
    }
    $result = implode($result);
    return $result;
}

function rglob($pattern, $flags = 0) {
    $files = glob($pattern, $flags);
    foreach (glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
        $files = array_merge(
            [],
            ...[$files, rglob($dir . "/" . basename($pattern), $flags)]
        );
    }
    return $files;
}


function getRelativePath($from, $to)
{
    $from = is_dir($from) ? rtrim($from, '\/') . '/' : $from;
    $to   = is_dir($to)   ? rtrim($to, '\/') . '/'   : $to;
    $from = str_replace('\\', '/', $from);
    $to   = str_replace('\\', '/', $to);

    $from     = explode('/', $from);
    $to       = explode('/', $to);
    $relPath  = $to;

    foreach($from as $depth => $dir) {
        if($dir === $to[$depth]) {
            array_shift($relPath);
        } else {
            $remaining = count($from) - $depth;
            if($remaining > 1) {
                $padLength = (count($relPath) + $remaining - 1) * -1;
                $relPath = array_pad($relPath, $padLength, '..');
                break;
            } else {
                $relPath[0] = './' . $relPath[0];
            }
        }
    }
    return implode('/', $relPath);
}

// env
function parseEnvFile($filename) {
    // Initialize an empty array to hold the key-value pairs
    $envVars = array();

    // Open the file for reading
    $file = fopen($filename, 'r');

    // Read each line of the file
    while (($line = fgets($file)) !== false) {
        // Split the line on the equals sign
        $parts = explode('=', $line, 2);
        if (count($parts) == 2) {
            // If the line has a key and a value, add them to the array
            $envVars[trim($parts[0])] = trim($parts[1]);
        }
    }

    // Close the file
    fclose($file);

    // Return the array of key-value pairs
    return $envVars;
}

function getEnvVar($envVars, $key, $default = null) {
    if (array_key_exists($key, $envVars)) {
        return $envVars[$key];
    } else {
        return $default;
    }
}

function extractUrlContent($url) {
    // Retrieve the HTML source code of the page
    $url = preg_replace('/\s+/', '', $url);

    $options = array(
        'http' => array(
          'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        )
      );
      
    $context = stream_context_create($options);

    $html = file_get_contents($url, false, $context);

    // Parse the HTML source code
    $dom = new DOMDocument();
    @$dom->loadHTML($html);

    // Initialize a string to store the extracted content
    $articleContent = '';

    // Extract the content of all paragraphs in the article
    $paragraphs = $dom->getElementsByTagName('p');
    foreach ($paragraphs as $paragraph) {
        // Add each paragraph's text content to the article content string, if it is not a title or subtitle
        if (!in_array($paragraph->getAttribute('class'), array('title', 'subtitle'))) {
            $articleContent .= $paragraph->textContent . "\n";
        }
    }

    // If no content was extracted, try extracting the content from div elements instead
    if ($articleContent == '') {
        $divs = $dom->getElementsByTagName('div');
        foreach ($divs as $div) {
            // Add each div's text content to the article content string, if it is not a title or subtitle
            if (!in_array($div->getAttribute('class'), array('title', 'subtitle'))) {
                $articleContent .= $div->textContent . "\n";
            }
        }
    }

    // If no content was still extracted, try extracting the content from span elements instead
    if ($articleContent == '') {
        $spans = $dom->getElementsByTagName('span');
        foreach ($spans as $span) {
            // Add each span's text content to the article content string, if it is not a title or subtitle
            if (!in_array($span->getAttribute('class'), array('title', 'subtitle'))) {
                $articleContent .= $span->textContent . "\n";
            }
        }
    }

    // Trim leading and trailing whitespace from the extracted content
    $articleContent = trim($articleContent);

    // Remove any links from the extracted content
    $articleContent = preg_replace('#(<a[^>]*>|</a>)#', '', $articleContent);

    // Remove any remaining HTML tags from the extracted content
    $articleContent = strip_tags($articleContent);

    // Return the extracted content
    return $articleContent;
} 

function replaceLinksWithContent($text) {
    // Initialize a counter to keep track of the number of links replaced
    $linkCounter = 0;

    // Extract all links from the text
    preg_match_all('#\bhttps?://[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|/))#', $text, $matches);
    $links = $matches[0];

    // Replace each link with its content
    foreach ($links as $link) {
        // Extract the content of the link
        $linkContent = extractUrlContent($link);

        // Replace the link with "Reference-n" in the text, where n is the link number
        $linkCounter++;
        $text = str_replace($link, "Reference-$linkCounter", $text);

        // Append the link content to the end of the text
        $text .= "\n\nReference-$linkCounter:\n$linkContent\n";
    }

    // Return the modified text
    return $text;
}


function cutSentencesToFitWordLimit(string $text, int $wordLimit) {
    // Split the text into an array of words
    $words = explode(" ", $text);
  
    // Initialize a variable to keep track of the current word count
    $currentWordCount = 0;
  
    // Initialize a variable to store the result
    $result = "";
  
    // Iterate through the words
    foreach ($words as $word) {
      // If adding the current word to the result would exceed the word limit, stop the loop
      if ($currentWordCount + str_word_count($word) > $wordLimit) {
        break;
      }
  
      // Add the current word to the result
      $result .= $word . " ";
  
      // Increment the current word count
      $currentWordCount += str_word_count($word);
    }
  
    // Return the result
    return $result;
} 

function count_tokens($string) {
    // Remove all punctuation from the string
    $string = preg_replace("/[^a-zA-Z0-9\s]/", "", $string);
    // Split the string into an array of words
    $words = explode(" ", $string);
    // Initialize a token count variable
    $token_count = 0;
    // Loop through each word and add the number of tokens it contains to the total
    foreach ($words as $word) {
        $token_count += ceil(strlen($word) / 4);
    }
    // Return the total number of tokens
    return intval($token_count);
}