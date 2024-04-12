<?php
header('Access-Control-Allow-Origin: http://localhost:4321');

function executeCypress($scriptID)
{
    $output = shell_exec("cd .. && npx cypress run --spec **/" . $scriptID . ".cy.ts");

    $html = '<pre>' . htmlspecialchars($output) . "</pre>";

    return $html;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve Selection Data
    $scriptID = $_POST["id"];

    if ($scriptID === "invalid" || $scriptID === "undefined") {
        echo "Please select a valid option.";
    } else {
        $testResult = executeCypress($scriptID);

        echo $testResult;
    }
} else {
    http_response_code(405);
    echo "Method not allowed";
}
