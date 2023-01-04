<?php

class Profiler extends ModuleBase{
    protected $name = 'Profiler';
    protected $command = 'profiler';
    protected $description = 'Collect accounts from usernames';
    protected $allowed = ['Entity'];
    
    protected function parseOutput($output){
        $middle = $output;
        $result = [];
        for ($i = 0; $i < count($middle); $i++){
            if(strpos($middle[$i], 'Resource:')!==false){
                $resource = explode('Resource:', $middle[$i])[1];
                $resource = trim($resource);
                $notes = '';
                for($j = -2; $j < 0; $j++){
                    $arrayLocal = explode(' ', explode(':', $middle[$i + $j])[0]);
                    $infoName = end($arrayLocal);
                    $infoValue = explode(':', $middle[$i + $j])[1];
                    if (trim($infoName) != '' && trim($infoValue) != '') {
                        $notes .= $infoName . ':' . $infoValue . '<br/>';
                    }
                }
                $j = 0;
                for($j = 1; $j <= 2; $j++){
                    $arrayLocal = explode(' ', explode(':', $middle[$i + $j])[0]);
                    $infoName = end($arrayLocal);
                    $infoValue = explode(':', $middle[$i + $j])[1];
                    if(strtolower($infoName)=='url'){
                        $infoValue .= ':' . explode(':', $middle[$i + $j])[2];
                    }
                    if (trim($infoName) != '' && trim($infoValue) != '') {
                        $notes .= $infoName . ':' . $infoValue . '<br/>';
                    }
                }
                $i+=$j;

                array_push($result, [
                    'name' => $resource,
                    'details' => $notes,
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