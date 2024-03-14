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
    $filename = $_POST["filename"];

    // File upload
    $file = $_FILES["file"];
    $targetDirectory = "../src/pages/posts/";

    // Modify the target file path to include "Docs" prefix
    // and the filename from the form input
    $targetFile = $targetDirectory . "Docs" . $filename . ".md";

    // Move the uploaded file to the target directory with the modified filename
    move_uploaded_file($file["tmp_name"], $targetFile);

    // Format the data
    $data = array(
        "id" => $id,
        "title" => $title,
        "subtitle" => $subtitle,
        "filename" => "Docs" . $filename
    );

    $json_data = json_encode($data) . ",\n";

    // Append the data to the file
    appendToFile($json_data);

    // send response
    echo "Data appended successfully";
} else {
    http_response_code(405);
    echo "Method not allowed";
}
?>