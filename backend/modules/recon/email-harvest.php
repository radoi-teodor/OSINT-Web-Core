<?php

class EmailHarvest extends ModuleBase{
    protected $name = 'EmailHarvest';
    protected $command = 'email-harvest';
    protected $description = 'Collect emails from companies';
    protected $allowed = ['Company', 'Person'];
    
    protected function parseOutput($output){
        $middle = $output;
        $result = [];
        for ($i = 0; $i < count($middle); $i++){
            if(strpos($middle[$i], 'Email:')!==false){
                $email = explode('Email:', $middle[$i])[1];
                $email = trim($email);
                $notes = '';
                $j = 0;
                for($j = 1; $j <= 7; $j++){
                    $arrayLocal = explode(' ', explode(':', $middle[$i + $j])[0]);
                    $infoName = end($arrayLocal);
                    $infoValue = explode(':', $middle[$i + $j])[1];
                    if (trim($infoName) != '' && trim($infoValue) != '') {
                        $notes .= $infoName . ':' . $infoValue . '<br/>';
                    }
                }
                $i += $j;
                array_push($result, [
                    'name' => $email,
                    'details' => $notes,
                    'type' => 'email',
                ]);
            }

            if($this->options['limit']<=count($result)){
                break;
            }
        }
        return $result;
    }
}