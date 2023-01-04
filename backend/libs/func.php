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