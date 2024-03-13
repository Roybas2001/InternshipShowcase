<?php
header('Access-Control-Allow-Origin: http://localhost:4321');

function readFileToArray() {
    $pathToFile = "../src/constants/projects.txt";

    // Open the file
    $lines = file($pathToFile);
    $line_arr = [];

    foreach ($lines as $line) {
        // Add every line to the array.
        array_push($line_arr, $line);
    }

    // Send the array back to be used.
    return $line_arr;
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Call the function
    $line_arr = readFileToArray();

    // Send Data to front-end
    $data = json_encode($line_arr);

    echo $data;
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
?>