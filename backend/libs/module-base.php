<?php
abstract class ModuleBase{

    protected $name;
    protected $command;
    protected $description;
    protected $options = [];
    protected $allowed = [];

    public function __construct($options) {
        $this->options = $options;
    }

    public function getName(){
        return $this->name;
    }

    public function getCommand(){
        return $this->command;
    }

    public function getDescription(){
        return $this->description;
    }

    public function getOptions(){
        return $this->options;
    }

    public function setOptions($options){
        $this->options = $options;
    }

    public function getAllowed(){
        return $this->allowed;
    }


    abstract protected function parseOutput($output);

    public function run(){
        $stringArgs = '';

        foreach($this->options as $key => $value){
            $stringArgs.="-o $key='$value' ";
        }
        $command = "recon-cli -m $this->command $stringArgs -x";
        $command .= " 2>&1";
        $output = '';
        $returnStatus = '';
        exec($command, $output, $returnStatus);
        
        return $this->parseOutput($output);
    }
}