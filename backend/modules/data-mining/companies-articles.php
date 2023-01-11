<?php

class CompaniesArticles extends ModuleBase{
    protected $name = 'CompaniesArticles';
    protected $command = 'companies-articles';
    protected $description = 'Collect articles for companies';
    protected $allowed = ['Company'];

    protected function parseOutput($output){
        $middle = $output;
        $result = [];
        for ($i = 0; $i < count($middle); $i++){
            if(strpos($middle[$i], 'title:')!==false && $i+1<count($middle) && strpos($middle[$i+1], 'url:')!==false){

                $title = explode('title:', $middle[$i])[1];
                $title = trim($title);

                $url = explode('url:', $middle[$i+1])[1];
                $url = trim($url);

                $i++;
                array_push($result, [
                    'name' => $title,
                    'details' => $url,
                    'type' => 'article',
                ]);
            }

            if($this->options['limit']<=count($result)){
                break;
            }
        }
        return $result;
    }
}
