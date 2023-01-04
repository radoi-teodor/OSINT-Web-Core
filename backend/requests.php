<?php

include('./libs/module-base.php');
include('./libs/func.php');

$modules = rglob('./modules/*.php');
$modulesClasses = [];

for($i = 0; $i < count($modules); $i++){
    include($modules[$i]);


    $moduleName = basename($modules[$i], '.php');

    $category = str_replace('./modules/', '', $modules[$i]);
    $category = str_replace($moduleName.'.php', '', $category);

    if(trim($category)==''){
        $category = 'general';
    } else {
        $category = rtrim($category, '/');
    }

    $moduleClass = reverse_module_name($moduleName);

    $newModuleObject = new $moduleClass([]);

    $modulesClasses[$moduleName]['allowed'] = $newModuleObject->getAllowed();
    $modulesClasses[$moduleName]['name'] = $moduleClass;
    $modulesClasses[$moduleName]['category'] = $category;
    $modulesClasses[$moduleName]['command'] = $moduleName;
    $modulesClasses[$moduleName]['description'] = $newModuleObject->getDescription();
}

header("Content-Type: application/json");

if(isset($_GET['modules'])){
    switch($_GET['modules']){
        case 'show':
            echo json_encode($modulesClasses);
            break;
        case 'exec':
            if(!isset($_GET['module_name'])){
                echo json_encode(['error' => 'no module specified']);
            }
            $moduleName = $_GET['module_name'];
            if(strpos($moduleName, '_')!==false){
                $moduleName = str_replace('_', '-', $moduleName);
            }
            $moduleClass = reverse_module_name($moduleName);
            if(!in_array($moduleName, array_keys($modulesClasses))){
                echo json_encode(['error' => 'module does not exist']);
                break;
            }
            $options = $_GET;
            unset($options['modules']);
            unset($options['module_name']);

            if(!isset($options['limit'])){
                $options['limit'] = 100;
            }

            $module = new $moduleClass($options);

            try {
                echo json_encode($module->run());
            }catch(Exception $e){
                echo json_encode(['error' => strval($e)]);
            }
            break;
    }
}