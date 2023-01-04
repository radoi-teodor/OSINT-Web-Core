<?php

class Hackertarget extends ModuleBase{
    protected $name = 'Hackertarget';
    protected $command = 'hackertarget';
    protected $description = 'Simple reverse whois module for companies';
    protected $allowed = ['Domain'];
    
    protected function parseOutput($output){
        $middle = $output;
        $result = [];
        for ($i = 0; $i < count($middle); $i++){
            if(strpos($middle[$i], 'Host:')!==false){
                $domain = explode('Host:', $middle[$i])[1];
                $domain = trim($domain);
                $notes = '';
                $j = 0;
                for($j = 1; $j <= 5; $j++){
                    $localArray = explode(' ', explode(':', $middle[$i + $j])[0]);
                    $infoName = end($localArray);
                    $infoValue = explode(':', $middle[$i + $j])[1];
                    if (trim($infoName) != '' && trim($infoValue) != '') {
                        $notes .= $infoName . ':' . $infoValue . '<br/>';
                    }
                }
                $i += $j;
                array_push($result, [
                    'name' => $domain,
                    'details' => $notes,
                    'type' => 'domain',
                ]);
            }

            if($this->options['limit']<=count($result)){
                break;
            }
        }
        return $result;
    }
}