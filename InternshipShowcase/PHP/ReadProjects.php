<?php
header('Access-Control-Allow-Origin: http://localhost:4321');

function readFileToArray()
{
    $pathToFile = "../src/constants/projects.txt";

    // Open the file
    $contents = file_get_contents($pathToFile);
    $line_arr = [];

    // Debug line by line
    $lines = explode("\n", $contents);
    foreach ($lines as $line) {
        $line = trim($line, " \t\n\r\0\x0B,"); // Trim whitespace
        if (!empty($line)) {
            $project = json_decode($line, true);
            if ($project !== null) {
                array_push($line_arr, $project);
            } else {
                echo "Error decoding JSON: " . json_last_error_msg() . "<br>";
                echo "Malformed JSON Line: " . $line . "<br>";
            }
        }
    }

    // Send the array back to be used.
    return $line_arr;
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Call the function
    $line_arr = readFileToArray();

    // Send Data to front-end
    echo json_encode($line_arr);
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
