<?php

$backendDir = 'backend';

$output1 = '';
exec("cd /var/www/.recon-ng && echo 'kali' | sudo -S git pull 2>&1", $output1);

$currentDirectory = getcwd();
$projectPath = str_replace($backendDir, '', $currentDirectory);

$output2 = '';
exec("cd $projectPath && echo 'kali' | sudo -S git pull 2>&1", $output2);

$output = implode('<br/>', $output1) . '<br/><br/>' . implode('<br/>', $output2);

echo $output;