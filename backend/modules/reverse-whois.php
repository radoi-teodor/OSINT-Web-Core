<?php

class ReverseWhois extends ModuleBase{
    protected $name = 'Reverse Whois';
    protected $command = 'viewdns_reverse_whois';
    protected $description = 'Simple reverse whois module for companies';
    protected $allowed = ['Domain', 'Company', 'Person', 'Entity'];
    
    protected function parseOutput($output){
        $middle = $output;
        $result = [];
        for ($i = 0; $i < count($middle); $i++){
            if(strpos($middle[$i], 'Domain:')!==false){
                $domain = explode('Domain:', $middle[$i])[1];
                $domain = trim($domain);
                $i++;
                $notes = explode('Notes:', $middle[$i])[1];
                $notes = trim($notes);
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