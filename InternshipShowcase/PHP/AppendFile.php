<?php
header('Access-Control-Allow-Origin: http://localhost:4321');

// Function to append data to the file
function appendToFile($data) {
    $pathToFile = "../src/constants/projects.txt";

    // Open the file in append mode
    $file = fopen($pathToFile, "a");

    // Append the data
    fwrite($file, $data);

    // Close the file
    fclose($file);
}

// Check if form data is recieved.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $id = $_POST["id"];
    $title = $_POST["title"];
    $subtitle = $_POST["subtitle"];

    // Format the data
    $data = "{id: " . "'" . $id . "'" . ", title: " . "'" . $title . "'" . ", subtitle: " . "'" . $subtitle . "'" . ", },\n";

    // Append the data to the file
    appendToFile($data);

    // send response
    echo "Data appended successfully";
} else {
    http_response_code(405);
    echo "Method not allowed";
}
?>