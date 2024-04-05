<?php
header('Access-Control-Allow-Origin: http://localhost:4321');

function executeCypress($scriptID)
{
    $output = shell_exec("cd .. && npx cypress run --spec **/" . $scriptID . ".cy.ts");

    tableCreator($output);
}

function tableCreator($output)
{
    // Remove all the special characters from each line
    // TODO: Fix the Regex
    $output = preg_replace('/[^a-zA-Z0-9\s]/', '', $output);

    // Explode the output by newlines
    $lines = explode("\n", $output);

    $table = '<table>';

    foreach ($lines as $line) {
        // Skip empty lines
        if (trim($line) !== '') {
            $table .= '<tr><td class="text-[12px] w-full">' . htmlspecialchars($line) . '</td></tr>';
        }
    }

    $table .= '</table>';

    echo $table;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve Selection Data
    $scriptID = $_POST["id"];

    if ($scriptID === "invalid" || $scriptID === "undefined") {
        echo "Please select a valid option.";
    } else {
        executeCypress($scriptID);
    }
} else {
    http_response_code(405);
    echo "Method not allowed";
}
